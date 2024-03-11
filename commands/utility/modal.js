const { SlashCommandBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user.'),
        async execute(interaction) {
            const userId = interaction.options.getString('user-id');
            const username = interaction.options.getString('username');
            const link = interaction.options.getString('link');
        
            // Send the report button to the specified channel
            const reportChannel = interaction.client.channels.cache.get('1189856644805443635');
            const responseChannel = interaction.client.channels.cache.get('1189856644805443635'); // Change CHANNEL_ID_HERE to your desired channel ID
        
            if (reportChannel && responseChannel) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('submit_report')
                            .setLabel('Submit Report')
                            .setStyle(ButtonStyle.Primary)
                    );
        
                await reportChannel.send({ content: `ID: ${userId}\nUsername: ${username}\nLink: ${link}\n---`, components: [row] });
        
                const collectorFilter = i => i.isButton() && i.customId === 'submit_report';
                const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 15_000 });
        
                collector.on('collect', async i => {
                    const modal = new ModalBuilder()
                        .setTitle('Modal Title')
                        .setDescription('Modal Description')
                        .setSubmitButton('Submit')
                        .setCancelButton('Cancel');
        
                    await i.reply({ content: 'Please provide additional information in the modal.', components: [], embeds: [modal] });
        
                    const modalCollectorFilter = m => m.author.id === interaction.user.id;
                    const modalCollector = responseChannel.createMessageCollector({ filter: modalCollectorFilter, time: 30000 });
        
                    modalCollector.on('collect', async m => {
                        await interaction.followUp(`Report submitted. Additional information: ${m.content}`);
                        modalCollector.stop();
                    });
        
                    modalCollector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.followUp('Report timed out.');
                        }
                    });
                });
            } else {
                interaction.reply({ content: 'Error: Report channel not found.', ephemeral: true });
            }
        },
    };