const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Mongoose = require('mongoose');

require('dotenv').config();

const loadButtons = require('./handlers/buttons')
const loadCommands = require('./handlers/commands');
const loadEvents = require('./handlers/events');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ],
    rest: {
        version: '10'
    },
    shards: 'auto'
}); 

/**
 * Collections
 */
client.Buttons = new Collection();
client.Commands = new Collection();
client.Events = new Collection();

/**
 * Handlers
 */
client.loadButtons = loadButtons;
client.loadEvents = loadEvents;
client.loadCommands = loadCommands;

client.loadButtons(client);
client.loadEvents(client);
client.loadCommands(client);

/**
 * 
 * Constants
 */
client.ThemeColor = "#A020F0";
client.Error = (Message) => {
    throw new Error(Message);
};

/**
 * 
 * Start Workers
 */
try{
    Mongoose.set('strictQuery', true)
    Mongoose.connect(process.env.MAIN_DATABASE)
    client.login(process.env.TOKEN);
} catch (error) {
    return client.Error(error)
}
