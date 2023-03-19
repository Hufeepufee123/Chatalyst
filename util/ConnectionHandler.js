const Connection = require('../datamodels/Connection')
const User = require('../datamodels/User')
const Server = require('../datamodels/Server')

const { checkText, createServerData, createUserData } = require('../util/Helper')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js')

const endCallList = ['end', 'end call', '!end', '/end', ';end', 'endcall', 'end cal', 'end call daddy']

const cancelButton = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('cancel')
            .setEmoji('🗑️')
            .setLabel('Cancel Call')

            .setStyle(ButtonStyle.Danger))


const FindConnection = async (client, interaction) => {
    const check_available = await Connection.findOne({ guild_2: 'N/A' })
    if (!check_available) {
        await Connection.create({
            guild_1: interaction.guild.id,
            channel_1: interaction.channel.id,

            guild_2: 'N/A',
            channel_2: 'N/A'
        })

        return await interaction.channel.send({ content: 'Creating a connection. This may take a minute to link with another server!', components: [cancelButton] }).catch(async (error) => {
            await interaction.editReply('Failed to connect due to unable to send messages in this channel!')
            return await Connection.deleteOne({ guild_1: interaction.guild.id })
        })
    } else {
        return await StartConnection(client, interaction, check_available)
    }


}


const FilterMessage = async (message) => {
    let msg = message
    if (msg.includes('@everyone')) {
        msg = msg.replace('@everyone', '@.everyone')
    }

    if (msg.includes('@here')) {
        msg = msg.replace('@here', '@.here')
    }


    if (msg.includes('@everyone') || msg.includes('@here')) {
        return await FilterMessage(msg)
    } else {
        return msg
    }


}


const UpdateUser = async (discordId) => {
    try {
        let userData = await User.findOne({ discord_id: discordId })
        if (!userData) {
            userData = await createUserData(discordId)
        }

        if (!userData) return

        await userData.updateOne({ $inc: { messages: 1 } })

        return true
    } catch (error) { return false }
}

const UpdateServerStats = async (serverId, discordId) => {

}


const SendMessage = async (channel, msg) => {
    if (!msg.guild.members.me?.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) {
        return
    }
    if (msg.content === '' && !msg.attachments) return msg.channel.send('You cant send nothing!').catch(error => { return false })

    let message
    const serverId = channel.guild.id

    let server_data = await Server.findOne({ guild_id: serverId })
    if (!server_data) {
        server_data = await createServerData(serverId)
    }


    try {
        message = await FilterMessage(msg.content)
    } catch (error) { return false }


    if (server_data.settings.filterText === true) {
        //message = await checkText(message)
    }



    let attachment

    try {
        if (msg.attachments && msg.attachments.first() && msg.attachments.first().url) {
            attachment = msg.attachments.first().url
        }
    } catch (error) { }

    if (server_data.settings.allowImages === false && attachment) {
        attachment = '**[BLOCKED DUE TO SERVER SETTINGS]**'
    }

    if (msg.content === '' && !msg.attachments) return msg.channel.send('You cant send messages in this server!').catch(error => { return false })


    if (attachment && attachment != '**[ATTACHMENT BLOCKED DUE TO SERVER SETTINGS]**') {
        return channel.send({ content: `☎️ **${msg.author.username} -** ${message}`, files: [{ attachment: attachment }] }).catch(error => {
            return channel.send({ content: `☎️ **${msg.author.username} -** ${message}\n**[FAILED TO PROCESS MEDIA]**` }).catch((error) => {
                message.delete()
                return false
            })
        })
    } else {
        return channel.send({ content: `☎️ **${msg.author.username} -** ${message}\n${attachment ?? ''}` }).then(async (message) => {
            await UpdateUser(msg.author.id).catch(error => { return })
            //await UpdateServerStats(msg.guild.id, msg.author.id).catch(error => { return false })

            if (server_data.settings.allowImages == false) {
                await message.suppressEmbeds(true)
            }
            return true

        }).catch(async () => {
            await msg.react('❌').catch(error => { return })
            return
        })
    }
}




const EndConnection = async (channel, reason, serverId) => {
    const infoButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`server_${serverId}_not`)
                .setEmoji('🔎')
                .setLabel('Get Server Info')

                .setStyle(ButtonStyle.Secondary))


    if (reason === 'end_sent') {
        return channel.send({ content: `Succesfully disconnected`, components: [infoButton] }).catch(error => { return })
    }

    if (reason === 'end_recieved') {
        return channel.send({ content: `Call ended by other recipient!`, components: [infoButton] }).catch(error => { return })
    }

    if (reason === 'error') {
        return channel.send('**An error occured, call ended!**').catch(error => { return })
    }
}



const StartConnection = async (client, interaction, check_available) => {
    const data = await check_available.updateOne({ guild_2: interaction.guild.id, channel_2: interaction.channel.id })
    return await interaction.channel.send('Found a connection! Please be nice.').then(async (interaction) => {
        const guild_1 = check_available.guild_1
        const channel_1 = await client.channels.fetch(check_available.channel_1)

        const guild_2 = interaction.guild.id
        const channel_2 = await interaction.channel

        const filter = m => (m.channel.id === channel_1.id || m.channel.id === channel_2.id) && !m.author.bot

        const collector_1 = channel_1.createMessageCollector({ filter })
        const collector_2 = channel_2.createMessageCollector({ filter })

        await channel_1.send('Found a connection! Please be nice').catch(async (error) => {
            collector_1.stop('error')
            collector_2.stop('error')
            return
        })

        let send_1 = false
        let send_2 = false

        collector_1.on('collect', async (msg) => {
            const getConnection = await Connection.findOne({ guild_1: msg.guild.id })
            if (!getConnection && !send_1) {
                send_1 = true
                collector_1.stop('end_recieved')
                collector_2.stop('end_sent')
                return
            }

            if (endCallList.includes(msg.content) && !send_1) {
                send_1 = true
                collector_1.stop('end_sent')
                collector_2.stop('end_recieved')
                return
            }
            const sent = await SendMessage(channel_2, msg)
            if (!sent) {
                collector_1.stop('error')
                collector_2.stop('error')
                return
            }
            return
        })

        collector_2.on('collect', async (msg) => {

            const getConnection = await Connection.findOne({ guild_2: msg.guild.id })
            if (!getConnection && !send_2) {
                send_2 = true
                collector_2.stop('end_recieved')
                collector_1.stop('end_sent')
                return
            }


            if (endCallList.includes(msg.content) && !send_2) {
                send_2 = true
                collector_2.stop('end_sent')
                collector_1.stop('end_recieved')
                return
            }

            const sent = await SendMessage(channel_1, msg)
            if (!sent) {
                collector_1.stop('error')
                collector_2.stop('error')
                return
            }
            return
        })



        collector_1.on('end', async (collected, reason) => {
            await Connection.deleteOne({ data })

            return EndConnection(channel_1, reason, guild_2)
        })

        collector_2.on('end', async (collected, reason) => {
            return EndConnection(channel_2, reason, guild_1)
        })



    }).catch(async (error) => {
        return await interaction.channel.send('Something occured, connection severed!')
    })
}


module.exports = {
    FindConnection,
    StartConnection,
    EndConnection,
    SendMessage
}