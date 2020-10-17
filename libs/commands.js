const { Client, Message } = require("discord.js");

// Built-in Modules //

const Path = require("path");
const fs = require("fs");

class Commands {
  constructor(commandName) {
    this.commandName = commandName ?? this.constructor.name.toLowerCase();

    /** @type {Message} */
    this.message = {};

    /** @type {string[]} */
    this.args = [];
  }
}

class CommandList {
  constructor(commandArray, prefix) {
    if (typeof commandArray !== "undefined" && !Array.isArray(commandArray))
      throw new Error("Cannot create CommandList because commandArray is not an array.");

    this.commands = commandArray ?? [];
    this.data = {};

    this.prefix = prefix ?? "+";
  }

  /**
   * Load commands into the bot
   * 
   * @param {Client} client - The client from discord.js used for the bot
   */
  loadCommands(client) {
    if (!client) return;

    for (const command of this.commands) {
      this.data[command.commandName] = command;
    }
    
    client.on("message", (message) => {
      if (message.author.bot) return;

      let { content } = message;
      if (!content.startsWith(this.prefix)) return;
      else content = content.replace(this.prefix, "");

      const args = content.trim().split(" ");
      const cmd = args.splice(0, 1);

      if (this.data.hasOwnProperty(cmd)) {
        this.data[cmd].message = message;
        this.data[cmd].args = args;

        this.data[cmd].run(message, args);
      }
    });
  }

  loadFolder(folderPath, client) {
    if (!client) return;

    folderPath = Path.resolve(folderPath);
    fs.readdir(folderPath, (err, files) => {
      for (const file of files) {
        if (file.endsWith(".js")) this.commands.push(require(Path.join(folderPath, file)));
      }

      this.loadCommands(client);
    });
  }
}

module.exports = { Commands, CommandList };