const Server = require('../datamodels/Server');
const { createServerData } = require('../util/Helper')

const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: 'guildCreate',
    run: async (client, guild) => {

        let ServerCollection = await Server.findOne({ guild_id: guild.id })

        if (!ServerCollection) {
            ServerCollection = await createServerData(guild.id)
        }

        let member
        let channel

        try {
            member = await guild.members.fetch('1082005834944483379')
            channel = await guild.channels.fetch(channel => channel.type === 0 && member.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages))
        } catch(error) {
            return
        }

        if (!member && !channel) return;


        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`👋 Hello '${guild.name}', I am Chatalyst!`)
            .setDescription('Thanks for inviting me, to your server. To start the setup process an `Administrator` in your server needs to run `/setup` to customize the settings for your users. \n\n**If any issues occur feel free to join Communications Server below!**')

        const welcomeButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discordapp.com/oauth2/authorize?&client_id=1082005834944483379&scope=bot')

                    .setEmoji('🤖')
                    .setLabel('Invite Me!'),

                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/JMk9upECuN')

                    .setEmoji('1083142034195488828')
                    .setLabel('Discord Server!'),
            )

        return await channel.send({ embeds: [ welcomeEmbed ], components: [ welcomeButtons ] }).catch(error => { return })




    }
}