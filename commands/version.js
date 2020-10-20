const { Message, MessageEmbed } = require('discord.js');
const { Commands } = require('../libs/commands');
const { color, version, name } = require('../globals.json');

class Version extends Commands {
  constructor(options) {
    super(options);
  }

  async run(message, args) {
    
  }
}

module.exports = new Version({
  description: 'Shows Version of Bot'
});