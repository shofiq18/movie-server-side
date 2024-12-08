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



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();


    const movieCollection = client.db('movieDB').collection('movie');
    const favoritesCollection = client.db('movieDB').collection('favorites');

    app.get('/movie', async(req, res) => {
      const cursor = movieCollection.find();
      const result = await cursor.toArray(); 
      res.send(result);

    })
    app.get('/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await movieCollection.findOne(query);
      res.send(result);
    } )
    
    // Update data 

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateMovie = req.body;
    
      const movie = {
        $set: {
          poster: updateMovie.poster,
          title: updateMovie.title,
          genre: Array.isArray(updateMovie.genre) ? updateMovie.genre : [updateMovie.genre],
          duration: Number(updateMovie.duration),
          releaseYear: Number(updateMovie.releaseYear),
          rating: Number(updateMovie.rating),
          summary: updateMovie.summary,
          email: updateMovie.email,
        }
      };
    
      try {
        const result = await movieCollection.updateOne(filter, movie, options);
        res.send(result);
      } catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).send({ message: "Failed to update movie", error });
      }
    });
    



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


    
    app.post('/favorites', async (req, res) => {
      const favoriteMovie = req.body;
      try {
          const result = await favoritesCollection.insertOne(favoriteMovie);
          res.status(201).send(result);
      } catch (error) {
          console.error('Error adding to favorites:', error);
          res.status(500).send({ message: 'Server Error' });
      }
  });

  app.get('/favorites', async (req, res) => {
      const email = req.query.email;
      if (!email) {
          return res.status(400).send({ message: 'Email is required' });
      }
      try {
          const result = await favoritesCollection.find({ email }).toArray();
          res.status(200).send(result);
      } catch (error) {
          console.error('Error fetching favorites:', error);
          res.status(500).send({ message: 'Server Error' });
      }
  });


 

 
  


  app.delete('/favorites/:id', async (req, res) => {
    const id = req.params.id;
    console.log("Received ID to delete:", id);

    
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    try {
        
        const result = await favoritesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Favorite not found' });
        }

        res.status(200).json({ success: true, message: 'Favorite deleted successfully' });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});






    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully  movie portal server  connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('movie portal running update  on movie portal server vercel ')
})

app.listen(port, () => {
    console.log(`movie portal running on port : ${port}`)
})

 