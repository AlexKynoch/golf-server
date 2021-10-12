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
const { v4: uuidv4 } = require("uuid");
var ObjectId = require("mongodb").ObjectId;

// const adminMiddleware = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const admin = await Admin.findOne({ token: authHeader });
//   if (admin) {
//     next(); //successfully passed gatekeeper
//   } else {
//     res.sendStatus(403);
//   }
// };

// const userMiddleware = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const user = await User.findOne({ token: authHeader });
//   if (user) {
//     next(); //successfully passed gatekeeper
//   } else {
//     res.sendStatus(403);
//   }
// };

const eitherMiddleware = async (req, res, next) => {
  next();
  return;
  const authHeader = req.headers["authorization"];
  try {
    if (!ObjectId.isValid(authHeader)) {
      throw new Error("authHeader invalid");
      return;
    }
    const admin = await Admin.findOne({ token: authHeader });
    const user = await User.findOne({ token: authHeader });
    if (admin || user) {
      next(); //successfully passed gatekeeper
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(401).send({ message: error.message, name: error.name });
  }
};

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
  // tokens = ObjectId();
  if (
    !req.body.userName ||
    !req.body.password ||
    !req.body.email ||
    !req.body.location ||
    !req.body.nameFirst
  ) {
    return res.sendStatus(400).send("missing required parameter");
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
    // token: tokens,
  });
  user.save();
  res.send({ message: "New User Created" });
});

// add new admin
app.post("/admin", async (req, res) => {
  // tokens = ObjectId();
  if (
    !req.body.userName ||
    !req.body.password ||
    !req.body.email ||
    !req.body.nameFirst
  ) {
    return res.sendStatus(400).send("missing required parameter");
  }
  if (!req.body.location && req.body.role === CGA) {
    return res.sendStatus(400).send("If Role is CGA then location is required");
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
    // token: tokens,
  });
  admin.save();
  res.send({ message: "New Admin Created" });
});

// authorisation
app.post("/userauth", async (req, res) => {
  const user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    console.log("no user");
    return res.sendStatus(401).send("incorrect username field");
  }
  if (req.body.password !== user.password) {
    return res.sendStatus(403).send("incorect username or password");
  }
  user.token = uuidv4();
  await user.save();
  res.send({ user });
});

// authorisation
app.post("/adminauth", async (req, res) => {
  const admin = await Admin.findOne({ userName: req.body.userName });
  if (!admin) {
    console.log("no user");
    return res.sendStatus(401).send("missing username field");
  }
  if (req.body.password !== admin.password) {
    return res.sendStatus(403).send("incorect username or password");
  }
  admin.token = uuidv4();
  await admin.save();
  res.send({ admin });
});

//
//Admin
//

// get all admin
app.get("/admin", eitherMiddleware, async (req, res) => {
  res.send(await Admin.find());
});

// get admin by userName
app.get("/adminname/:userName", eitherMiddleware, async (req, res) => {
  res.send(await Admin.findOne({ userName: req.params.userName }));
});

// get admin by location
app.get("/adminlocation/:location", eitherMiddleware, async (req, res) => {
  res.send(await Admin.find({ location: req.params.location }));
});

// get CGA by location
app.get("/cgalocation/:location", eitherMiddleware, async (req, res) => {
  res.send(await Admin.findOne({ location: req.params.location, role: "CGA" }));
});

// get admin by role
app.get("/adminrole/:role", eitherMiddleware, async (req, res) => {
  res.send(await Admin.find({ role: req.params.role }));
});

// get admin by nameFirst
app.get("/adminfirstname/:nameFirst", eitherMiddleware, async (req, res) => {
  res.send(await Admin.find({ nameFirst: req.params.nameFirst }));
});

// get admin by nameLast
app.get("/adminlastname/:nameLast", eitherMiddleware, async (req, res) => {
  res.send(await Admin.find({ nameLast: req.params.nameLast }));
});

// get admin by id
app.get("/adminid/:id", eitherMiddleware, async (req, res) => {
  res.send(await Admin.findOne({ _id: req.params.id }));
});

// delete an admin
app.delete("/admin/:id", eitherMiddleware, async (req, res) => {
  await Admin.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Admin removed." });
});

// update admin
app.put("/admin/:id", eitherMiddleware, async (req, res) => {
  await Admin.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Admin updated." });
});

//
//Locations
//
//create location

app.post("/location", eitherMiddleware, async (req, res) => {
  if (!req.body.locationName || !req.body.manager) {
    return res.sendStatus(400).send("missing required parameter");
  }
  const location = new Location({
    locationName: req.body.locationName,
    activeCGA: req.body.activeCGA,
    activeUsers: req.body.activeUsers,
    activeVolunteer: req.body.activeVolunteer,
    manager: req.body.manager,
    details: req.body.details,
  });
  location.save();
  res.send({ message: "Created New Location" });
});

// get all locations
app.get("/location", eitherMiddleware, async (req, res) => {
  res.send(await Location.find());
});

// get location by name
app.get("/locationname/:locationName", eitherMiddleware, async (req, res) => {
  res.send(await Location.findOne({ locationName: req.params.locationName }));
});

