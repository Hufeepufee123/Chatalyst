const Server = require('../datamodels/Server')

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: "serverinfo",
    async run(client, interaction) {

        const split = interaction.customId.split('server_')[1].split('_')
        const serverId = split[0]
        const status = split[1]

        if (status === 'done') {
            return await interaction.reply({ content: 'Information has already been posted about this server!', ephemeral: true })
        }

        const data = await Server.findOne({ guild_id: serverId })

        if (data.settings.private === true) {
            return await interaction.reply({ content: 'The server has been set to `private` meaning you cant view their statistics!', ephemeral: true })
        }


        const server = await client.guilds.fetch(serverId)
        if (!server) {
            return await interaction.reply({ content: 'Unable to get server information possibly due to not being in the server anymore!', ephemeral: true })
        }

        let serverOwner = await server.members.fetch(server.ownerId)
        if (!serverOwner) {
            serverOwner = { user: { tag: 'N/A - Error' } }
        }



        const infoEmbed = new EmbedBuilder()
            .setTitle(`${server.name}:`)
            .setDescription(`🛡️ **${serverOwner.user.tag}**\n🏷️ **${server.memberCount.toLocaleString("en-US")}** members!`)
            .setThumbnail(server.iconURL())


        const infoButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`server_${serverId}_done`)
                    .setEmoji('🔎')
                    .setLabel('Get Server Info')

                    .setStyle(ButtonStyle.Secondary)
        )


        try {
            await interaction.update({ components: [infoButton] })
            return await interaction.channel.send({ embeds: [infoEmbed] })
        }catch(error){console.log(error)}
    }
} 