const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.68ftj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Database and collection references
        const db = client.db('myportfolio');
        const projectsCollection = db.collection('projects');

        // Fetch all projects
        app.get('/projects', async (req, res) => {
            try {
                const projects = await projectsCollection.find().toArray();
                res.status(200).json(projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                res.status(500).json({ error: 'Failed to fetch projects' });
            }
        });

        // Add a new project
        app.post('/projects', async (req, res) => {
            try {
                const project = req.body;
                const result = await projectsCollection.insertOne(project);
                res.status(201).json({ insertedId: result.insertedId });
            } catch (error) {
                console.error('Error inserting project:', error);
                res.status(500).json({ error: 'Failed to insert project' });
            }
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Juhayer Aiaz Portfolio');
});

app.listen(port, () => {
    console.log(`Portfolio app listening on http://localhost:${port}`);
});
