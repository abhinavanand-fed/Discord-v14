const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, InteractionType, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pingg')
    .setDescription('Replies with Pong! and measures latencies'),
  async execute(interaction) {
    if (interaction.isCommand()) {
      const confirm = new ButtonBuilder()
        //.setCustomId('confirm,') // Unique identifier for the button
        .setLabel('More Info')
        .setURL('https://discord.gg/3jqWNZEueD')
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder().addComponents(confirm);

      const sent = await interaction.reply({ content: 'Pinging...', components: [row], fetchReply: true });

      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = Math.round(interaction.client.ws.ping);

      interaction.editReply(`Pong! Latency is ${latency}ms. API Latency is ${apiLatency}ms`);
    } else if (interaction.type === InteractionType.ButtonComponent) {
      const { customId } = interaction;

      if (customId === 'cancel') {
        // Provide additional information about latency or perform other actions
        await interaction.reply('Here are some additional details about latency...');
      }
    }
  },
};