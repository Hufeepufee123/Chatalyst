const Connection = require('../datamodels/Connection')



const notifyChannels = async(client, channelId) => {
    await client.channels.fetch(channelId).then(async (channel) => {
        return await channel.send('Call ended by other recipient!')
    }).catch((error) => {
        console.log(`Unable to notify ${channelId} connection cancelled`)
        return
    })
}


module.exports = {
    name: "cancelconnection",
    async run(client, interaction) {

        const serverId = interaction.customId.split('cancelconnection_')[1]

        const check_connection_1 = await Connection.findOne({ guild_1: serverId })

        if (check_connection_1) {

            const deleted = await Connection.deleteOne({ guild_1: serverId })
            if (!deleted) {
                return await interaction.reply({ content: 'Located connection, but was unable to delete it. Please retry!', ephemeral: true })
            }


            await notifyChannels(client, check_connection_1.channel_2)

            return await interaction.reply('Successfully removed connection')

        }



        const check_connection_2 = await Connection.findOne({ guild_2: serverId })

        if (check_connection_2) {

            const deleted = await Connection.deleteOne({ guild_2: serverId })
            if (!deleted) {
                return await interaction.reply({ content: 'Located connection, but was unable to delete it. Please retry!', ephemeral: true })
            }

            await notifyChannels(client, check_connection_2.channel_2)

            return await interaction.reply('Successfully removed connection')

        }



    
        return await interaction.reply({ content: 'Unable to locate a connection!', ephemeral: true })
    }
} 