const Connection = require('../datamodels/Connection')

const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "cancel",
    async run(client, interaction) {

        const deleteConnection = await Connection.findOne({ guild_1: interaction.guild.id })
        if (!deleteConnection){
            return await interaction.reply('You do not have a connection, to create one type `/call`!')
        }

        if (deleteConnection.guild_2 != 'N/A'){
            return await interaction.reply('You already have a call, to end type **end** or **end call**!')
        }

        const deleted = await Connection.deleteOne(deleteConnection)
        if (!deleted){
            return await interaction.reply('Failed to severe connection, please retry.')
        }

        return await interaction.reply('Successfully severed connection!')
    }
} 