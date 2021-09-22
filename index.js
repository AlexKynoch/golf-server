const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Session } = require('./models/session')
const port = process.env.PORT || 3005

mongoose.connect('mongodb+srv://root:toor@cluster0.kil7v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true });

// defining the Express app
const app = express()

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// get a session
app.get('/', async (req, res) => {
  res.send(await Session.find());
});

// post a session
app.post('/', async (req, res) => {
  const newSession = req.body;
  console.log(newSession);
  const session = new Session(newSession);
  await session.save();
  res.send({ message: 'New session inserted.' });
});


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

// starting the server
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("Database connected!")
});