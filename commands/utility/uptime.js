const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Displays the bot\'s uptime and current time.'),
	async execute(interaction) {
		const uptimeSeconds = process.uptime();
		const uptime = formatUptime(uptimeSeconds);
		const currentTime = moment().utcOffset('+05:30').format('MMMM Do YYYY, h:mm:ss a'); // Adjust UTC offset as needed

		await interaction.reply(`Uptime: ${uptime}\nCurrent Time: ${currentTime}`);
	},
};

function formatUptime(uptimeSeconds) {
	const days = Math.floor(uptimeSeconds / (3600 * 24));
	const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((uptimeSeconds % 3600) / 60);
	const seconds = Math.floor(uptimeSeconds % 60);

	let formattedUptime = '';
	if (days > 0) formattedUptime += `${days}d `;
	if (hours > 0) formattedUptime += `${hours}h `;
	if (minutes > 0) formattedUptime += `${minutes}m `;
	if (seconds > 0) formattedUptime += `${seconds}s`;

	return formattedUptime.trim();
}
