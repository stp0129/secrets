//jshint esversion:6
require("dotenv").config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

///////////////////// database connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true
  });
}

// user schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String

});

// encrytption code

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});


// user model
const User = mongoose.model("User", userSchema);




app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({
    email: userName
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.send("username or password incorrect");
        }
      } else {
        res.send("username or password incorrect");
      }
    }
  });
});




app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
    }
  });
});



app.get("/submit", function(req, res) {
  res.render("submit");
});






app.listen(3000, function() {
  console.log("connected on port 3000");
});
