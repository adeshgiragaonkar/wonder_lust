if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocaleStrategy = require("passport-local");
const User = require("./models/users.js");

const dbURL = process.env.ATLASDB_URL;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//router
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main().then(()=>{
    console.log("connected sucessfully");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
};

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto : {
        secret : SECRET,
    },
    touchAfter : 24 * 3600

});

store.on("error",()=>{
    console.log("ERROR in maogo store");
});

const sessionOptions = {
    store,
    secret : SECRET, 
    resave : false, 
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 *  60 * 60 * 1000,
        maxAge : 7 * 24 *  60 * 60 * 1000,
        httpOnly : true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocaleStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


app.use((req, res, next)=>{
    throw new expressError(404, "page not found");
});

app.use((err, req, res, next)=>{
    let {status=500, message="something went wrong"} = err;
    res.status(status).render("listings/error.ejs", {message});
});

app.listen(8080, (req, res)=>{
    console.log("app is listining on port 8080");
});