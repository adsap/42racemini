const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    access_token: { type: String },
    refresh_token: { type: String },
    expires_at: { type: Number },
    strava: {
        id: { type: Number, required: true, unique: true },
        username: { type: String },
        firstname: { type: String },
        lastname: { type: String },
        created_at: { type: Date, default: Date.now }
    },
    activities: [
        {
            id: { type: Number, required: true, unique: true },
            name: { type: String },
            distance: { type: Number },
            type: { type: String },
            sport_type: { type: String },
            start_date: { type: Date },
            elapsed_time: { type: Number },
            description: { type: String },
        }
    ],
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
