const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const usersControllers = require("../controllers/users.js");

router.route("/signup")
.get(usersControllers.renderSignupForm)
.post(wrapAsync(usersControllers.signupUser));

router.route("/login")
.get(usersControllers.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), usersControllers.loginUser);

//logout user
router.get("/logout", usersControllers.logoutUser);

module.exports = router;