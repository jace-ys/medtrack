const express = require("express");
const Staff = require("../models/staff");
const router = express.Router();
//Passport setup
const passport = require("passport");

router.get("/register", (req, res) => {
	res.render("register");
});


router.post("/register", (req, res) => {
	//making a new user (1)
	 var newStaff = new Staff({username : req.body.username});
	 Staff.register(newStaff, req.body.password, function(err,user) {
			 if(err){
					 console.log(err);
					 return res.render("home");
			 }
			 //then loging them in using passport.authenticate (2)
			 passport.authenticate("local", { session: false })(req, res, () => {
				 req.flash("success", "Account created successfully! You can now log in.");
				 res.redirect("/login");
		});
	 }

	 )
});

router.get("/login", (req, res) => {
	res.render("login");
});

//handling login logic
//using middleware to call authenticate method
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/"
    }
    ), function(req,res){
});

//Logout Route
router.get("/logout", (req,res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;
