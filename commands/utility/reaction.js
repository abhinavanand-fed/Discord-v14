const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react-await')
		.setDescription('Reacts to a message and awaits user reaction')
		.addSubcommand(subcommand =>
			subcommand.setName('react')
				.setDescription('React to a message and await reactions')),
	async execute(interaction) {
		const message = await interaction.reply({ content: 'Awaiting emojis...', fetchReply: true });
		message.react('👍').then(() => message.react('👎'));

		const collectorFilter = (reaction, user) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
		};

		message.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();

				if (reaction.emoji.name === '👍') {
					interaction.followUp('You reacted with a thumbs up.');
				} else {
					interaction.followUp('You reacted with a thumbs down.');
				}
			})
			.catch(collected => {
				console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
				interaction.followUp('You didn\'t react with neither a thumbs up, nor a thumbs down.');
			});
	},
};
