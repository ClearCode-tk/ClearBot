const { Message, MessageEmbed } = require('discord.js');
const { Commands } = require('../libs/commands');
const { prefix, color, name } = require('../globals.json');

class Help extends Commands {
	constructor(options) {
		super(options);
	}
  
	async run(message, args) {
		const item = this.getCommandList();

		// You could also do this

		const HelpEmbed = new MessageEmbed()
			.setTitle(`Showing Bot Commands for ${name}`)
			.setDescription(`The prefix for ${name} is ${prefix}`)
			.setColor(color);

		for (let i in item) {
			let x = item[i];
			if (typeof x == 'object') {
				HelpEmbed.addField(x.name, x.description)
			}
		}

		message.channel.send(HelpEmbed);
	}
}

module.exports = new Help({
  description: "Shows this panel; gives list of commands"
});
