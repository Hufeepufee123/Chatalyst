const { Routes } = require('discord.js');
const fs = require('fs');

const { fetchFiles } = require('../util/Helper');
const { debug_mode, debug_server, beta_servers } = require('../devconfig.json');

module.exports = async (client) => {
    await fs.readdirSync(`./commands/`).forEach((category) => {
        if (category === '.DS_Store') return;
        const commands = fetchFiles(`./commands/${category}`, '.js');

        commands.forEach((_command) => {
            const __command = require(`../commands/${category}/${_command}`);
            const command = new __command();

            client.Commands.set(command.name, command);
        })
    });

    const rawCommandJSON = client.Commands.map((command) => {
        return command.getRaw();
    });

    if(debug_mode){
        console.log(process.env.APPLICATION_ID, debug_mode, debug_server)
        await client.rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, debug_server), {
            body: rawCommandJSON
        })
    } else {
        await client.rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, debug_server), {
            body: []
        })

        

        await client.rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
            body: rawCommandJSON
        })
    }
}