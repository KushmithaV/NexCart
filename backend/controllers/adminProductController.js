const db = require("../config/db");

const { sendProductStatusEmail } = require("../utils/productStatusEmail");
/* =====================================
        GET ALL PENDING PRODUCTS
===================================== */

exports.getPendingProducts = (req, res) => {

const query = `

SELECT

    p.product_id,
    p.product_name,
    p.thumbnail,
    p.price,
    p.final_price,
    p.stock,
    p.status,

    s.shop_name,

    c.category_name,

    b.brand_name

FROM products p

JOIN sellers s
ON p.seller_id = s.seller_id

JOIN categories c
ON p.category_id = c.category_id

JOIN brands b
ON p.brand_id = b.brand_id

WHERE p.status = 'Pending'

ORDER BY p.created_at DESC

`;

    db.query(query, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                message: "Database Error"

            });

        }
if(result.length===0){

    return res.status(404).json({
        message:"Product not found"
    });

}
        res.json(result);

    });

};


/* =====================================
        APPROVE PRODUCT
===================================== */

exports.approveProduct = (req, res) => {

    const productId = req.params.id;


    db.query(

        `
        SELECT 
            p.product_name,
            s.full_name,
            s.email

        FROM products p

        JOIN sellers s
        ON p.seller_id = s.seller_id

        WHERE p.product_id=?
        `,

        [productId],

        (err, result)=>{

            if(err){
                console.log(err);
                return res.status(500).json({
                    message:"Database Error"
                });
            }


            if(result.length===0){

                return res.status(404).json({
                    message:"Product not found"
                });

            }


            const product = {
                product_name: result[0].product_name
            };


            const seller = {
                full_name: result[0].full_name,
                email: result[0].email
            };


            db.query(

                `
                UPDATE products
                SET status='approved'
                WHERE product_id=?
                `,

                [productId],

                (err)=>{

                    if(err){

                        console.log(err);

                        return res.status(500).json({
                            message:"Unable to approve product."
                        });

                    }


                    sendProductStatusEmail(
                        seller,
                        product,
                        "Approved"
                    );


                    res.json({

                        message:"Product Approved Successfully."

                    });


                }

            );


        }

    );


};

/* =====================================
        REJECT PRODUCT
===================================== */
exports.rejectProduct = (req, res) => {

    const productId = req.params.id;


    // Get product + seller details first
    db.query(

        `
        SELECT 
            p.product_name,
            s.full_name,
            s.email

        FROM products p

        JOIN sellers s
        ON p.seller_id = s.seller_id

        WHERE p.product_id=?
        `,

        [productId],

        (err,result)=>{

            if(err){
                return res.status(500).json({
                    message:"Database Error"
                });
            }


            const product = {
                product_name: result[0].product_name
            };


            const seller = {
                full_name: result[0].full_name,
                email: result[0].email
            };


            // Update status
            db.query(

                `
                UPDATE products
                SET status='rejected'
                WHERE product_id=?
                `,

                [productId],

                (err)=>{

                    if(err){
                        return res.status(500).json({
                            message:"Unable to reject product."
                        });
                    }


                    // Send black-orange NexCart mail
                    sendProductStatusEmail(
                        seller,
                        product,
                        "Rejected"
                    );


                    res.json({
                        message:"Product Rejected Successfully."
                    });

                }

            );

        }

    );

};