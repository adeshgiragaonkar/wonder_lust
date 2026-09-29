const User = require("../models/users.js");

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/form.ejs");
};

module.exports.signupUser = async(req, res)=>{
   try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registredUser = await User.register(newUser, password);
        req.login(registredUser, (err)=>{
            if(err){
                return next(err);
            }
        req.flash("success", "Wel-Come to Wonerlust");
        res.redirect("/listings");
        })     
   }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
   }
};

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs")
};

module.exports.loginUser = (req, res)=>{
    req.flash("success", "Welcome back to wonerlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next)=>{
    req.logOut((err) => {
        if(err){
            next(err);
        }
        req.flash("success", "you logged out");
        res.redirect("/listings");
    });   
};

