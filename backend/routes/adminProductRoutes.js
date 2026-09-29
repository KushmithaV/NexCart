const express = require("express");
const router = express.Router();

const adminProductController = require("../controllers/adminProductController");

/* =====================================
        GET PENDING PRODUCTS
===================================== */

router.get(
    "/pending",
    adminProductController.getPendingProducts
);

/* =====================================
        APPROVE PRODUCT
===================================== */

router.put(
    "/approve/:id",
    adminProductController.approveProduct
);

/* =====================================
        REJECT PRODUCT
===================================== */

router.put(
    "/reject/:id",
    adminProductController.rejectProduct
);

module.exports = router;