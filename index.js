const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { Admin } = require("./models/admin");
const { Location } = require("./models/location");
const { Session } = require("./models/session");
const { User } = require("./models/user");
const port = process.env.PORT || 3005;
var ObjectId = require("mongodb").ObjectId;

mongoose.connect(
  "mongodb+srv://root:toor@cluster0.kil7v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// defining the Express app
const app = express();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// add new user
app.post("/user", async (req, res) => {
  if (
    !req.body.userName ||
    !req.body.password ||
    !req.body.email ||
    !req.body.location ||
    !req.body.nameFirst
  ) {
    return res.sendStatus(400).send();
  }
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
    location: req.body.location,
    role: req.body.role,
    email: req.body.email,
    phone: req.body.phone,
    availability: [
      ["Monday", false],
      ["Tuesday", false],
      ["Wednesday", false],
      ["Thursday", false],
      ["Friday", false],
      ["Saturday", false],
      ["Sunday", false],
    ],
    userNew: true,
    nameFirst: req.body.nameFirst,
    nameLast: req.body.nameLast,
    details: req.body.details,
    token: undefined,
  });
  user.save();
  res.send({ result: true });
});

// add new admin
app.post("/admin", async (req, res) => {
  if (
    !req.body.userName ||
    !req.body.password ||
    !req.body.email ||
    !req.body.nameFirst
  ) {
    return res.sendStatus(400).send();
  }
  if (!req.body.location && req.body.role === CGA) {
    return res.sendStatus(400).send();
  }
  const admin = new Admin({
    userName: req.body.userName,
    password: req.body.password,
    location: req.body.location,
    role: req.body.role,
    email: req.body.email,
    phone: req.body.phone,
    nameFirst: req.body.nameFirst,
    nameLast: req.body.nameLast,
    details: req.body.details,
    token: undefined,
  });
  admin.save();
  res.send({ result: true });
});

// authorisation
app.post("/auth", async (req, res) => {
  const user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    console.log("no user");
    return res.sendStatus(401);
  }
  if (req.body.password !== user.password) {
    return res.sendStatus(403);
  }
  user.token = uuidv4();
  await user.save();
  res.send({ token: user.token });
});

// ----------------------------------------?AUTHORIZATION MIDDLEWARe
// app.use(async (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const user = await User.findOne({ token: authHeader });
//   if (user) {
//     next(); //successfully passed gatekeeper
//   } else {
//     res.sendStatus(403);
//   }
// });
// -------------------------------------?AUTHORIZATION MIDDLEWARe ENDS

//
// defining CRUD operations
//

// client logs in
// if client exist/cr5edentials are vaild
// token is generated
// sent 2 places
// first: User thats loghged in is now storing thier current session token
// second: sent to front end

// acess protected endpoint:
// req.headers.auth from frontend === token in backend

//
//Admin
//

// get all admin
app.get("/admin", async (req, res) => {
  res.send(await Admin.find());
});

// get admin by userName
app.get("/adminname/:userName", async (req, res) => {
  res.send(await Admin.find({ userName: req.params.userName }));
});

// get admin by location
app.get("/adminlocation/:location", async (req, res) => {
  res.send(await Admin.find({ location: req.params.location }));
});

// get admin by role
app.get("/adminrole/:role", async (req, res) => {
  res.send(await Admin.find({ role: req.params.role }));
});

// get admin by nameFirst
app.get("/adminfirstname/:nameFirst", async (req, res) => {
  res.send(await Admin.find({ nameFirst: req.params.nameFirst }));
});

// get admin by nameLast
app.get("/adminlastname/:nameLast", async (req, res) => {
  res.send(await Admin.find({ nameLast: req.params.nameLast }));
});

// get admin by id
app.get("/adminid/:id", async (req, res) => {
  res.send(await Admin.find({ _id: req.params.id }));
});

// delete an admin
app.delete("/admin/:id", async (req, res) => {
  await Admin.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Admin removed." });
});

// update admin
app.put("/admin/:id", async (req, res) => {
  await Admin.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Admin updated." });
});

//
//Locations
//
//create location
app.post("/location", async (req, res) => {
  const newLocation = req.body;
  const location = new Location(newLocation);
  await location.save();
  res.send({ message: "New location added." });
});

// get all locations
app.get("/location", async (req, res) => {
  res.send(await Location.find());
});

