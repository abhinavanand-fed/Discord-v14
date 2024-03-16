const { Events } = require('discord.js');
const { EmbedBuilder } = require("discord.js");


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

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
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},

	async execute(interaction, client) {
		if (!interaction.isModalSubmit()) return;
		// Modal Submit Feedback/Suggestion
		if (interaction.customId === "SuggestionModal") {
		  const suggestionValue =
			interaction.fields.getTextInputValue("SuggestionInput");
		  // Add your channel ID
		  const suggestionsChannel = interaction.guild.channels.cache.get(
			config.modalSubmitChannelId
		  );
	
		  const submitSuggestionEmbed = new EmbedBuilder()
	
			.setTitle(`📝 NEW Feedback/Suggestion!`)
			.setDescription(`${suggestionValue}`)
			.addFields(
			  {
				name: `💡 Submitted by:`,
				value: `${interaction.user} | ${interaction.user.tag}`,
				inline: true,
			  },
			  {
				name: `📆 Account Created at:`,
				value: `<t:${Math.round(
				  interaction.user.createdTimestamp / 1000
				)}:f> | <t:${Math.round(
				  interaction.user.createdTimestamp / 1000
				)}:R>`,
				inline: true,
			  },
			  {
				name: `⏰ Joined Server at:`,
				value: `<t:${Math.round(
				  interaction.member.joinedTimestamp / 1000
				)}:f> | <t:${Math.round(
				  interaction.member.joinedTimestamp / 1000
				)}:R>`,
				inline: true,
			  }
			)
			.setThumbnail(
			  interaction.user.displayAvatarURL({
				size: 1024,
			  })
			)
			.setColor(interaction.member.displayHexColor)
			.setFooter({
			  text: `ID: ${interaction.user.id}`,
			  iconURL: interaction.user.displayAvatarURL({
				size: 1024,
			  }),
			})
			.setTimestamp();
		  const msg = await suggestionsChannel.send({
			embeds: [submitSuggestionEmbed],
		  });
		  await msg.react("👍");
		  await msg.react("🤷");
		  await msg.react("👎");
	
		  await interaction.deferReply({ ephemeral: true });
		  interaction.editReply({
			content:
			  "Thanks I Submitted Your Feedback/Suggestion For The Server Admins ❤",
		  });
		}
	  },
};