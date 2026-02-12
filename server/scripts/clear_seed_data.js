const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Track = require('../models/Track');
const Node = require('../models/Node');
const Item = require('../models/Item');

const clearAll = process.argv.includes('--all');

const clearSeedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        if (clearAll) {
            console.log('⚠️  Clearing ALL data (--all flag)...');
            // Delete ALL items, nodes, and tracks (fresh start)
            const itemsDeleted = await Item.deleteMany({});
            console.log(`✅ Deleted ${itemsDeleted.deletedCount} items`);

            const nodesDeleted = await Node.deleteMany({});
            console.log(`✅ Deleted ${nodesDeleted.deletedCount} nodes`);

            const tracksDeleted = await Track.deleteMany({});
            console.log(`✅ Deleted ${tracksDeleted.deletedCount} tracks`);
        } else {
            console.log('Clearing seed data only (use --all to clear everything)...');
            // Delete items with picsum placeholder URLs (seeded data)
            const itemsDeleted = await Item.deleteMany({
                content_url: { $regex: /picsum\.photos/ }
            });
            console.log(`✅ Deleted ${itemsDeleted.deletedCount} seeded items`);
        }

        console.log('Seed data cleanup complete!');

    } catch (error) {
        console.error('Cleanup error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

clearSeedData();
