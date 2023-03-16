const Server = require('../datamodels/Server')

const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "serverinfo",
    async run(client, interaction) {
        await interaction.deferReply()

        const serverId = interaction.customId.split('server_')[1]

        const data = await Server.findOne({ guild_id: serverId })

        if (data.settings.private === true) {
            return await interaction.editReply({ content: 'The server has been set to `private` meaning you cant view their statistics!', ephemeral: true })
        }



        const server = await client.guilds.fetch(serverId)
        if (!server){
            return await interaction.editReply({ content: 'Unable to get server information possibly due to not being in the server anymore!', ephemeral: true })
        }

        let serverOwner = await server.members.fetch(server.ownerId)
        if (!serverOwner){
            serverOwner = { user: {tag: 'N/A - Error'}}
        }



        const infoEmbed = new EmbedBuilder()
            .setTitle(`${server.name}:`)
            .setDescription(`🛡️ **${serverOwner.user.tag}**\n🏷️ **${server.memberCount.toLocaleString("en-US")}** members!`)
            .setThumbnail(server.iconURL())

        return await interaction.editReply({ embeds: [infoEmbed] })
    }
} 