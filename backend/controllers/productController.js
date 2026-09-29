const db = require("../config/db");


/* =====================================
        GET ALL APPROVED PRODUCTS
===================================== */

exports.getAllProducts = (req, res) => {

    const query = `

        SELECT

        
    p.product_id,
    p.seller_id,
    p.product_name,
            p.description,
            p.price,
            p.discount,
            p.final_price,
            p.stock,
            p.status,
            p.thumbnail,

            b.brand_name,

            s.shop_name

        FROM products p

        JOIN brands b
        ON p.brand_id = b.brand_id

        JOIN sellers s
        ON p.seller_id = s.seller_id

        WHERE p.status='approved'

        ORDER BY p.created_at DESC

    `;


    db.query(query, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                message: "Database Error"

            });

        }


        res.status(200).json(result);

    });

};



/* =====================================
        ADD PRODUCT
===================================== */
exports.addProduct = (req, res) => {


    const {

        seller_id,
        category_id,
        brand_id,
        custom_brand,
        product_name,
        description,
        price,
        discount,
        stock,
        sku

    } = req.body;



    let thumbnail = null;


    if(req.file){

        thumbnail = "/uploads/" + req.file.filename;

    }



    if(

        !seller_id ||
        !category_id ||
        !product_name ||
        !description ||
        !price ||
        !stock

    ){

        return res.status(400).json({

            message:"Please fill all required fields."

        });

    }




    // ===================================
    // HANDLE CUSTOM BRAND
    // ===================================


    const insertProduct = (finalBrandId)=>{


        const query = `

        INSERT INTO products(

            seller_id,
            category_id,
            brand_id,
            thumbnail,
            product_name,
            description,
            price,
            discount,
            stock,
            sku,
            status

        )

        VALUES(?,?,?,?,?,?,?,?,?,?,?)

        `;



        db.query(

            query,

            [

                seller_id,
                category_id,
                finalBrandId,
                thumbnail,
                product_name,
                description,
                price,
                discount || 0,
                stock,
                sku,
                "pending"

            ],


            (err,result)=>{


                if(err){

                    console.log(err);

                    return res.status(500).json({

                        message:"Unable to add product.",
                        error:err.sqlMessage

                    });

                }



                // Activity

                db.query(

                    `
                    INSERT INTO activities
                    (
                        seller_id,
                        activity_message,
                        activity_type
                    )

                    VALUES(?,?,?)

                    `,

                    [

                        seller_id,
                        `New product "${product_name}" added`,
                        "PRODUCT"

                    ]

                );



                res.status(201).json({

                    message:
                    "Product Added Successfully. Waiting for Admin Approval."

                });


            }


        );


    };





    // ===================================
    // CUSTOM BRAND EXISTS
    // ===================================


if (custom_brand && custom_brand.trim() !== "") {

    db.query(
        "SELECT brand_id FROM brands WHERE brand_name = ? AND category_id = ?",
        [custom_brand.trim(), category_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            // Brand already exists
            if (result.length > 0) {

                insertProduct(result[0].brand_id);

            } else {

                // Create new brand
                db.query(
                    `INSERT INTO brands(category_id, brand_name)
                     VALUES(?, ?)`,
                    [category_id, custom_brand.trim()],
                    (err, insertResult) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Unable to create brand"
                            });
                        }

                        insertProduct(insertResult.insertId);

                    }
                );

            }

        }
    );

}

    else{


        if(!brand_id){

            return res.status(400).json({

                message:"Please select brand."

            });

        }


        insertProduct(brand_id);


    }



};




/* =====================================
    GET PRODUCTS BY CATEGORY
===================================== */


exports.getProductsByCategory = (req, res) => {


    const categoryId = req.params.id;



    const query = `


        SELECT


           

    p.product_id,
    p.seller_id,
    p.product_name,
            p.description,
            p.price,
            p.discount,
            p.final_price,
            p.stock,
            p.thumbnail,


            b.brand_name,


            s.shop_name



        FROM products p


        JOIN brands b
        ON p.brand_id = b.brand_id


        JOIN sellers s
        ON p.seller_id = s.seller_id



        WHERE

            p.category_id = ?

            AND p.status='approved'



        ORDER BY p.created_at DESC



    `;



    db.query(

        query,

        [categoryId],


        (err, result)=>{


            if(err){


                console.log(err);


                return res.status(500).json({

                    message:"Database Error"

                });


            }


            res.status(200).json(result);


        }


    );


};




