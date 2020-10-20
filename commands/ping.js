const { Message } = require("discord.js");
const { Commands } = require("../libs/commands");

class Ping extends Commands {
  constructor(options) {
    super(options);

    // accessible props //

    // this.permissions --- { bot: PERMISSIONS[],  user: PERMISSIONS[]  }
    // this.message  --- Discord.js Message Object
    // this.args  --- String[]
    // this.prefix  --- String
  }

  // Accessible methods //

  // this.getCommandList() -- Retrieve an Object with all the commands



  // Start of Methods //

  /**
   * 
   * @param {Message} message - Message object
   * @param {string[]} args - Array of arguments
   */
  async run(message, args) {
    const item = this.getCommandList();

    console.log(item);
  }
}

module.exports = new Ping({
  description: "DESCRIPTION HERE",
  dontLoad: true
}); // Make sure to export a new class of your command