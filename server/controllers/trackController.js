const Node = require('../models/Node');
const Track = require('../models/Track');

/**
 * Get start of current week (Monday)
 */
const getWeekStart = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

/**
 * Get current track with all nodes
 * GET /api/tracks/current
 */
const getCurrentTrack = async (req, res) => {
    try {
        const userId = req.user.id;
        const weekStart = getWeekStart();

        // Find track for current week
        let track = await Track.findOne({ user_id: userId, week_start: weekStart })
            .populate({
                path: 'node_ids',
                options: { sort: { created_at: 1 } }
            });

        if (!track) {
            // No track this week yet
            return res.json({
                user_id: userId,
                week_start: weekStart,
                nodes: [],
                personal_story: null,
                community_story: null
            });
        }

        res.json({
            _id: track._id,
            user_id: track.user_id,
            week_start: track.week_start,
            nodes: track.node_ids,
            personal_story: track.personal_story,
            community_story: track.community_story,
            generated_at: track.generated_at
        });

    } catch (error) {
        console.error('getCurrentTrack error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get weekly story for a track
 * GET /api/tracks/:id/story
 */
const getWeeklyStory = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }

        // Check if user owns this track or is a friend
        // For now, just return the story
        res.json({
            track_id: track._id,
            week_start: track.week_start,
            personal_story: track.personal_story || 'Story not yet generated. Check back at the end of the week!',
            community_story: track.community_story || 'Community reflection not yet available.',
            generated_at: track.generated_at
        });

    } catch (error) {
        console.error('getWeeklyStory error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get track history for a user
 * GET /api/tracks/history
 */
const getTrackHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const tracks = await Track.find({ user_id: userId })
            .sort({ week_start: -1 })
            .limit(12); // Last 12 weeks

        res.json(tracks);

    } catch (error) {
        console.error('getTrackHistory error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getCurrentTrack,
    getWeeklyStory,
    getTrackHistory
};
