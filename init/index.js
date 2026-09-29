const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Listing = require("../models/listings");
let  initData = require("./data");

main().then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
};

const addData = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : '6ab079b23fe87cb8706ea1e5'}));
    await Listing.insertMany(initData.data);
    console.log("databased initilized");
};

addData();
