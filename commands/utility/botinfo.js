const {
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    CommandInteraction,
  } = require('discord.js');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('bot-info')
      .setDescription('Shows information about the bot'),
  
    async execute(interaction) {
      const { client } = interaction;
      if (!client) {
        console.error('Client is undefined.');
        return;
      }
  
      const { emojis, guilds, user, ws } = client;
  
      const commandCount = client.commands?.cache?.size || 0;
      const channelCount = client.channels?.cache?.size || 0;
      const emojisCount = emojis?.cache?.size || 0;
      const guildsCount = guilds?.cache?.size || 0;
      const user_Id = user?.username + ' | ' + user?.id;
      const ping = ws?.ping || 'N/A';
      const embed = new EmbedBuilder();
  
      embed
        .setAuthor({
          name: 'Abhinav',
          iconURL: 'https://cdn.discordapp.com/avatars/492262016644284429/1e72dab90efc53741d71d0e89faddd27.webp?size=4096'
        })
        .setTitle('Bot Information')
        .setColor('Green')
        .addFields(
          { name: '🌐 Client username & Id:', value: `${user_Id}`, inline: false },
          { name: '🌐 Command Total:', value: `${commandCount}`, inline: true },
          { name: '🌐 Watching Channel Total:', value: `${channelCount}`, inline: true },
          { name: '🌐 Watching Emojis Total:', value: `${emojisCount}`, inline: true },
          { name: '🌐 Watching Guild Total:', value: `${guildsCount}`, inline: false },
          { name: '🌐 Client Ping:', value: `${ping} ms`, inline: false }
        )
        .setFooter({ text: 'Made by D3 Development Team' });
  
      interaction.reply({ embeds: [embed] });
    }
  };