
const Server = require('../datamodels/Server')
const { createServerData } = require('../util/Helper')

const updateLeaderboard = async (guildId, discordId, message) => {
    let guild = await Server.findOne({ guild_id: guildId })
    if (!guild){
        guild = await createServerData(guildId)
    }

}

module.exports = {
    updateLeaderboard
}