const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nbqc6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const productCollection = client.db('onlineFood').collection('products');
        const orderCollection = client.db('onlineFood').collection('orders');

        //homepage 3 product
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.limit(3).toArray();
            res.send(products);
        })

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        //order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('Online food server is running');
})



app.listen(port, () => {
    console.log(`Online food server running on ${port}`)
})