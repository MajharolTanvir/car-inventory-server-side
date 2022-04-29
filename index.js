const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middlewear
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m6yuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const carCollection = client.db('car-inventory').collection('car-data')
        
        app.get('/inventory', async (req, res) => {
            const query = req.query;
            const cursor = carCollection.findOne(query)
            const cars = await cursor
            res.send(cars)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)





app.get('/', (req, res) => {
    res.send('hello dear work smoothly')
})

app.listen(port, () => {
    console.log('app can work on', port);
})