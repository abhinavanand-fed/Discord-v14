const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, resolveColor, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balloon-burst')
        .setDescription('Play  a simple baloon game')
        .addBooleanOption(option =>
            option
                .setName('ephemeral')
                .setDescription('Whether or not the echo should be ephemeral')
        ),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(resolveColor([parseInt(Math.random() * 256), parseInt(Math.random() * 256), parseInt(Math.random() * 256)]))
            .setTitle('Rules')
            .setDescription('The ballon will pop after a random ammount of pumps.Clieck the \'Pump\' Button to pump the ballon!!')
            .setTimestamp()
            .setFooter({text: `Game Started by ${interaction.member.displayName}`});
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('pumpitup')
                .setLabel('0 Pump(s)')
                .setStyle(ButtonStyle.Primary)
        );
        
        await interaction.reply({
            content: '🎈',            
            components: [row],
            embeds: [embed],
            ephemeral: interaction.options.getBoolean('ephermal')
        });
    }
};