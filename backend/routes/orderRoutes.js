const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

const {

    placeOrder,
    getAdminOrders,
    getCustomerOrders,
    confirmOrder,
    cancelOrder,

    getAdminNotifications,
    getSellerNotifications,

    getAdminNotificationHistory,
    markAdminNotificationsRead,

    getSellerNotificationHistory,
    markSellerNotificationsRead

} = require("../controllers/orderController");



router.post("/place", placeOrder);


router.get("/admin", getAdminOrders);
router.get("/customer/:id", getCustomerOrders);

router.get("/seller/:id", orderController.getSellerOrders);
router.get(
"/seller-revenue/:id",
orderController.getSellerRevenue
);


router.get(
"/seller-orders-count/:id",
orderController.getSellerOrdersCount
);

router.put("/confirm/:id", confirmOrder);


router.put("/cancel/:id", cancelOrder);
router.put(
    "/dispatch/:id",
    orderController.dispatchOrder
);


router.put(
    "/deliver/:id",
    orderController.deliverOrder
);


router.get(
    "/admin-notifications",
    getAdminNotifications
);

router.get(
    "/seller-notifications/:id",
    getSellerNotifications
);
router.get(
    "/admin-notification-history",
    getAdminNotificationHistory
);

router.put(
    "/admin-notifications/read",
    markAdminNotificationsRead
);
router.get(
    "/seller-notification-history/:id",
    getSellerNotificationHistory
);

router.put(
    "/seller-notifications/read/:id",
    markSellerNotificationsRead
);

module.exports = router;