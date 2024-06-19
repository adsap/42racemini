const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activity_id: { type: Number, required: true, unique: true },
    resource_state: { type: Number, required: true },
    athlete: {
        id: { type: Number, required: true },
        resource_state: { type: Number, required: true }
    },
    name: { type: String, required: true },
    distance: { type: Number, required: true },
    moving_time: { type: Number, required: true },
    elapsed_time: { type: Number, required: true },
    total_elevation_gain: { type: Number, required: true },
    type: { type: String, required: true },
    sport_type: { type: String, required: true },
    workout_type: { type: mongoose.Schema.Types.Mixed },
    strava_id: { type: Number, required: true, unique: true },
    start_date: { type: Date, required: true },
    start_date_local: { type: Date, required: true },
    timezone: { type: String, required: true },
    utc_offset: { type: Number, required: true },
    location_city: { type: String, default: null },
    location_state: { type: String, default: null },
    location_country: { type: String, default: null },
    achievement_count: { type: Number, required: true },
    kudos_count: { type: Number, required: true },
    comment_count: { type: Number, required: true },
    athlete_count: { type: Number, required: true },
    photo_count: { type: Number, required: true },
    map: {
        id: { type: String, required: true },
        polyline: { type: String, default: "" },
        resource_state: { type: Number, required: true },
        summary_polyline: { type: String, default: "" }
    },
    trainer: { type: Boolean, required: true },
    commute: { type: Boolean, required: true },
    manual: { type: Boolean, required: true },
    private: { type: Boolean, required: true },
    visibility: { type: String, required: true },
    flagged: { type: Boolean, required: true },
    gear_id: { type: String, default: null },
    start_latlng: { type: [Number], default: [] },
    end_latlng: { type: [Number], default: [] },
    average_speed: { type: Number, required: true },
    max_speed: { type: Number, required: true },
    has_heartrate: { type: Boolean, required: true },
    heartrate_opt_out: { type: Boolean, required: true },
    display_hide_heartrate_option: { type: Boolean, required: true },
    upload_id: { type: String, default: null },
    external_id: { type: String, default: null },
    from_accepted_tag: { type: Boolean, required: true },
    pr_count: { type: Number, required: true },
    total_photo_count: { type: Number, required: true },
    has_kudoed: { type: Boolean, required: true },
    description: { type: String, required: true },
    calories: { type: Number, required: true },
    perceived_exertion: { type: mongoose.Schema.Types.Mixed },
    prefer_perceived_exertion: { type: mongoose.Schema.Types.Mixed },
    segment_efforts: { type: [mongoose.Schema.Types.Mixed], default: [] },
    best_efforts: { type: [mongoose.Schema.Types.Mixed], default: [] },
    photos: {
        primary: { type: mongoose.Schema.Types.Mixed, default: null },
        count: { type: Number, required: true }
    },
    stats_visibility: [
        {
            type: { type: String, required: true },
            visibility: { type: String, required: true }
        }
    ],
    hide_from_home: { type: Boolean, required: true },
    embed_token: { type: String, required: true },
    similar_activities: {
        effort_count: { type: Number, required: true },
        average_speed: { type: Number, required: true },
        min_average_speed: { type: Number, required: true },
        mid_average_speed: { type: Number, required: true },
        max_average_speed: { type: Number, required: true },
        pr_rank: { type: mongoose.Schema.Types.Mixed },
        frequency_milestone: { type: mongoose.Schema.Types.Mixed },
        trend: {
            speeds: { type: [Number], default: [] },
            current_activity_index: { type: mongoose.Schema.Types.Mixed },
            min_speed: { type: Number, required: true },
            mid_speed: { type: Number, required: true },
            max_speed: { type: Number, required: true },
            direction: { type: Number, required: true }
        },
        resource_state: { type: Number, required: true }
    },
    available_zones: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
