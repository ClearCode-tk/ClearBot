const { Message } = require("discord.js");
const { Commands } = require("../libs/commands");

class Ping extends Commands {
  constructor() {
    super();
  }

  /**
   * 
   * @param {Message} message - Message object
   * @param {string[]} args - Array of arguments
   */
  run(message, args) {
    const mentions = message.mentions.members;
    const user = mentions.first()
    
    let amnt = args[1] ? parseInt(args[1]) : 5;
    if (isNaN(amnt)) amnt = 5;

    let interval = args[2] ? parseInt(args[2]) : 1500;
    if (isNaN(interval)) interval = 1500;

    let index = 0;

    this.interval = setInterval(() => {
      if (index >= amnt) return this.interval = clearInterval(this.interval);

      this.pingeth(`<@${user.user.id}> Ping #${index + 1}`);

      index++;
    }, interval);

  }

  pingeth(mention) {
    this.message.channel.send(mention);
  }
}

module.exports = new Ping; // Make sure to export a new class of your command