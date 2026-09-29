const express = require("express");

const router = express.Router();

const customerController = require("../controllers/customerController");

router.get(
    "/profile/:id",
    customerController.getCustomerProfile
);

router.put(
    "/profile/:id",
    customerController.updateCustomerProfile
);
router.post(
    "/register",
    customerController.registerCustomer
);


router.post(
    "/login",
    customerController.loginCustomer
);


module.exports = router;