const Mongoose = require('mongoose');

module.exports = Mongoose.model("Servers", new Mongoose.Schema({
    guild_id: { type: String, required: true, unique: true },

    calls: { type: Number, required: true, default: 0 },
    leaderboard: { type: Array, required: true },

    settings: { 
        setup: { type: Boolean, required: true,  default: false },
        private: { type: Boolean, required: true, default: false },
        filterText: { type: Boolean, required: true, default: false },
        
        callChannel: { type: String, required: true },
        allowImages: { type: Boolean, required: true, default: true },

        blacklistRole: { type: String, required: true },
        whitelistRole: { type: String, required: true },
    }
}))
