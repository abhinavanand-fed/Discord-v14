const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js') ;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tutorial')
        .setDescription('Start the tutorial'),
    
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x991be2)
            .setTitle('Tutorial')
            .setDescription('Welcome to the tutorial!')

//all the buttons to change the page
        const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('no1')
                        .setEmoji('✅')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('no2')
                        .setEmoji('❎')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('page')
                        .setLabel('setup')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),    
                    new ButtonBuilder()
                        .setCustomId('step1')
                        .setEmoji('👍')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('last')
                        .setEmoji('🗒️')
                        .setStyle(ButtonStyle.Primary)
                )

        await interaction.reply({
            content: '',
            embeds: [embed],
            components: [buttons],
            ephemeral: false
        })
    }
}