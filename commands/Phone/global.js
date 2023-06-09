const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const SlashCommand = require('../../util/SlashCommand');

const Connection = require('../../datamodels/Connection')

const { FindConnection } = require('../../util/CallConnectionHandler')

const discordServerButton = new ActionRowBuilder()
    .addComponents(

        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/JMk9upECuN')

            .setEmoji('1083142034195488828')
            .setLabel('Discord Server!'),
    )

module.exports = class Help extends SlashCommand {
    constructor() {
        super('global', 'Start a global call in the channel', 'phone', false, false, true);
    }

    async run(client, UserCollection, ServerCollection, interaction) {


        return

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

        const check_1 = await Connection.findOne({ guild_1: interaction.guild.id })
        if (check_1) {
            return await interaction.reply('This server already has a connection!')
        }

        const check_2 = await Connection.findOne({ guild_2: interaction.guild.id })
        if (check_2) {
            return await interaction.reply('This server already has a connection!')
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