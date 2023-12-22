const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.21hcnfr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const userCollection = client.db('taskifyDB').collection('users');
        const taskCollection = client.db('taskifyDB').collection('tasks');

        app.get('/tasks/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/tasks', async(req, res) => {
            const taskInfo = req.body;
            const result = await taskCollection.insertOne(taskInfo);
            res.send(result);
        })

        app.patch('/tasks/:id', async(req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id : new ObjectId(id)}
            const updateDoc = {
                $set: {
                    status : updateInfo.status
                }
            }
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    name: updateInfo.name, 
                    deadline: updateInfo.deadline, 
                    priority: updateInfo.priority, 
                    description: updateInfo.description
                }
            }
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/tasks/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Taskify Pro Server is Running')
})

app.listen(port, () => {
    console.log('Taskify Pro is Running on port', port);
})