// get location by user
app.get("/locationuser/:activeUsers", eitherMiddleware, async (req, res) => {
  res.send(await Location.find({ activeUsers: req.params.activeUsers }));
});

// get location by Volunteer
app.get(
  "/locationvolunteer/:activeVolunteer",
  eitherMiddleware,
  async (req, res) => {
    res.send(
      await Location.find({ activeVolunteer: req.params.activeVolunteer })
    );
  }
);

// get location by CGA
app.get("/locationcga/:activeCGA", eitherMiddleware, async (req, res) => {
  res.send(await Location.find({ activeCGA: req.params.activeCGA }));
});

// get location by Id
app.get("/locationid/:id", eitherMiddleware, async (req, res) => {
  res.send(await Location.findOne({ _id: req.params.id }));
});

// delete a location
app.delete("/location/:id", eitherMiddleware, async (req, res) => {
  await Location.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Location removed." });
});

// update location
app.put("/location/:id", eitherMiddleware, async (req, res) => {
  await Location.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Location updated." });
});

//
//Sessions
//

app.post("/session", eitherMiddleware, async (req, res) => {
  if (
    !req.body.date ||
    !req.body.volunteer ||
    !req.body.sessionLocation ||
    !req.body.sessionTimeStart ||
    !req.body.sessionTimeFinish ||
    !req.body.userLimit
  ) {
    return res.sendStatus(400).send("missing required parameter");
  }

  const session = new Session({
    date: req.body.date,
    volunteer: req.body.volunteer,
    sessionUsers: req.body.sessionUsers,
    sessionLocation: req.body.sessionLocation,
    sessionTimeStart: req.body.sessionTimeStart,
    sessionTimeFinish: req.body.sessionTimeFinish,
    userLimit: req.body.userLimit,
    details: req.body.details,
  });
  session.save();
  res.send({ Message: "created new Session" });
});

// get all sessions
app.get("/sessions", eitherMiddleware, async (req, res) => {
  res.send(await Session.find());
});

// get session by sessionLocation
app.get(
  "/sessionlocation/:sessionLocation",
  eitherMiddleware,
  async (req, res) => {
    res.send(
      await Session.find({ sessionLocation: req.params.sessionLocation })
    );
  }
);

// get session by sessionDate
app.get("/sessiondate/:date", eitherMiddleware, async (req, res) => {
  res.send(await Session.find({ date: req.params.date }));
});

// get session by volunteer
app.get("/sessionvolunteer/:volunteer", eitherMiddleware, async (req, res) => {
  res.send(await Session.find({ volunteer: req.params.volunteer }));
});

// get session by id
app.get("/sessionid/:_id", eitherMiddleware, async (req, res) => {
  res.send(await Session.findOne({ _id: req.params._id }));
});

// delete a session
app.delete("/session/:id", eitherMiddleware, async (req, res) => {
  await Session.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Session removed." });
});

// update session
app.put("/session/:id", eitherMiddleware, async (req, res) => {
  await Session.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Session updated." });
});

// add session user
app.put("/sessionUser/:id", eitherMiddleware, async (req, res) => {
  const prev = await Session.findOne({ _id: ObjectId(req.params.id) });
  // res.send(prev);
  if (prev.sessionUsers.length >= prev.userLimit) {
    return res.send({ message: "Cannot update, to many users." });
  }
  const ret = await Session.findOneAndUpdate(
    { _id: ObjectId(req.params.id) },
    { $addToSet: { sessionUsers: req.body.user } },
    { returnOriginal: false }
  );
  res.send({ message: "Session updated.", body: ret });
});

// remove session user
app.put("/sessionDelUser/:id", eitherMiddleware, async (req, res) => {
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
app.get("/user", eitherMiddleware, async (req, res) => {
  res.send(await User.find());
});

// get user by userName
app.get("/username/:userName", eitherMiddleware, async (req, res) => {
  res.send(await User.findOne({ userName: req.params.userName }));
});

// get user by location
app.get("/userlocation/:location", eitherMiddleware, async (req, res) => {
  res.send(await User.find({ location: req.params.location }));
});

// get user by role
app.get("/userrole/:role", eitherMiddleware, async (req, res) => {
  res.send(await User.find({ role: req.params.role }));
});

// get user by nameFirst
app.get("/userfirstname/:nameFirst", eitherMiddleware, async (req, res) => {
  res.send(await User.find({ nameFirst: req.params.nameFirst }));
});

// get user by nameLast
app.get("/userlastname/:nameLast", eitherMiddleware, async (req, res) => {
  res.send(await User.find({ nameLast: req.params.nameLast }));
});

// get user by id
app.get("/userid/:id", eitherMiddleware, async (req, res) => {
  res.send(await User.findOne({ _id: req.params.id }));
});

// delete an user
app.delete("/user/:id", eitherMiddleware, async (req, res) => {
  await User.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "User removed." });
});

// update user
app.put("/user/:id", eitherMiddleware, async (req, res) => {
  console.log(req.body, req.params.id);
  const ret = await User.findOneAndUpdate(
    { _id: ObjectId(req.params.id) },
    req.body,

    { returnOriginal: false }
  );

  res.send({
    message: "User updated.",
    body: ret,
  });
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
