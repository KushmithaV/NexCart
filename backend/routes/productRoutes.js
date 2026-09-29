const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const productController = require("../controllers/productController");

/* =====================================
        MULTER CONFIGURATION
===================================== */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, "../uploads"));

    },

    filename: (req, file, cb) => {

        const fileName =
            Date.now() + path.extname(file.originalname);

        cb(null, fileName);

    }

});

const upload = multer({

    storage: storage,

    fileFilter: (req, file, cb) => {

        const allowedTypes = /jpeg|jpg|png|webp/;

        const ext = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mime = allowedTypes.test(file.mimetype);

        if (ext && mime) {

            cb(null, true);

        } else {

            cb(new Error("Only JPG, PNG and WEBP images are allowed."));

        }

    }

});

/* =====================================
        GET ALL PRODUCTS
===================================== */

router.get(
    "/",
    productController.getAllProducts
);


/* =====================================
        GET PRODUCTS BY CATEGORY
===================================== */

router.get(
    "/category/:id",
    productController.getProductsByCategory
);


/* =====================================
        GET SELLER PRODUCTS
===================================== */

router.get(
    "/seller/:sellerId",
    productController.getSellerProducts
);


/* =====================================
        GET SINGLE PRODUCT
===================================== */

router.get(
    "/:id",
    productController.getProductById
);

/* =====================================
        ADD PRODUCT
===================================== */

router.post(
    "/add",
    upload.single("product_image"),
    productController.addProduct
);

/* =====================================
        UPDATE PRODUCT
===================================== */

router.put(
    "/update/:id",
    productController.updateProduct
);

/* =====================================
        DELETE PRODUCT
===================================== */

router.delete(
    "/delete/:id",
    productController.deleteProduct
);

module.exports = router;