const Mongoose = require('mongoose');

module.exports = Mongoose.model("Users", new Mongoose.Schema({
    discord_id: { type: String, required: true, unique: true },
    messages: { type: Number, required: true, default: 0 },

    blacklist_level: { type: Number, required: true, default: 0 },
    
    badges: { type: Array, required: true },
}))
