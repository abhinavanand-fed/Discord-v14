const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides detailed information about the server.'),
	async execute(interaction) {
		const guild = interaction.guild;
		const owner = guild.owner;
		const createdAt = guild.createdAt.toISOString();

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Server Information')
			.setDescription(`Server name: **${guild.name}**`)
			.addFields(
				{ name: 'Server ID', value: guild.id },
				{ name: 'Server Name', value: guild.name },
				{ name: 'Created On', value: createdAt }
			)

		await interaction.reply({ embeds: [embed] });
	},
};
