const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const SlashCommand = require('../../util/SlashCommand');






module.exports = class Help extends SlashCommand {
    constructor() {
        super('about', 'About the Chatalyst bot', 'server', false, false);
    }

    async run(client, UserCollection, ServerCollection, interaction) {
        const aboutEmbed = new EmbedBuilder()
            .setTitle('☎️ Chatalyst')
            .setDescription('Chatalyst is a free bot developed by `Hufee#7903` for users to explore new communities as well as having fun in a safe space.')
            .addFields({
                name: '❔ What Is Chatalyst?', value: 'Chatalyst is a bot which allows users to communicate between servers to meet new friends as well as new niches. ',
            }, {
                name: '🤨 Why Use Chatalyst?', value: 'Chatalyst is **100% free** compared to other competitors, it also has unique perks including: collectible badges, ability to upload images in calls and ability to see what server you are communicating with.',
            }, {
                name: '🪪 Data Concern.', value: "Your privacy matters to us. Chatalyst does not, has never, and will never sell your data. Chatalyst obtains global data provided by [<:DiscordLogo:1083142034195488828> Discord](https://discord.com/). By using the Service, you are expressly and voluntarily accepting the terms and conditions. \n\n**For any inquiries about your data, please do not hesitate to join our server linked below!**"
            })


        const aboutButtons = new ActionRowBuilder()
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



        return await interaction.reply({ embeds: [ aboutEmbed ], components: [ aboutButtons ], ephemeral: true }).catch(error => { return })
    }

    getRaw() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .toJSON();
    }
}