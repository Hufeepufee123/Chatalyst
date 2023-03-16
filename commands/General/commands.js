const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const SlashCommand = require('../../util/SlashCommand');

const icons = {
    'supporter': '<:GoldPatron:981733889473134613>',
    'phone': '☎️',
    'server': '📜',
    'moderation': '<:Moderator:998327646628872344>'
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const updateInteraction = async (client, interaction) => {

    try {
        const subcommand = interaction.values[0]

        const commands = client.Commands
    
        let commandsTable = new Array
    
        for (const command of commands) {
            let commanddata = command[1]
            if (commanddata._tag == subcommand) {
                commandsTable.push(command)
            }
    
        }
    
        let newEmbed = new EmbedBuilder()
            .setTitle(`${icons[subcommand]} ${capitalizeFirstLetter(subcommand)} Commands`)
    
    
        let addText = ''
        for (let command of commandsTable) {
            const commandData = command[1]
            if (commandData._guildAdminOnly){
                addText += '**/**`' + capitalizeFirstLetter(commandData._name) + '`***** **-** ' + commandData._description + '\n'
            } else {
                addText += '**/**`' + capitalizeFirstLetter(commandData._name) + '` **-** ' + commandData._description + '\n'
            }
            
        }
    
        newEmbed.setDescription(addText)
    
        return await interaction.update({ content: '', embeds: [ newEmbed ] }).catch(error => { 
            return
        })
    } catch (error) {
        return await interaction.update({ content: 'These commands arent out yet!', embeds: [ ] }).catch(error => {return})
    }

    
}


module.exports = class Help extends SlashCommand {
    constructor() {
        super('commands', 'Shows list of commands', 'server', false, false);
    }

    async run(client, UserCollection, ServerCollection, interaction) {

        const embed = new EmbedBuilder()
            .setTitle("<:Slash:1083135300752113694>Commands:")
            .setDescription('```Choose your subcommand option below```')


        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('commands')
                    .setPlaceholder('Choose Subcommand Option')
                    .setMaxValues(1)
                    .addOptions([
                        {
                            emoji: '<:GoldPatron:981733889473134613>',
                            label: 'Supporter Commands',
                            description: 'List of supporter only commands',
                            value: 'supporter',
                        },
                        {
                            emoji: '📜',
                            label: 'Server Commands',
                            description: 'List of server commands',
                            value: 'server',
                        },
                        {
                            emoji: '☎️',
                            label: 'Phone Commands',
                            description: 'List of phone commands',
                            value: 'phone',
                        },
                        {
                            emoji: '<:Moderator:998327646628872344>',
                            label: 'Moderation Commands',
                            description: 'List of moderation commands',
                            value: 'moderation'
                        }
                    ]),
            );

        return await interaction.reply({ embeds: [embed], components: [row], ephemeral: true }).then(async () => {

            client.on('interactionCreate', async (component) => {
                const { customId } = component
                if (customId === 'commands') {
                    return await updateInteraction(client, component)
                }
            })

        })
    }

    getRaw() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .toJSON();
    }
}