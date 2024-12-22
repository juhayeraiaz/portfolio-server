const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.68ftj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Database reference
        const db = client.db('myPortfolio');

        // Example: Access a collection
        const collection = db.collection('portfolioData');

        // You can start adding routes here that interact with your MongoDB collection
        // Example: Getting documents from the collection
        app.get('/portfolio', async (req, res) => {
            try {
                const data = await collection.find().toArray();
                res.json(data);
            } catch (error) {
                console.error('Error fetching data from MongoDB', error);
                res.status(500).send('Error fetching data');
            }
        });

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    } finally {
        // The connection is maintained for the lifetime of the app
        // No need to close it here
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Juhayer Aiaz Portfolio');
});

app.listen(port, () => {
    console.log(`Portfolio app listening on port ${port}`);
});
