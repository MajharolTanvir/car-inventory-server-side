const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlewear
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m6yuv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const carCollection = client.db('car-inventory').collection('car-data')
        
        // get all data
        // https://car-inventory-bd.herokuapp.com/inventorys
        app.get('/inventorys', async (req, res) => {
            const query = req.query;
            const cursor = carCollection.find(query)
            const cars = await cursor.toArray()
            res.send(cars)
        })

        // get myProducts
        app.get('/myProducts?email=', async (req, res) => {
            const query = req.query;
            const cursor = carCollection.find(query)
            const cars = await cursor.toArray()
            res.send(cars)
        })


        // get single data
        app.get('/inventory/:id', async (req, res) => {
            const query = req.params.id;
            const filter = { _id: ObjectId(query) }
            const cursor = carCollection.findOne(filter)
            const cars = await cursor
            res.send(cars)
        })

        // post new data
        // https://car-inventory-bd.herokuapp.com/inventory
        app.post('/inventorys', async (req, res) => {
            const newCar = req.body;
            console.log(newCar);
            const car = await carCollection.insertOne(newCar)
            res.send(car);
        })


        // Put?Update your data .
        // https://car-inventory-bd.herokuapp.com/inventory/id=${id}
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const updateStock = req.body;
            console.log(updateStock);
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    quantity: updateStock.updateQuantity,
                },
            };
            const result = await carCollection.updateMany(filter, updateDoc);
            res.send(result);
            console.log(result);
        })

        // Delete this item
        // https://car-inventory-bd.herokuapp.com/inventory/id=${id}
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const cursor = await carCollection.deleteOne(filter);
            res.send(cursor);
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