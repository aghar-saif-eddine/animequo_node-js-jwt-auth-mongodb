const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
var session = require('express-session');
require('dotenv').config();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//int the session 
app.use(session({secret:process.env.SECRET_SESSION,secret: 'keyboard cat',
resave: false,
saveUninitialized: true,
cookie: { secure: true }}));

const db = require("./app/models");
const Role = db.role;


db.mongoose
  .connect(`${dbConfig.DB_CONNECT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
// simple route
app.get("/", (req, res) => {
  res.redirect('/api/v1.0/');
});


// simple route
app.get("/api/v1.0/", (req, res) => {
  res.json({ message: "Welcome to AnimeQuo API ! " });
});

app.get('/', function(req, res) {
  // res.send('Page under construction.');
  res.json({success: true, msg: 'Page under construction.'});
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
