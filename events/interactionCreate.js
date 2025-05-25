const { Events, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');


let aiPromise = (async () => {
	const { GoogleGenAI } = await import('@google/genai');
	return new GoogleGenAI({ apiKey: "AIzaSyBfUEg02aJSFhD6yc-aUINlFnV5-9G8mso" });
})();

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
			}
		} else if (interaction.isButton()) {
			let rating;
			fs.readFile('Rating.txt', (err, data) => {
				if (err) throw err;

				rating = data.toString();
			});
			let text;
			await interaction.update({ content: text, components: [] })
			let generate = (async () => {
				let ai = await aiPromise;
				let gemresponse = await ai.models.generateContent({
					model: "gemini-2.0-flash",
					contents: `Give me one ${rating} question for a game of Truth and Dare. No explain is needed for the questions and should be short. The question can be pretty unhinged if R rated unhinged enough to question people as to why they got that asked. The questions must be unique like never seen before. Only the question should be provided no need for saying 'Truth:' or anything like that.`,
					config: {
						temperature: 2.0,
					},
				});
				return gemresponse.text;

			})();
			let myObject = {};
			myObject[text] = await generate;    // text = await generate;

			const Truth = new ButtonBuilder()
				.setCustomId('truth')
				.setLabel('Truth')
				.setStyle(ButtonStyle.Danger);

			const row = new ActionRowBuilder()
				.addComponents(Truth);


			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: myObject[text], components: [row] });
			} else {
				await interaction.reply({ content: text, components: [row], withResponse: true, });
			}
		} else if (interaction.isStringSelectMenu()) {
			// respond to the select menu
		}
	},
};