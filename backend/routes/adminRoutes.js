const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

/* =====================================
        ADMIN LOGIN
===================================== */

router.post(
    "/login",
    adminController.loginAdmin
);

/* =====================================
        ADMIN DASHBOARD
===================================== */

router.get(
    "/dashboard",
    adminController.getDashboard
);

/* =====================================
        PENDING SELLERS
===================================== */

router.get(
    "/pending-sellers",
    adminController.getPendingSellers
);

/* =====================================
        UPDATE SELLER STATUS
===================================== */

router.put(
    "/update-seller",
    adminController.updateSellerStatus
);
router.get(
"/customers",
adminController.getAllCustomers
);


router.get("/sellers", adminController.getAllSellers);


router.get(
"/products",
adminController.getApprovedProducts
);


router.get(
"/orders",
adminController.getAllOrders
);

module.exports = router;