const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    // strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


 const db = client.db('aggregation');

   const salesCollection = db.collection('sales');
   const regionsCollection = db.collection('regions');

// 
const totalAmount = await salesCollection.aggregate([
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        year: 2023
      }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$transactions"
      }
  },
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        "transactions.item": "Apple"
      }
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: null,
        totalAmount: {
          $sum: "$transactions.amount"
        }
      }
  }
]).toArray();

console.log('Total Amount of Apples sold in 2023:', totalAmount);





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})