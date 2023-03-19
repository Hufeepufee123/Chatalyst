
const User = require('../datamodels/User');
const { createUserData } = require('../util/Helper')

module.exports = {
    name: 'guildMemberAdd',
    run: async(client, member) => {
        if(!await User.findOne({ discord_id: member.id })){
            return await createUserData(member.id)
        }
        return
    }
}