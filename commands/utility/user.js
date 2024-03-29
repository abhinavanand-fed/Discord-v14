const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Replies with user info!')
        .addUserOption(option => option.setName('user').setDescription('The user to show info about')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setTitle('Everything we know about this ' + (user.bot ? 'bot' : 'user') + '!')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        if (user.bot) {


            embed.setColor('#d9d9d9')
            embed.addFields({ name: "Bot", value: `${user}`, inline: false})
            embed.addFields({ name: "Joined the server", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true})
            embed.addFields({ name: "Joined Discord", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true})
            embed.setFooter({ text: `ID: ${user.id}` })
            embed.setTimestamp()
        } else {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);
            const tag = user.tag;
            const badgelistofuser = []

            if (user.flags.toArray().includes('ActiveDeveloper')) {
                badgelistofuser.push('<:dev_badge:1217914316062195893>')
            }
            if (user.flags.toArray().includes('HypeSquadOnlineHouse1')) {
                badgelistofuser.push('<:hs_brave:1217914321548476438>')
            }
            if (user.flags.toArray().includes('HypeSquadOnlineHouse2')) {
                badgelistofuser.push('<:hs_bri:1217914326812196934>')
            }
            if (user.flags.toArray().includes('HypeSquadOnlineHouse3')) {
                badgelistofuser.push('<:hs_bal:1217914318843023400>')
            }



            embed.setColor('#5dd969')
            embed.addFields({ name: "Member", value: `${user}`, inline: false})
            embed.addFields({ name: "Badges", value: `${badgelistofuser.join(' ')}`, inline: false})
            embed.addFields({ name: "Joined the server", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true})
            embed.addFields({ name: "Joined Discord", value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true})
            embed.setFooter({ text: `ID: ${user.id}` })
            embed.setTimestamp()
            console.log(user.flags.toArray())
        }
        await interaction.channel.send({ embeds: [embed] });
    }
};