const Account = require('../models/account');

const getAll = async (_req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json({ message: 'success', result: accounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByAthleteId = async (req, res) => {
    const { athleteId } = req.params;
    try {
        const account = await Account.findOne({ 'strava.id': athleteId });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ message: 'success', result: account });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getByAthleteId,
};
