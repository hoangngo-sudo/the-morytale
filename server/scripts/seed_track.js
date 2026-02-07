const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Track = require('../models/Track');
const Node = require('../models/Node');
const User = require('../models/User');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the first user to assign the track to
        const user = await User.findOne();
        if (!user) {
            console.error('No users found! Please register a user via the app first.');
            process.exit(1);
        }
        console.log(`Seeding data for user: ${user.username} (${user._id})`);

        // Create a Mock Node (representing a generated story beat)
        const node = await Node.create({
            user_id: user._id,
            user_item_id: null, // No real item for this test
            recap_sentence: "This is a test node seeded for verification.",
            week_id: "2024-W06"
        });

        // Create a Mock Track (representing a weekly compilation)
        const track = await Track.create({
            user_id: user._id,
            node_ids: [node._id], // Link the node
            story: "This is a verification track story. It confirms that the backend can serve data to the frontend profile cards.",
            week_id: "2024-W06",
            status: 'completed', // 'completed' ensures it shows up in history
            concluded: true
        });

        console.log('✅ Dummy Track created:', track._id);
        console.log('You can now refresh your Profile Page to see this track!');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedData();
