const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOptions = {
    secret : "mysupersecretstring", 
    resave : false, 
    saveUninitialized : true
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.successmsg = req.flash("sucess");
    res.locals.errormsg = req.flash("error");
    next();
})

app.get("/register", (req, res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    if(name == "anonymous"){
        req.flash("error", "use not registraed1");
    }else{
        req.flash("sucess", "ragistration sucessfull!");
    }
    res.redirect("/greet");
});

app.get("/greet", (req, res)=>{
   res.render("page.ejs", {name : req.session.name});
});

app.use("/users", users);
app.use("/posts", posts);

// app.get("/test", (req, res)=>{
//     res.send("test succesfult");
// })

app.get("/requestCount", (req, res) =>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`you requeted ${req.session.count}times`);
})


app.listen(3000, (req, res)=>{
    console.log("app listining to 3000");
});
