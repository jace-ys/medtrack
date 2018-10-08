const passport = require("passport");
const express = require("express");
const Staff = require("../models/staff");
const router = express.Router();

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", async (req, res) => {
	let newStaff = new Staff({username: req.body.username, name: req.body.name, role: req.body.role});
	try {
		let createdStaff = await Staff.register(newStaff, req.body.password);
 		passport.authenticate("local", { session: false })(req, res, () => {
			res.redirect("/login");
	 });
	} catch(err) {
		console.log(err);
		res.redirect("/register");
	}
});

router.get("/login", (req, res) => {
	res.render("login");
});

// Handling login logic
// Using middleware to call authenticate method
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