// get location by name
app.get("/locationname/:locationName", async (req, res) => {
  res.send(await Location.find({ locationName: req.params.locationName }));
});

// get location by user
app.get("/locationuser/:activeUsers", async (req, res) => {
  res.send(await Location.find({ activeUsers: req.params.activeUsers }));
});

// get location by Volunteer
app.get("/locationvolunteer/:activeVolunteer", async (req, res) => {
  res.send(
    await Location.find({ activeVolunteer: req.params.activeVolunteer })
  );
});

// get location by CGA
app.get("/locationcga/:activeCGA", async (req, res) => {
  res.send(await Location.find({ activeCGA: req.params.activeCGA }));
});

// get location by Id
app.get("/locationid/:id", async (req, res) => {
  res.send(await Location.find({ _id: req.params.id }));
});

// delete an admin
app.delete("/location/:id", async (req, res) => {
  await Location.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Location removed." });
});

// update admin
app.put("/location/:id", async (req, res) => {
  await Location.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Location updated." });
});

//
//Sessions
//
// post a session
app.post("/session", async (req, res) => {
  const newSession = req.body;
  console.log(newSession);
  const session = new Session(newSession);
  await session.save();
  res.send({ message: "New session created." });
});

// get all sessions
app.get("/sessions", async (req, res) => {
  res.send(await Session.find());
});

// get session by sessionLocation
app.get("/sessionlocation/:sessionLocation", async (req, res) => {
  res.send(await Session.find({ sessionLocation: req.params.sessionLocation }));
});

// get session by sessionDate
app.get("/sessiondate/:date", async (req, res) => {
  res.send(await Session.find({ date: req.params.date }));
});

// get session by volunteer
app.get("/sessionvolunteer/:volunteer", async (req, res) => {
  res.send(await Session.find({ volunteer: req.params.volunteer }));
});

// get session by id
app.get("/sessionid/:_id", async (req, res) => {
  res.send(await Session.find({ _id: req.params._id }));
});

// delete a session
app.delete("/session/:id", async (req, res) => {
  await Session.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Session removed." });
});

// update session
app.put("/session/:id", async (req, res) => {
  await Session.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Session updated." });
});

// add session user
app.put("/sessionUser/:id", async (req, res) => {
  const ret = await Session.findOneAndUpdate(
    { _id: ObjectId(req.params.id) },
    { $addToSet: { sessionUsers: req.body.user } },
    { returnOriginal: false }
  );
  res.send({ message: "Session updated.", body: ret });
  // if (sessionUsers.length <= userlimit) {
  //   res.send({ message: "Session updated." });
  // } else {
  //   Session.findOneAndUpdate(
  //     { _id: ObjectId(req.params.id) },
  //     { $pull: { sessionUsers: req.body.user } }
  //   );
  //   res.send({ message: "Cannot update, to many users." });
  // }
});

// remove session user
app.put("/sessionDelUser/:id", async (req, res) => {
  const ret = await Session.findOneAndUpdate(
    { _id: ObjectId(req.params.id) },
    { $pull: { sessionUsers: req.body.user } },
    { returnOriginal: false }
  );
  res.send({ message: "Session updated.", body: ret });
});

//
//User
//

// get all users
app.get("/user", async (req, res) => {
  res.send(await User.find());
});

// get user by userName
app.get("/username/:userName", async (req, res) => {
  res.send(await User.find({ userName: req.params.userName }));
});

// get user by location
app.get("/userlocation/:location", async (req, res) => {
  res.send(await User.find({ location: req.params.location }));
});

// get user by role
app.get("/userrole/:role", async (req, res) => {
  res.send(await User.find({ role: req.params.role }));
});

// get user by nameFirst
app.get("/userfirstname/:nameFirst", async (req, res) => {
  res.send(await User.find({ nameFirst: req.params.nameFirst }));
});

// get user by nameLast
app.get("/userlastname/:nameLast", async (req, res) => {
  res.send(await User.find({ nameLast: req.params.nameLast }));
});

// get user by id
app.get("/userid/:id", async (req, res) => {
  res.send(await User.find({ _id: req.params.id }));
});

// delete an user
app.delete("/user/:id", async (req, res) => {
  await User.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "User removed." });
});

// update user
app.put("/user/:id", async (req, res) => {
  await User.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "User updated." });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

// starting the server
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Database connected!");
});
