const Mongoose = require('mongoose');

module.exports = Mongoose.model("Connections", new Mongoose.Schema({
    guild_1: { type: String, required: true, unique: true },
    channel_1: { type: String, required: true, unique: true },

    guild_2: { type: String, required: true, unique: true },
    channel_2: { type: String, required: true, unique: true },

    messages: { type: Number, required: true, default: 0 },
}))

