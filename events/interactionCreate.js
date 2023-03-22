

const User = require('../datamodels/User');
const Server = require('../datamodels/Server')
const { developers } = require('../devconfig.json');
const { InteractionType, PermissionFlagsBits } = require('discord.js');
const { createServerData, createUserData } = require('../util/Helper');

const returnError = async(interaction, role) => {
    return await interaction.reply({ content: "Only `"+role+"` can run this command!", ephemeral: true }).catch(async (error) => {
        return await interaction.editReply({ content: "Only `"+role+"` can run this command!", ephemeral: true }).catch(err => console.log(err))
    })
}


module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.guild){
            return await interaction.reply('You cant do commands in DMs!')
        }

        const { commandName } = interaction;
        const command = client.Commands.get(commandName);

        if (interaction.type == InteractionType.ApplicationCommand) {
            if (!command) return await returnError(interaction, 'Invalid command? What!? This shouldnt be happening!')
           

            const member = await interaction.member;
    
    
            if (command.clientOwnerOnly && !developers.find(member.id)) return await returnError(interaction, 'Chatalyst Developers')
    
    
            try {
                if (command.guildAdminOnly && await member.permissionsIn(interaction.channel).has(PermissionFlagsBits.Administrator)) return await returnError(interaction, 'Server Administrators')
            } catch(error) {
                return await returnError(interaction, 'Server Administrators')
            }

            if (!interaction.guild.members.me?.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)){
                return await interaction.reply({ content: 'Unable to setup a connection due to invalid permissions to send message in this channel!', ephemeral: true }).catch(error => {
                    return
                })
            }
        
    
    
            let UserCollection = await User.findOne({ discord_id: member.id })
            if (!UserCollection) {
                UserCollection = await createUserData(member.id)
            }

            if (!UserCollection){
                return await returnError(interaction, 'Something occured with the database!')
            }



            let ServerCollection = await Server.findOne({ guild_id: interaction.guild.id })
            if (!ServerCollection) {
                ServerCollection = await createServerData(interaction.guild.id)
            }

            if (!ServerCollection){
                return await returnError(interaction, 'Something occured with the database!')
            }


    
    
    
    
            try {
                return await command.run(client, UserCollection, ServerCollection, interaction);
            } catch (error) {
                return await interaction.reply({ content: "Failed to run command, please try again later.", ephemeral: true }).catch(async (errr) => {
                    return await interaction.editReply({ content: "Failed to run command, please try again later.", ephemeral: true }).catch(err => {return})
                })
            }
        } else if (interaction.isButton()){
            let Button = await client.Buttons.get(interaction.customId) 
            
            if (!Button && interaction.customId.includes('server_')){
                Button = await client.Buttons.get('serverinfo')
            }

            if (!Button && interaction.customId.includes('cancelconnection')){
                Button = await client.Buttons.get('cancelconnection')
            }

            if (!Button) return await returnError(interaction, 'Invalid command? What!? This shouldnt be happening!')

            try {
                return await Button.run(client, interaction)
            } catch(error) {
                return await interaction.reply({ content: "Failed to run command, please try again later.", ephemeral: true }).catch(async (errr) => {
                    return await interaction.editReply({ content: "Failed to run command, please try again later.", ephemeral: true }).catch(err => {return})
                })
            }
            
        }

        
    }
}