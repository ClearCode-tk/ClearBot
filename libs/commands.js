const { Client, Message, Permissions } = require("discord.js");

// Built-in Modules //

const Path = require("path");
const fs = require("fs");

class Commands {
  constructor(options) {
    options = Object.assign({
      permissions: { bot: [Permissions.FLAGS.SEND_MESSAGES],
      user: [Permissions.FLAGS.SEND_MESSAGES] },
      commandName: this.constructor.name.toLowerCase(),
      description: "No Description",
      dontLoad: false
    }, options);

    this.description = options.description || "No Description";
    this.commandName = options.commandName || this.constructor.name.toLowerCase();

    /** @type {Permissions.FLAGS[]} */
    this.permissions = options.permissions || { bot: [Permissions.FLAGS.SEND_MESSAGES], user: [Permissions.FLAGS.SEND_MESSAGES] };

    /** @type {Message} */
    this.message = {};

    /** @type {string[]} */
    this.args = [];
    this.allCmds = [];

    this.prefix = "";
    this.dontLoad = options.dontLoad || false;
  }

  /**
   * Gets all commands as an object
   * 
   * @returns {{ [x: string]: string & { name: string, permissions: { bot: Array<any>, user: Array<any> } } }}
   */
  getCommandList() {
    const obj = {
      prefix: this.prefix
    };

    for (const cmd of this.allCmds) {
      const name = cmd.getCommandName();
      const perms = cmd.getPermissions();
      const description = cmd.getDescription();

      obj[name] = {
        name,
        permissions: perms,
        description
      }
    }

    return obj;
  }

  /**
   * Gets the command description
   */
  getDescription() {
    return this.description;
  }

  /**
   * Gets the command name
   */
  getCommandName() {
    return this.commandName;
  }

  /**
   * Gets the permissions object
   */
  getPermissions() {
    return this.permissions;
  }

  /**
   * Set the required permissions for the command
   * 
   * @type type {"bot" | "user"} - Select permissions for the bot or the user
   * @type perms {Permissions.FLAGS[]} - Array of permissions
   */
  setPermissions(type, perms) {
    if (!this.permissions.hasOwnProperty(type)) return;

    this.permissions[type] = perms;
  }

  addPermission(type, perm) {
    if (
      !this.permissions.hasOwnProperty(type)
      || this.permissions.includes(perm)
    ) return;

    this.permissions[type].push(perm)
  };

  /**
   * Check perms on the bot or user
   */
  checkPerms(bot, user) {
    try {
      if (!bot.hasPermission(this.permissions.bot))
        return `I don't have these permissions: \`${this.permissions.bot.join(", ")}\``;
      if (!user.hasPermission(this.permissions.user))
        return `I don't have these permissions: \`${this.permissions.user.join(", ")}\``;

      return true;
    } catch (err) {
      return `There was an error: 
      \`\`\`${err}\`\`\`
      `;
    }
  }
  
}

class CommandList {
  constructor(commandArray, prefix) {
    if (typeof commandArray !== "undefined" && !Array.isArray(commandArray))
      throw new Error("Cannot create CommandList because commandArray is not an array.");

    this.commands = commandArray || [];
    this.data = {};

    this.prefix = prefix || "+";
  }

  /**
   * Load commands into the bot
   * 
   * @param {Client} client - The client from discord.js used for the bot
   */
  loadCommands(client, globals) {
    if (!client) return;

    for (const command of this.commands) {
      if (command.dontLoad) continue;
      this.data[command.commandName] = command;
      this.data[command.commandName].allCmds = this.commands;      
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
        this.data[cmd].prefix = this.prefix;
        
        const hasPerms = this.data[cmd].checkPerms(message.guild.me, message.member);

        if (hasPerms === true) {
          this.data[cmd].run(message, args, globals)
            .catch(err => {
              message.channel.send(`There was in error in the command ${cmd}: \`${err}\``);
            });
        } else if (typeof hasPerms == "string") {
          message.channel.send(hasPerms);
        }
      }
    });
  }

  loadFolder(folderPath, client, globals) {
    if (!client) return;

    folderPath = Path.resolve(folderPath);
    fs.readdir(folderPath, (err, files) => {
      for (const file of files) {
        if (file.endsWith(".js")) {
          const commandModule = require(Path.join(folderPath, file))

          if (commandModule instanceof Commands) this.commands.push(commandModule);
        }
      }

      this.loadCommands(client, globals);
    });
  }
}

module.exports = { Commands, CommandList };