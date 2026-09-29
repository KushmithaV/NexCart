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

router.put(
    "/update/:id",
    customerController.updateCustomer
);
module.exports = router;