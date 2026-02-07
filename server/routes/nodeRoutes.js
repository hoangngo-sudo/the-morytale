const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createNode, getNode, getUserNodes } = require('../controllers/nodeController');

// All routes are protected
router.use(authMiddleware);

// POST /api/nodes - Create a new node
router.post('/', createNode);

// GET /api/nodes/:id - Get a node by ID
router.get('/:id', getNode);

// GET /api/nodes/user/:userId - Get user's nodes
router.get('/user/:userId', getUserNodes);

module.exports = router;
