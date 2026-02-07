const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getCurrentTrack, getWeeklyStory, getTrackHistory } = require('../controllers/trackController');

// All routes are protected
router.use(authMiddleware);

// GET /api/tracks/current - Get current week's track
router.get('/current', getCurrentTrack);

// GET /api/tracks/history - Get track history
router.get('/history', getTrackHistory);

// GET /api/tracks/:id/story - Get weekly story
router.get('/:id/story', getWeeklyStory);

module.exports = router;
