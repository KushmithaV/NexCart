const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("./config/db");

const app = express();

/* =====================================
        MIDDLEWARE
===================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* =====================================
        STATIC FOLDERS
===================================== */

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================
        ROUTES
===================================== */

const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const activityRoutes = require("./routes/activityRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");

app.use("/api/orders", orderRoutes);

app.use("/api/activity", activityRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/seller", sellerRoutes);

app.use("/api/admin/products", adminProductRoutes);

app.use("/api/products", productRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
/* =====================================
        HOME PAGE
===================================== */

app.get("/", (req, res) => {

    res.sendFile(

        path.join(

            __dirname,

            "../frontend/pages/index.html"

        )

    );

});

/* =====================================
        START SERVER
===================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});