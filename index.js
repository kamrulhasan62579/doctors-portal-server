var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
require('dotenv').config()
 
var app = express()

const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qyyku.mongodb.net/doctorsPortal?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
 
app.use(cors())




client.connect(err => {
  const appointmentsCollection = client.db("doctorsPortal").collection("appointments");
 console.log('Database connected');
 app.post('/appointment', (req, res) => {
  appointmentsCollection.insertOne(req.body)
  .then(result => {
   return res.send(result.insertedCount > 0);
  })
 })
 app.delete('/delete/:id', (req, res) => {
   appointmentsCollection.deleteOne({_id: ObjectId(req.params.id)})
   .then(result => {
     return res.send(result.deletedCount > 0)
   })
 })
 app.get("/appointment", (req, res) => {
   appointmentsCollection.find({})
   .toArray((err, documents) => {
    return res.send(documents)
   })
 })
 app.post("/appointmentByDate", (req, res) => {
   const date = req.body;
  //  console.log(date.date)
   appointmentsCollection.find({dateState: date.date})
   .toArray((err, documents) => {
    return res.send(documents)
   })
 })

  const prescriptionsCollection = client.db("doctorsPortal").collection("prescriptions");
  app.post("/prescriptions", (req, res) => {
   prescriptionsCollection.insertOne(req.body)
   .then(result => {
    return res.send(result.insertedCount > 0)
   })
 })
  app.get("/prescriptions", (req, res) => {
   prescriptionsCollection.find({})
   .toArray((err, documents) => {
     return res.send(documents)
   })
 })


});

 

app.get('/', function (req, res) {
 return res.send('hello world')
})

app.listen(process.env.PORT || 3010, () => console.log('Listening from port 3010'))