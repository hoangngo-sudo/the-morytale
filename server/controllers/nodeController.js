const Node = require('../models/Node');
const Track = require('../models/Track');
const modelApi = require('../services/modelApi');

/**
 * Get ISO week string (e.g., "2026-W06")
 */
const getWeekId = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

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
 * Create a new node
 * POST /api/nodes
 */
const createNode = async (req, res) => {
    try {
        const userId = req.user.id;
        const { content_type, content_url, text, caption } = req.body;

        // Validate content_type
        if (!['text', 'image'].includes(content_type)) {
            return res.status(400).json({ message: 'content_type must be "text" or "image"' });
        }

        // Validate content
        if (content_type === 'text' && !text) {
            return res.status(400).json({ message: 'Text content is required for text nodes' });
        }
        if (content_type === 'image' && !content_url) {
            return res.status(400).json({ message: 'Image URL is required for image nodes' });
        }

        // Check daily limit (3 nodes per day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayCount = await Node.countDocuments({
            user_id: userId,
            created_at: { $gte: today, $lt: tomorrow }
        });

        if (todayCount >= 3) {
            return res.status(429).json({ message: 'Daily limit reached (3 nodes per day)' });
        }

        // Get week info
        const weekId = getWeekId();
        const weekStart = getWeekStart();

        // Find previous node for linking
        const previousNode = await Node.findOne({ user_id: userId })
            .sort({ created_at: -1 });

        // Generate embedding (stub for now)
        const content = content_type === 'text' ? text : caption || '';
        const embedding = await modelApi.generateEmbedding(content);

        // Create the node
        const node = await Node.create({
            user_id: userId,
            content_type,
            content_url: content_type === 'image' ? content_url : null,
            text: content_type === 'text' ? text : null,
            caption,
            embedding,
            previous_node_id: previousNode ? previousNode._id : null,
            neighbor_node_ids: [],
            recap_sentence: null,
            week_id: weekId
        });

        // Find/create track for this week and add node
        let track = await Track.findOne({ user_id: userId, week_start: weekStart });
        if (!track) {
            track = await Track.create({
                user_id: userId,
                week_start: weekStart,
                node_ids: [node._id]
            });
        } else {
            track.node_ids.push(node._id);
            await track.save();
        }

        // Fire-and-forget: Generate recap (async, don't wait)
        modelApi.generateRecap(node).then(async (recap) => {
            if (recap) {
                await Node.findByIdAndUpdate(node._id, { recap_sentence: recap });
            }
        }).catch(console.error);

        res.status(201).json({
            message: 'Node created successfully',
            node
        });

    } catch (error) {
        console.error('createNode error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get a node by ID
 * GET /api/nodes/:id
 */
const getNode = async (req, res) => {
    try {
        const node = await Node.findById(req.params.id)
            .populate('user_id', 'username avatar')
            .populate('previous_node_id');

        if (!node) {
            return res.status(404).json({ message: 'Node not found' });
        }

        res.json(node);

    } catch (error) {
        console.error('getNode error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * Get user's nodes
 * GET /api/nodes/user/:userId
 */
const getUserNodes = async (req, res) => {
    try {
        const userId = req.params.userId;
        const nodes = await Node.find({ user_id: userId })
            .sort({ created_at: -1 })
            .limit(50);

        res.json(nodes);

    } catch (error) {
        console.error('getUserNodes error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createNode,
    getNode,
    getUserNodes
};
