const Connection = require('../datamodels/Connection')

module.exports = {
    name: 'ready',
    run: async (client) => {

        const Connections = await Connection.find({}).catch(error => console.log('Unable to get Connections'))

        for (const connection of Connections) {
            if (connection.channel_1 != 'N/A'){
                await client.channels.fetch(connection.channel_1).then(async (channel) => {
                    await channel.send('📢 **The bot has restarted meaning the connection has ended, apologies!**')
                }).catch(error => {
                    console.log('Unable to notify channel: ', connection.channel_1)
                })
            }

            if (connection.channel_2 != 'N/A'){
                await client.channels.fetch(connection.channel_2).then(async (channel) => {
                    await channel.send('📢 **The bot has restarted meaning the connection has ended, apologies!**')
                }).catch(error => {
                    console.log('Unable to notify channel: ', connection.channel_2)
                })
            }

            if (connection.channel_1 == 'N/A' && connection.channel_2 == 'N/A'){
                console.log(`A connection has no channels linked: ${connection.guild_1} -> ${connection.guild_2}`)
            }
        }
        await Connection.deleteMany({}).catch(error => console.log('Unable to delete connections:', error))

        console.log(`${client.user.tag}, is running.`)
    }
}