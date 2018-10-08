// Require dependencies
const passport = require("passport");
const express = require("express");
const Staff = require("../models/staff");
const router = express.Router();

// Register routes
router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", async (req, res) => {
	// Create staff without password field
	let newStaff = new Staff({username: req.body.username, name: req.body.name, role: req.body.role});
	try {
		// Passport register to create salt and hash
		let createdStaff = await Staff.register(newStaff, req.body.password);
		// Redirect to login once authenticated
 		passport.authenticate("local", { session: false })(req, res, () => {
			res.redirect("/login");
	 });
	} catch(err) {
		// If error redirect back to register page
		console.log(err);
		res.redirect("/register");
	}
});

// Login routes
router.get("/login", (req, res) => {
	res.render("login");
});

// Using passport middleware to authenticate login
router.post("/login", passport.authenticate("local",
  {
  	successRedirect: "/home",
    failureRedirect: "/login"
  }
));

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
