const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
require('dotenv').config()
//middleware 
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzichn4.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const serviceCollection = client.db('carShop').collection('car');
const BookingsCollection = client.db('carShop').collection('booking');


app.post('/jwt',async (req,res)=>{
  const user = req.body;
  console.log(user);
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})

  res
  .cookie('token', token , {
    httpOnly: true,
    secure: false,
    sameSite: 'none'

  })
  
  .send({success: true});
})

app.get('/services', async(req,res)=>{
    const cursor = serviceCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/services/:id',async (req,res)=>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const options = {
        // Sort matched documents in descending order by rating
        
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1 ,service_id:1,img:1},
      };
    const result = await serviceCollection.findOne(query,options);
    res.send(result);


})
// bookings

app.get('/bookings', async (req,res)=>{
  console.log(req.query.email);
  let query = {};
  if(req.query?.email){
    query = {email: req.query.email}
  }
  const result = await BookingsCollection.find(query).toArray();
  res.send(result)
})

app.post('/bookings',async (req,res)=>{
  const booking = req.body;
  console.log(booking);
  const result = await BookingsCollection.insertOne(booking);
  res.send(result);
})




app.get('/',(req,res)=>{
    res.send('Doctor running at browser')
})


app.listen(port, ()=>{
    console.log(`Doctor is running at port ${port}`)
})