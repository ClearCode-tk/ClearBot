// Dependencies //
const env = require("dotenv");
const { Client, MessageEmbed } = require("discord.js");

// Built-in Modules //
const Path = require("path");
const fs = require("fs");
const globals = require('./globals.json');

// Init DB //
const { db } = require("./database/firestore");

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

  commands.loadFolder("./commands", bot, globals);
});

bot.login(process.env.Token);