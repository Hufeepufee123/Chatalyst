const { SlashCommandBuilder, PermissionFlagsBits  } = require('discord.js');
const Server = require('../../datamodels/Server');
const SlashCommand = require('../../util/SlashCommand');




const questions = [
    {
        question: 'What channel would you like the `/call` command to be enabled in.\n\nNot mentioning a channel will mean all channels are allowed to run the command. Saying `cancel` will stop this prompt.',
        req: 'channel',
        small: 'callChannel'
    },
    {
        question: 'Would you like to allow images outbound and inbound during calls? **Y | N**\n\nSkipping will set this to true. Saying `cancel` will stop this prompt.',
        req: 'bool',
        small: 'allowImages'
    },
    {
        question: 'Would you like to filter text in calls (In Development)? **Y | N**\n\nSkipping will set this to false. Saying `cancel` will stop this prompt.',
        req: 'bool',
        small: 'filterText'
    },
    {
        question: 'Would you like to make your server anonymous? **Y | N**\n\nSkipping will set this to false. Saying `cancel` will stop this prompt.',
        req: 'bool',
        small: 'private'
    },
    { 
        question: 'What custom message would you like when you **connect** to a call? You can ping roles, mention channels, etc. Saying `cancel` will stop this prompt.',
        req: 'string',
        small: 'messageConnected',
    },
    { 
        question: 'What custom message would you like when you **disconnect** to a call? You can ping roles, mention channels, etc. Saying `cancel` will stop this prompt.',
        req: 'string',
        small: 'messageDisconnected',
    },
    {
        question: 'What blacklist role would you like to add? Adding this will prevent users with the role to run the `/call` command or talk in calls.\n\nNot mentioning a role will set this to N/A. Saying `cancel` will stop this prompt.',
        req: 'role',
        small: 'blacklistRole'
    },
    {
        question: 'What whitelist role would you like to add? Adding this will only let users with the role run the `/call` command or talk in calls.\n\nNot mentioning a role will set this to N/A. Saying `cancel` will stop this prompt.',
        req: 'role',
        small: 'whitelistRole'
    },
]


const checkReq = async (question, message, stored) => {
    await message

    if (message.content === 'cancel'){
        return 'cancel'
    }

   
    let req =  question.req
    

    if (req === 'channel') {
        try {
            if (message.mentions.channels.first() && message.mentions.channels.first().id && message.mentions.channels.first().type === 0) {
                return message.mentions.channels.first().id
            }
            return 'N/A'

        } catch (error) { return false }
    }


    if (req === 'role') {
        try {
            if (message.mentions.roles.first() && message.mentions.roles.first().id) {
    
                return message.mentions.roles.first().id
            } else if (message.mentions.everyone === true){
                return 'everyone'
            }
            
            else {
                return 'N/A'
            }
        } catch (error) { return false }
       
    
    }

    if (req === 'string'){
        return message.content
    }




    if (req === 'bool') {
        const msg = message.content.toLowerCase()
        if (msg.includes('no') || msg.includes('n') || msg.includes('false')) return 'false'
        if (msg.includes('yes') || msg.includes('y') || msg.includes('true')) return 'true'
        return 
    }
}

module.exports = class Help extends SlashCommand {
    constructor() {
        super('setup', 'Setup the call feature', 'phone', false, true);
    }

    async run(client, UserCollection, ServerCollection, interaction) {
        try {

            let collectCounter = 0
            let endCounter = 0

            let stored = {
                callChannel: 'N/A',
                allowImages: 'N/A',

                messageConnected: 'Found a connection! Please be nice.',
                messageDisconnected: 'Succesfully disconnected.',

                blacklistRole: 'N/A',
                whitelistRole: 'N/A',
                setup: true
            }

            const filter = response => {
                return interaction.user.id === response.author.id && interaction.channel.id === response.channel.id && !response.author.bot
            };


            await interaction.reply({ content: questions[collectCounter].question })

            const collector = interaction.channel.createMessageCollector({filter})




            collector.on('collect', async (msg) => {
                if (collectCounter < 8){


                    const req = await checkReq(questions[collectCounter], msg, stored)


                    if (req === 'cancel'){

                        return collector.stop('cancelled')
                    }


                    if (!req){
                        return interaction.channel.send(questions[collectCounter].question)
                    } 

                    stored[questions[collectCounter].small] = req

                
                    collectCounter++

                    if (collectCounter >= 8){
                        return collector.stop('fulfilled')
                    }
                    interaction.channel.send(questions[collectCounter].question).catch(async (error) => {
                        
                    })
                    
                } else {
                    collector.stop('fulfilled')
                }
            })

            collector.on('end', async (collected, reason) => {
                if (reason === 'fulfilled'){

                    await Server.updateOne({ guild_id: interaction.guild.id }, {
                        settings: stored
                    }).catch(async (error) => {
                        return await interaction.reply('Error with saving with database, please try again!')
                    })

                    return await interaction.channel.send(`<@${interaction.user.id}>, successfully updated settings!`)
                } else if (reason === 'cancelled'){
                    return await interaction.channel.send('Cancelled!')
                } else if (reason === 'error'){
                    return await interaction.channel.send('')
                }
            })



        } catch (error) {
            return
        }
    }

    getRaw() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .toJSON();
    }
}