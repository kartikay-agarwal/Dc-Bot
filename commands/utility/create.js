const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ChannelType, Colors, ButtonBuilder, ButtonStyle, PermissionFlagsBits, } = require('discord.js')


module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Creates a channel'),
	async execute(interaction) {
		interaction.guild.channels.create({
			name: `Ticket-${interaction.user.username}`,
			parent: "1327936337592062014",
			type: ChannelType.GuildText,
		})
			.then((c) => {
				c.send({
					embeds: [{
						title: "Ticket System",
						description: `Welcome to your ticket ${interaction.user} !\nA staff will come and take care of you as soon as possible !`,
						color: Colors.Blurple,
						footer: {
							text: "Ticket System"
						},
						timestamp: new Date()
					}],
					components: [
						new ActionRowBuilder()
							.addComponents(
								new ButtonBuilder().setCustomId('close').setLabel('Close').setStyle(ButtonStyle.Danger)
							)
					]
				});
				c.send({
					content: `${interaction.user}`
				}).then(msg => {
					setTimeout(() => {
						msg.delete(), 1000
					})
				});
			});
	},
};

