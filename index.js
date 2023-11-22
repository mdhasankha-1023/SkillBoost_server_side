const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// mongodb start

const uri =`mongodb+srv://${process.env.SKB_DB_USER}:${process.env.SKB_DB_PASS}@cluster0.kgqmoa1.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    // mongodb collection
    const courseCollection = client.db('skillBoost_server').collection('courses');
    const userCollection = client.db('skillBoost_server').collection('users');
    const selectedCourseCollection = client.db('skillBoost_server').collection('selectedCourses');


    // course related route
    //  get all courses 
    app.get('/courses', async(req, res) => {
        const result = await courseCollection.find().toArray();
        res.send(result); 
    })

    // POST COURSE
    app.post('/courses', async (req, res) => {
      const course = req.body;
      // console.log(course);
      const result = await courseCollection.insertOne(course);
      res.send(result)
    })

    // selected course post
    app.post('/selected-courses/:email', async (req, res) => {
      const email = req.params.email;
      const course = req.body;
      const {studentEmail, selectedId} = course;

      // condition for avoid duplicate data
      if(email === studentEmail){
        const query = {selectedId: selectedId}
        const filter = await selectedCourseCollection.findOne(query);
        if(filter){
          return res.send({message: 'This card is already added'})
        }
      }
      const result = await selectedCourseCollection.insertOne(course);
      res.send(result)
    })


    // instructor related routes
    // GET INSTRUCTOR COURSES
    app.get('/courses/:email', async (req, res) => {
      const userEmail = req.params.email;
      // console.log(userEmail);
      const query = {instructorEmail: userEmail}
      const result = await courseCollection.find(query).toArray();
      res.send(result) 
    })


    // users related routes
    app.post('/users', async(req, res) => {
      const userInfo = req.body;
      // console.log(userInfo);
      const query = {email : userInfo.email} 
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'Already have an account'})
      }
      const result = await userCollection.insertOne(userInfo);
      res.send(result)
    })

    // get all users
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

// mongodb end




// test server
app.get('/', (req, res) => {
    res.send('This is skillBoost server')
})

// listen server
app.listen(port, () => {
    console.log(`This server is running on port: ${port}`);
})
