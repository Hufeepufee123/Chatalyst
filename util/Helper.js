const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const Server = require('../datamodels/Server')
const User = require('../datamodels/User')


const fetchFiles = (path, ending) => {
    return fs.readdirSync(path).filter(file => file.endsWith(ending));
};

const checkSupporter = async (client, discordId) => {

    let server
    let member

    try {
        server = await client.guilds.fetch('1082339132732350494')
        if (!server) {
            return 'Error: `Unable to validate your account` please try again later!'
        }
        member = await server.members.fetch(discordId)
        if (!member) {
            return 'Error: `Unable to validate your account` please try again later!'
        }
    } catch (error) { return 'Error: `Unable to validate your account` please try again later!' }


}

const filterText = async (text, word) => {


    let msg = text



    let hashtag = '#'
    for (var i = 0; i < word.length - 3; i++){
        hashtag = hashtag+'#'
    }



    if (msg.includes(word)) {
        msg = msg.replace(word, `${word.charAt(0)}${hashtag}${word.at(-1)}`)
    }



    if (msg.replaceAll(' ', '').includes(word)) {
        return await filterText(msg, word)
    } else {
        return msg
    }



}


const checkText = async (text) => {
    data = new FormData();
    data.append('text', text);
    data.append('lang', 'en');
    data.append('opt_countries', 'us,gb,fr,');
    data.append('mode', 'standard');
    data.append('api_user', '300733665');
    data.append('api_secret', 'Kb3XGhPg8fz9W87AiUX6');


    return await axios({
        url: 'https://api.sightengine.com/1.0/text/check.json',
        method: 'post',
        data: data,
        headers: data.getHeaders()
    }).then(async (response) => {
        if (response.data.profanity.matches.length > 0) {
            let newText = text

            for (const array of response.data.profanity.matches) {

                if (array.intensity === 'high') {
                    newText = await filterText(text, array.match)
                }
            }

            console.log(newText)
            return newText
        } else {
            return text
        }
    })
        .catch(function (error) {
            if (error.response) console.log(error.response.data);
            else console.log(error.message);
            return text
        });



}


const createServerData = async(serverId) => {
    const ServerCollection = await Server.create({
        guild_id: serverId,
        calls: 0,
        leaderboard: new Array,
        settings: {
            callChannel: 'N/A',
            private: false,
            allowImages: true,
            filterText: false,

            blacklistRole: 'N/A',
            whitelistRole: 'N/A'
        }
    }).catch(error => {
        return false
    })
    return ServerCollection
}


const createUserData = async (userId) => {
    const UserCollection = await User.create({
        discord_id: userId,
        messages: 0,

        blacklist_level: 0,

        badges: new Array

    }).catch(error => {
        return false
    })
    return UserCollection
}
module.exports = {
    fetchFiles,
    checkText,
    createServerData,
    createUserData,
}