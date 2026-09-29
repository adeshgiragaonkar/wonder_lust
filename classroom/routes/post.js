const express = require("express");
const router = express.Router();

//post
//index
router.get("/", (req, res)=>{
    res.send("GET for posts");
});

//show
router.get("/:id", (req, res)=>{
    res.send("Show for posts");
});

//post
router.post("/", (req, res)=>{
    res.send("POST for posts");
});

//delete
router.get("/:id", (req, res)=>{
    res.send("DELETE for posts");
});


module.exports = router;