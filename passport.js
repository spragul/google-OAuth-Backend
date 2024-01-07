const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const { v4: uuidV4 } = require("uuid");
const dotenv =require('dotenv');

dotenv.config();


mongoose.connect(process.env.URL);

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	googleId: String,
	picurL: String,
	name: String,
	uniqueId: String,
  });
  userSchema.plugin(findOrCreate);
  
  const User = new mongoose.model("User", userSchema);
  module.exports = { User };
require('dotenv').config()
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "https://google-oauth-i6qb.onrender.com/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, cb) {
			User.findOrCreate(
				{
				  googleId: profile.id,
				},
				{
				  name: profile.displayName,
				  picurL: profile.photos[0].value,
				  uniqueId: uuidV4(),
				},
				function () {
				  return cb(null, profile);
				}
			  );
			//callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
