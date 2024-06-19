const Activity = require('../models/activity');

const getAll = async (req, res) => {
    const { type, athlete_id } = req.query;
    try {
        let query = {};

        if (type) {
            query.type = new RegExp(`^${req.query.type}$`, 'i');
        }

        if (athlete_id) {
            query['athlete.id'] = athlete_id;
        }

        const activities = await Activity.find(query).sort({ createdAt: -1 });
        res.status(200).json({ message: 'success', result: activities });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getByActivityId = async (req, res) => {
    const { activityId } = req.params;
    try {
        const activity = await Activity.findOne({ activity_id: activityId });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ message: 'success', result: activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteByActivityId = async (req, res) => {
    const { activityId } = req.params;
    try {
        const activity = await Activity.findOneAndDelete({ activity_id: activityId });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getByActivityId,
    deleteByActivityId,
};