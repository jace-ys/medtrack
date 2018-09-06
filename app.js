// Require dependencies
const path = require("path");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

// General setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(flash());

// Routes
app.get("/", (req, res) => {
	res.render("home");
});

app.get("*", (req, res) => {
	res.redirect("/");
});

// Define port and listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
