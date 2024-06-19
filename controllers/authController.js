const axios = require('axios');
const Account = require('../models/account');
const Activity = require('../models/activity');
const stravaBaseUrl = require('../helpers');

const connect = async (req, res) => {
    const { code } = req.query;

    try {
        let result = '';
        if (!code) {
            result = `${stravaBaseUrl}/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&approval_prompt=force&scope=activity:read_all,activity:write`;
        } else {
            const response = await axios.post(`${stravaBaseUrl}/oauth/token`, {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code'
            });
            const { access_token, refresh_token, expires_at } = response.data;
            const { id, username, firstname, lastname, created_at } = response.data.athlete;

            await Account.findOneAndUpdate(
                { 'strava.id': id },
                {
                    $set: {
                        access_token,
                        refresh_token,
                        expires_at,
                        'strava.username': username,
                        'strava.firstname': firstname,
                        'strava.lastname': lastname,
                        'strava.created_at': new Date(created_at),
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            result = access_token;
        }

        res.status(201).send({ message: 'Strava connected successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const disconnect = async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required' });
    }

    try {
        const response = await axios.get(`${stravaBaseUrl}/api/v3/athlete`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        await axios.post(`${stravaBaseUrl}/oauth/deauthorize`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        await Account.findOneAndUpdate(
            { 'strava.id': response.data.id },
            {
                access_token: null,
                refresh_token: null,
                expires_at: null
            }
        );

        res.status(200).send({ message: 'Strava disconnected successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const webhook = async (req, res) => {
    const { aspect_type, object_type, object_id, owner_id } = req.body;
    try {
        if (aspect_type === 'create' && object_type === 'activity') {
            const account = await Account.findOne({ 'strava.id': owner_id });
            if (account && account.access_token) {
                const response = await axios.get(`${stravaBaseUrl}/api/v3/activities/${object_id}`, {
                    headers: {
                        Authorization: `Bearer ${account.access_token}`
                    }
                });
                if (response.data) {
                    const existingActivity = account.activities.find(activity => activity.id === response.data.id);
                    if (!existingActivity) {
                        account.activities.push({ 
                            id: response.data.id, 
                            name: response.data.name, 
                            distance: response.data.distance, 
                            type: response.data.type, 
                            sport_type: response.data.sport_type, 
                            start_date: response.data.start_date, 
                            elapsed_time: response.data.elapsed_time, 
                            description: response.data.description 
                        });
                        await account.save();
                    }

                    const activity = await Activity.findOne({ activity_id: response.data.id });
                    if (!activity) {
                        const newActivity = new Activity({
                            activity_id: response.data.id,
                            resource_state: response.data.resource_state,
                            athlete: {
                                id: response.data.athlete.id,
                                resource_state: response.data.athlete.resource_state
                            },
                            name: response.data.name,
                            distance: response.data.distance,
                            moving_time: response.data.moving_time,
                            elapsed_time: response.data.elapsed_time,
                            total_elevation_gain: response.data.total_elevation_gain,
                            type: response.data.type,
                            sport_type: response.data.sport_type,
                            workout_type: response.data.workout_type,
                            strava_id: response.data.id,
                            start_date: new Date(response.data.start_date),
                            start_date_local: new Date(response.data.start_date_local),
                            timezone: response.data.timezone,
                            utc_offset: response.data.utc_offset,
                            location_city: response.data.location_city,
                            location_state: response.data.location_state,
                            location_country: response.data.location_country,
                            achievement_count: response.data.achievement_count,
                            kudos_count: response.data.kudos_count,
                            comment_count: response.data.comment_count,
                            athlete_count: response.data.athlete_count,
                            photo_count: response.data.photo_count,
                            map: response.data.map,
                            trainer: response.data.trainer,
                            commute: response.data.commute,
                            manual: response.data.manual,
                            private: response.data.private,
                            visibility: response.data.visibility,
                            flagged: response.data.flagged,
                            gear_id: response.data.gear_id,
                            start_latlng: response.data.start_latlng,
                            end_latlng: response.data.end_latlng,
                            average_speed: response.data.average_speed,
                            max_speed: response.data.max_speed,
                            has_heartrate: response.data.has_heartrate,
                            heartrate_opt_out: response.data.heartrate_opt_out,
                            display_hide_heartrate_option: response.data.display_hide_heartrate_option,
                            upload_id: response.data.upload_id,
                            external_id: response.data.external_id,
                            from_accepted_tag: response.data.from_accepted_tag,
                            pr_count: response.data.pr_count,
                            total_photo_count: response.data.total_photo_count,
                            has_kudoed: response.data.has_kudoed,
                            description: response.data.description,
                            calories: response.data.calories,
                            perceived_exertion: response.data.perceived_exertion,
                            prefer_perceived_exertion: response.data.prefer_perceived_exertion,
                            segment_efforts: response.data.segment_efforts,
                            best_efforts: response.data.best_efforts,
                            photos: response.data.photos,
                            stats_visibility: response.data.stats_visibility,
                            hide_from_home: response.data.hide_from_home,
                            embed_token: response.data.embed_token,
                            similar_activities: response.data.similar_activities,
                            available_zones: response.data.available_zones
                        });
                        await newActivity.save();
                    };
                };
            };
        }

        res.status(200).send({ message: 'Synchronized successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyWebhook = async (req, res) => {
    // Your verify token. Should be a random string.
  const VERIFY_TOKEN = "random";
  // Parses the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Verifies that the mode and token sent are valid
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {     
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.json({"hub.challenge":challenge});  
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
};

module.exports = {
    connect,
    disconnect,
    webhook,
    verifyWebhook
};
