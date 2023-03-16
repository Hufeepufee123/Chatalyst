const Connection = require('../datamodels/Connection')

module.exports = {
    name: 'ready',
    run: async (client) => {

        await Connection.deleteMany({}).catch(error => console.log('Unable to delete connections:', error))

        console.log(`${client.user.tag}, is running.`)
    }
}