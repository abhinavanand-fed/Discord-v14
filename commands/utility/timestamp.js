const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timestamp')
        .setDescription('Displays timestamp formats')
        .addStringOption(option =>
            option.setName('custom-date')
                .setDescription('The custom date to use (in the format YYYY-MM-DD)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('custom-time')
                .setDescription('The custom time to use (in the format HH:mm:ss)')
                .setRequired(false)),
    async execute(interaction) {
        const timestampFormats = [
            { format: 'd', name: 'Short Date' },
            { format: 'D', name: 'Long Date' },
            { format: 't', name: 'Short Time' },
            { format: 'T', name: 'Long Time' },
            { format: 'f', name: 'Full Date and Time' },
            { format: 'F', name: 'Full Date and Time with Day' },
            { format: 'R', name: 'Relative Time' },
        ];

        // Get the custom date and time from the interaction, if provided
        const customDate = interaction.options.getString('custom-date');
        const customTime = interaction.options.getString('custom-time');

        let timestamp;
        if (customDate && customTime) {
            // Combine the custom date and time into a single Date object
            const [year, month, day] = customDate.split('-').map(x => parseInt(x, 10));
            const [hours, minutes, seconds] = customTime.split(':').map(x => parseInt(x, 10));
            timestamp = new Date(year, month - 1, day, hours, minutes, seconds);
        } else {
            // Use the current date and/or time as appropriate
            timestamp = new Date();
        }

        // Convert the timestamp to the user's timezone
        const userTimezoneOffset = interaction.member.user.timezone || 'UTC';
        timestamp.setMinutes(timestamp.getMinutes() - timestamp.getTimezoneOffset() + new Date(userTimezoneOffset).getTimezoneOffset());

        // Validate the custom date and time format
        if (customDate && !/^\d{4}-\d{2}-\d{2}$/.test(customDate)) {
            return await interaction.reply('The custom date format is invalid. Please use the format YYYY-MM-DD.');
        }
        if (customTime && !/^\d{2}:\d{2}:\d{2}$/.test(customTime)) {
            return await interaction.reply('The custom time format is invalid. Please use the format HH:mm:ss.');
        }

        const embed = new EmbedBuilder()
            .setTitle('Timestamp Formats')
            .setDescription(timestampFormats.map(format => `\`<t:${Math.floor(timestamp.getTime() / 1000)}:${format.format}>\` - ${format.name}`).join('\n'));

        await interaction.reply({ embeds: [embed] });
    },
};