/* =====================================
        GET SELLER PRODUCTS
===================================== */


exports.getSellerProducts = (req,res)=>{


    const sellerId = req.params.sellerId;



    const query = `


        SELECT



    p.product_id,
    p.seller_id,
    p.product_name,
            p.description,
            p.price,
            p.discount,
            p.final_price,
            p.stock,
            p.status,
            p.thumbnail,


            b.brand_name,


            c.category_name



        FROM products p



        JOIN brands b
        ON p.brand_id=b.brand_id



        JOIN categories c
        ON p.category_id=c.category_id



        WHERE p.seller_id=? 



        ORDER BY p.created_at DESC



    `;



    db.query(query,[sellerId],(err,result)=>{


        if(err){


            console.log(err);


            return res.status(500).json({

                message:"Database Error"

            });


        }


        res.json(result);


    });


};



/* =====================================
        UPDATE PRODUCT
===================================== */

exports.updateProduct = (req, res) => {

    const productId = req.params.id;

    const {
        product_name,
        description,
        price,
        discount,
        stock
    } = req.body;


    // Get seller_id and old product name
    db.query(

        "SELECT seller_id, product_name FROM products WHERE product_id=?",

        [productId],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }

            const seller_id = result[0].seller_id;

            const query = `

                UPDATE products

                SET
                    product_name=?,
                    description=?,
                    price=?,
                    discount=?,
                    stock=?

                WHERE product_id=?

            `;

            db.query(

                query,

                [
                    product_name,
                    description,
                    price,
                    discount,
                    stock,
                    productId
                ],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message: "Unable to update product."
                        });

                    }

                    // Add Recent Activity
                    db.query(

                        `INSERT INTO activities
                        (
                            seller_id,
                            activity_message,
                            activity_type
                        )
                        VALUES (?,?,?)`,

                        [
                            seller_id,
                            `Product "${product_name}" updated`,
                            "PRODUCT"
                        ]

                    );

                    res.json({

                        message: "Product Updated Successfully"

                    });

                }

            );

        }

    );

};






/* =====================================
        DELETE PRODUCT
===================================== */

exports.deleteProduct = (req, res) => {

    const productId = req.params.id;


    // Get seller_id and product name before deleting
    db.query(

        "SELECT seller_id, product_name FROM products WHERE product_id=?",

        [productId],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }

            const seller_id = result[0].seller_id;
            const product_name = result[0].product_name;


            db.query(

                "DELETE FROM products WHERE product_id=?",

                [productId],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({

                            message: "Unable to delete product."

                        });

                    }


                    // Add Recent Activity
                    db.query(

                        `INSERT INTO activities
                        (
                            seller_id,
                            activity_message,
                            activity_type
                        )
                        VALUES (?,?,?)`,

                        [
                            seller_id,
                            `Product "${product_name}" deleted`,
                            "PRODUCT"
                        ]

                    );


                    res.json({

                        message: "Product Deleted Successfully"

                    });

                }

            );

        }

    );

};
exports.getProductById = (req,res)=>{

    const id = req.params.id;

    const query = `
    SELECT 

    p.product_id,
    p.seller_id,
    p.product_name,
    p.description,
    p.price,
    p.discount,
    p.final_price,
    p.thumbnail,
    c.category_name

    FROM products p

    LEFT JOIN categories c
    ON p.category_id = c.category_id

    WHERE p.product_id = ?
    `;


    db.query(query,[id],(err,result)=>{

        if(err){
            console.log(err);
            return res.status(500).json({
                message:"Database error"
            });
        }


        if(result.length===0){

            return res.status(404).json({
                message:"Product not found"
            });

        }


        res.json(result[0]);

    });

};