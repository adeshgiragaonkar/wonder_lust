const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin, isOwner, validateSchema} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin, upload.single('listing[image]'), validateSchema, wrapAsync(listingController.createListing));


//create new listing route
router.get("/new", isLoggedin,  listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedin, isOwner,upload.single('listing[image]'),  validateSchema, wrapAsync(listingController.editListing))
.delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;