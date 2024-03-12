const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user.'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('submit_report')
                    .setLabel('Submit Report')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ content: 'Tap here to report', components: [row] });

        const collectorFilter = i => i.isButton() && i.customId === 'submit_report';
        const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 15000 });

        collector.on('collect', async i => {
            const modal = new ModalBuilder()
                .setTitle('Report User') // Ensure 'Report User' is a string
                .addField('Please provide the following information:', [
                    new TextInputBuilder()
                        .setCustomId('user-id')
                        .setLabel('User ID')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),
                    new TextInputBuilder()
                        .setCustomId('username')
                        .setLabel('Username')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),
                    new TextInputBuilder()
                        .setCustomId('link')
                        .setLabel('Evidence Link')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ]);


            modal.addComponents(userIdInput, usernameInput, linkInput);

            await i.reply({ content: 'Please provide the following information:', components: [], embeds: [modal] });

            const modalCollectorFilter = m => m.isMessageComponent() && m.customId === 'submit_report';
            const modalCollector = interaction.channel.createMessageComponentCollector({ filter: modalCollectorFilter, time: 30000 });

            modalCollector.on('collect', async m => {
                const userId = m.values['user-id'];
                const username = m.values['username'];
                const link = m.values['link'];

                const reportChannel = interaction.client.channels.cache.get('1189856644805443634');
                if (reportChannel) {
                    await reportChannel.send(`ID: ${userId}\nUsername: ${username}\nLink: ${link}`);
                }

                await interaction.followUp('Report submitted.');
                modalCollector.stop();
            });

            modalCollector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.followUp('Report timed out.');
                }
            });
        });
    },
};