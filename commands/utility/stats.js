const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('shows stats'),
    async execute(interaction) {
        await interaction.reply(`Server count: ${guilds.cache.size}.`)
    },
}