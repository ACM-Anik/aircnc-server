const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxma4ez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function run() {
    try {
        const usersCollection = client.db('aircnc').collection('users');
        const roomsCollection = client.db('aircnc').collection('rooms');
        const bookingsCollection = client.db('aircnc').collection('bookings');

        // Save user email and role in DB:-
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const query = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,

            };
            const result = await usersCollection.updateOne(query, updateDoc, options);
            console.log(result);
            res.send(result);
        });

        // Get all rooms:-
        app.get('/rooms', async (req, res) => {
            const result = await roomsCollection.find().toArray();
            res.send(result);
        });

        // Get a single room:-
        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await roomsCollection.findOne(query);
            res.send(result);
        });

        // Save a room in DB:-
        app.post('/rooms', async (req, res) => {
            const room = req.body;
            console.log(room);
            const result = await roomsCollection.insertOne(room);
            res.send(result);
        });




        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 })
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        )
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('AirCNC Server is running..')
});

app.listen(port, () => {
    console.log(`AirCNC is running on port ${port}`)
});