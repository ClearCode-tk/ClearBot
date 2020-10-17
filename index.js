// Dependencies //
const env = require("dotenv");
const { Client, MessageEmbed } = require("discord.js");

// Built-in Modules //
const Path = require("path");
const fs = require("fs");

// Commands //
const { Commands, CommandList } = require("./libs/commands");
const commands = new CommandList();

////////

// Create client instance //
const bot = new Client();

// LOAD BOT CONFIG //
env.config();

bot.on("ready", () => {
  console.log("Bot is ready!");

  commands.loadFolder("./commands", bot);
});

bot.login(process.env.Token);