/**
 * Model API Service (Stub)
 * 
 * This service communicates with the external Model Team's API.
 * Currently stubbed - will be implemented when Model Team provides endpoints.
 */

const MODEL_API_URL = process.env.MODEL_API_URL || 'http://localhost:8000';

/**
 * Generate embedding vector for content
 * @param {string} content - Text content to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
const generateEmbedding = async (content) => {
    // TODO: Call Model Team API
    // POST ${MODEL_API_URL}/embed
    // Body: { text: content }
    // Returns: { embedding: [...] }

    console.log('[ModelAPI] generateEmbedding called (stub)');
    return []; // Empty array for now
};

/**
 * Generate recap sentence for a node
 * @param {Object} node - Node document
 * @returns {Promise<string|null>} - Recap sentence
 */
const generateRecap = async (node) => {
    // TODO: Call Model Team API
    // POST ${MODEL_API_URL}/recap
    // Body: { content, previous_similarity, neighbor_context }
    // Returns: { recap: "..." }

    console.log('[ModelAPI] generateRecap called (stub)');
    return null; // No recap for now
};

/**
 * Find similar nodes using kNN
 * @param {number[]} embedding - Embedding vector
 * @param {number} k - Number of neighbors
 * @returns {Promise<string[]>} - Array of node IDs
 */
const findNeighbors = async (embedding, k = 5) => {
    // TODO: Call Model Team API
    // POST ${MODEL_API_URL}/neighbors
    // Body: { embedding, k }
    // Returns: { neighbors: ["id1", "id2", ...] }

    console.log('[ModelAPI] findNeighbors called (stub)');
    return []; // No neighbors for now
};

module.exports = {
    generateEmbedding,
    generateRecap,
    findNeighbors
};
