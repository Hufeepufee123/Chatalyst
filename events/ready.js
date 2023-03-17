const Connection = require('../datamodels/Connection')

module.exports = {
    name: 'ready',
    run: async (client) => {

        const Connections = await Connection.find({}).catch(error => console.log('Unable to get Connections'))

        for (const connection of Connections) {
            await client.channels.fetch(connection.channel_1).then(async (channel) => {
                await channel.send('📢 **The bot has restarted meaning the connection has ended, apologies!**')
            }).catch(error => {
                console.log('Unable to notify channel: ', connection.channel_1)
            })

            await client.channels.fetch(connection.channel_2).then(async (channel) => {
                await channel.send('📢 **The bot has restarted meaning the connection has ended, apologies!**')
            }).catch(error => {
                console.log('Unable to notify channel: ', connection.channel_1)
            })
        }
        await Connection.deleteMany({}).catch(error => console.log('Unable to delete connections:', error))

        console.log(`${client.user.tag}, is running.`)
    }
}