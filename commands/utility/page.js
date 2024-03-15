const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

async function getBannedMembers(guild) {
  try {
    const bans = await guild.bans.fetch();
    return bans.map((ban) => ({ user: ban.user, reason: ban.reason }));
  } catch (error) {
    console.error('Error fetching banned members:', error);
    return [];
  }
}

function createBanEmbeds(bannedMembers, itemsPerPage = 10) {
  const embeds = [];
  for (let i = 0; i < bannedMembers.length; i += itemsPerPage) {
    const pageData = bannedMembers.slice(i, i + itemsPerPage);
    const embed = new EmbedBuilder()
      .setTitle('Banned Members')
      .setColor(0x00FFFF)
      .setFooter({ text: `Page ${Math.floor(i / itemsPerPage) + 1} of ${Math.ceil(bannedMembers.length / itemsPerPage)}` });

    for (const { user, reason } of pageData) {
      let truncatedReason = reason || 'No reason provided';

      // Truncate reason if it exceeds 100 characters (optional)
      if (typeof reason === 'string' && reason.length > 100) {
        truncatedReason = reason.substring(0, 100) + '...';
      }

      embed.addFields({ name: user.tag, value: truncatedReason, inline: false });
    }

    embeds.push(embed);
  }
  return embeds;
}

function createButtonRow(currentPage, totalPages) {
  const previousButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Previous')
    .setCustomId('previous');

  const nextButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('Next')
    .setCustomId('next');

  const row = new ActionRowBuilder().addComponents(previousButton, nextButton);
  return row;
}

async function sendPaginatedBanList(interaction) {
  const guild = interaction.guild;
  const bannedMembers = await getBannedMembers(guild);

  if (!bannedMembers.length) {
    return interaction.reply({ content: 'There are no banned members in this server.', ephemeral: true });
  }

  const embeds = createBanEmbeds(bannedMembers);
  let currentPage = 1;

  const message = await interaction.reply({ embeds: [embeds[0]], components: [createButtonRow(currentPage, embeds.length)] });

  const filter = (buttonInteraction) => buttonInteraction.user.id === interaction.user.id && (buttonInteraction.customId === 'previous' || buttonInteraction.customId === 'next');
  const collector = message.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async (buttonInteraction) => {
    buttonInteraction.deferUpdate();
    if (buttonInteraction.customId === 'previous') {
      currentPage--;
    } else if (buttonInteraction.customId === 'next') {
      currentPage++;
    }

    await message.edit({ embeds: [embeds[currentPage - 1]], components: [createButtonRow(currentPage, embeds.length)] });
  });

  collector.on('end', async () => {
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel('Disabled').setDisabled(true));
    await message.edit({ components: [row] });
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banned-members')
    .setDescription('Shows a list of banned members (paginated)'),
  async execute(interaction) {
    await sendPaginatedBanList(interaction);
  },
};



//There should be only one function to check the number of pages. So, there should be only a (data) argument passed to it and it should return an array for the execution, and there shouldn't be any other way of doing it 