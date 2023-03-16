
const User = require('../datamodels/User');
const { createUserData } = require('../util/Helper')

module.exports = {
    name: 'guildMemberAdd',
    run: async(client, Member) => {
        if(!await User.findOne({ discord_id: Member.id })){
            return await createUserData(Member.id)
        }
        return
    }
}