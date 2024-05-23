const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Grocery app Running');
});


/* ---------------------------------- Mongodb code here ----------------------------- */


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjkyc58.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection
    const productsCollection = client.db('groceryDb').collection('products');


    app.get('/products', async(req, res) => {
        const result = await productsCollection.find().toArray();
        res.send(result);
    });

    app.get('/products/:productid', async(req, res) => {
        const id = req.params.productid;
        const query = {_id : new ObjectId(id)}
        const result = await productsCollection.findOne(query);
        res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


/* ---------------------------------- Mongodb code here ----------------------------- */




app.listen(port, () => {
    console.log(`Grocery app is running on port: ${port}`);
});