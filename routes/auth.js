const router = require("express").Router();
const passport = require("passport");

var dotenv =require('dotenv');
const { User } = require("../passport");
dotenv.config();

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/login/failed",
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(process.env.CLIENT_URL);
});
router.get("/authenticated", (req, res) => {
	if (req.isAuthenticated()) {
	  res.send({ picurL: req.user.picurL, name: req.user.name, uniqueId: req.user.uniqueId });
	} else {
	  res.send("unauthorised");
	}
  });

  router.get("/alluser",async(req,res)=>{
      try {
		let data=await User.find();
		if(data){
		res.status(200).send({message:"Get all user sucessful",data})
		}else{
			res.status(400).send({message:"User Data empty"});
		}
	  } catch (error) {
		res.status(500).send({message:`Internal server Error ${error}`})
	  }
  })
module.exports = router;
