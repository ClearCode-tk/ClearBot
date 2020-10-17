const { Client } = require("discord.js");

const bot = new Client();

bot.on("ready", () => {
  console.log("Bot is ready!");
});

bot.login(process.env.Token);