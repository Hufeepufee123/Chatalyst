const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const SlashCommand = require('../../util/SlashCommand');

const Connection = require('../../datamodels/Connection')

const { FindConnection } = require('../../util/CallConnectionHandler')



module.exports = class Help extends SlashCommand {
    constructor() {
        super('call', 'Start a call in the channel', 'phone', false, false);
    }

    async run(client, UserCollection, ServerCollection, interaction) {


        if (ServerCollection.settings.setup === false) {
            return await interaction.reply({ content: 'This server has not been setup, please tell a `Server Administrator` to set the server up!', ephemeral: true })
        }

        if (ServerCollection.settings.callChannel != 'N/A' && interaction.channel.id != ServerCollection.settings.callChannel) {
            return await interaction.reply({ content: 'A `Server Administrator` has only enabled the `Call` command in an another channel: **<#' + ServerCollection.settings.callChannel + '>**!', ephemeral: true })
        }

        let member = await interaction.member

        if (ServerCollection.settings.blacklistRole != 'N/A' && member.roles.cache.get(ServerCollection.settings.blacklistRole)) {
            return await interaction.reply({ content: 'You have a `Blacklisted Role` (<@&' + ServerCollection.settings.blacklistRole + '>) meaning you cant create a call or message in a call!', ephemeral: true })
        }

        if (ServerCollection.settings.whitelistRole != 'N/A' && !member.roles.cache.get(ServerCollection.settings.whitelistRole)) {
            return await interaction.reply({ content: 'You do not have the `Whitelisted Role` (<@&' + ServerCollection.settings.whitelistRole + '>) meaning you cant create a call or message in a call!', ephemeral: true })
        }

        const cancelButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`cancelconnection_${interaction.guild.id}`)
                    .setLabel('Error? Click here.')

                    .setStyle(ButtonStyle.Secondary))

        const check_1 = await Connection.findOne({ guild_1: interaction.guild.id })
        if (check_1) {
            return await interaction.reply({ content: `This server already has a connection in <#${check_1.channel_1}>!`, components: [ cancelButton ], ephemeral: true })
        }

        const check_2 = await Connection.findOne({ guild_2: interaction.guild.id })
        if (check_2) {
            return await interaction.reply({ content: `This server already has a connection in <#${check_2.channel_2}>!`, components: [ cancelButton ], ephemeral: true })
        }

        await interaction.reply('Connecting...')

        return await FindConnection(client, interaction)




    }

    getRaw() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .toJSON();
    }
}