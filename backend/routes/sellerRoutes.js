const express = require("express");

const router = express.Router();

const sellerController =
require("../controllers/sellerController");

router.post(

    "/register",

    sellerController.registerSeller

);


module.exports = router;



const {
    registerSeller,
    loginSeller,
    getSellerProfile,
    updateSellerProfile

} = require("../controllers/sellerController");





/* =====================================
        SELLER ROUTES
===================================== */



// Seller Registration
router.post(
    "/register",
    registerSeller
);



// Seller Login
router.post(
    "/login",
    loginSeller
);



// Get Seller Profile
router.get(
    "/profile/:id",
    getSellerProfile
);



// Update Seller Profile
router.put(
    "/profile/:id",
    updateSellerProfile
);

router.get(
"/dashboard/:id",
sellerController.getSellerDashboardStats
);


module.exports = router;