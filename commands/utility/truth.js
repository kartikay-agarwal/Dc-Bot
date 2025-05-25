const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const interactionCreate = require('../../events/interactionCreate');

// const { response } = require('express');
// require('dotenv').config();

let aiPromise = (async () => {
  const { GoogleGenAI } = await import('@google/genai');
  return new GoogleGenAI({ apiKey: "AIzaSyBfUEg02aJSFhD6yc-aUINlFnV5-9G8mso" });
})();

module.exports = {

  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('truth')
    .setDescription('Replies with a Gemini AI message!')
    .addStringOption(option =>
      option
        .setName('rating')
        .setDescription('Rating of the question')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const Rating = interaction.options.getString('rating');
      let ai = await aiPromise;
      let gemresponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Give me one ${Rating} question for a game of Truth and Dare. No explain is needed for the questions and should be short. The question can be pretty unhinged if R rated unhinged enough to question people as to why they got that asked. The questions must be unique like never seen before. Only the question should be provided no need for saying 'Truth:' or anything like that.`,
        config: {
          temperature: 2.0,
        },
      });
      fs.writeFile('Rating.txt', Rating, (err) => {

        // In case of a error throw err.
        if (err) throw err;
      })
      let text = gemresponse.text;

      const exampleEmbed = new EmbedBuilder()
        .setColor(5156543)
        .setTitle(text)
        .setAuthor({ name: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 1024 }) })
        .setFooter({ text: `Type: TRUTH | Rating: ${Rating}` });

      const Truth = new ButtonBuilder()
        .setCustomId('truth')
        .setLabel('Truth')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder()
        .addComponents(Truth);

      await interaction.editReply({ embeds: [exampleEmbed], components: [row], withResponse: true, });

    } catch (err) {
      console.error('Error generating response:', err);
      interaction.reply("The AI couldn't respond. Please try again later.");
    }
  },
};


