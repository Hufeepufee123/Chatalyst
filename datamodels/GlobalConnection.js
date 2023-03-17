const Mongoose = require('mongoose');

module.exports = Mongoose.model("Global Connections", new Mongoose.Schema({
    guild_1: { type: String, required: true, unique: true },
    channel_1: { type: String, required: true, unique: true },

    guild_2: { type: String, required:false, unique: true },
    channel_2: { type: String, required:false, unique: true },

    guild_3: { type: String, required:false, unique: true },
    channel_3: { type: String, required:false, unique: true },

    guild_4: { type: String, required:false, unique: true },
    channel_4: { type: String, required:false, unique: true },

    guild_5: { type: String, required:false, unique: true },
    channel_5: { type: String, required:false, unique: true },

    guild_6: { type: String, required:false, unique: true },
    channel_6: { type: String, required:false, unique: true },

    guild_7: { type: String, required:false, unique: true },
    channel_7: { type: String, required:false, unique: true },

    guild_8: { type: String, required:false, unique: true },
    channel_8: { type: String, required:false, unique: true },

}))

