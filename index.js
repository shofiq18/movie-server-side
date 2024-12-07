const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());



// mongodb database start here

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5gtpi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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


    const movieCollection = client.db('movieDB').collection('movie');

    app.get('/movie', async(req, res) => {
      const cursor = movieCollection.find();
      const result = await cursor.toArray(); 
      res.send(result);

    })


    app.delete('/movie/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    })





    app.get('/movie/top', async (req, res) => {
      try {
        const result = await movieCollection
          .find()
          .sort({ rating: -1 })
          .limit(6)
          .toArray();
    
        console.log(result); 
        res.send(result);
      } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).send({ message: "Failed to fetch movies", error });
      }
    });
    
    






    app.get('/movie/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const movie = await movieCollection.findOne(query);
      res.send(movie);



    })


    app.post('/movie', async(req, res) => {
      const newMovie = req.body;
      console.log(newMovie);
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);

    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully  movie portal server  connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// mongodb database end here 




app.get('/', (req, res) => {
    res.send('movie portal running update  on movie portal server vercel ')
})

app.listen(port, () => {
    console.log(`movie portal running on port : ${port}`)
})


 