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

  const doctorsCollection = client.db("doctorsPortal").collection("doctors");
  app.post("/doctors", (req, res) => {
   doctorsCollection.insertOne(req.body)
   .then(result => {
    return res.send(result.insertedCount > 0)
   })
 })
   app.get("/doctors", (req, res) => {
   doctorsCollection.find({})
   .toArray((err, documents)=>{
    return res.send(documents)
   })
 })
    app.get("/isdoctor/:email", (req, res) => {
      const email = req.query.email;
      doctorsCollection.find({email: email})
      .toArray((err, documents)=>{
        return res.send(documents.length > 0)
    })
 })

  app.post("/appointmentByDate", (req, res) => {
    const date = req.body;
    const email = req.body.email;

      doctorsCollection.find({email: email})
      .toArray((err, documents)=>{
      const filter = {dateState: date.date}
      if (documents.length === 0) {
          filter.email= email;
      }
      appointmentsCollection.find(filter)
      .toArray((err, doctor) => {
        return res.send(doctor)
      })
   })
 })



});

 

app.get('/', function (req, res) {
 return res.send('hello world')
})

app.listen(process.env.PORT || 3010, () => console.log('Listening from port 3010'))