const sendMail = require("../utils/mailer");
const db = require("../config/db");
const jwt = require("jsonwebtoken");

/* =====================================
            ADMIN LOGIN
===================================== */

exports.loginAdmin = (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            message: "Please enter username and password."
        });

    }

    db.query(

        "SELECT * FROM admin WHERE username=?",

        [username],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Admin not found"
                });

            }

            const admin = result[0];

            if (admin.password !== password) {

                return res.status(401).json({
                    message: "Invalid password"
                });

            }

            const token = jwt.sign(

                {
                    id: admin.admin_id,
                    role: "admin"
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1d"
                }

            );

            res.status(200).json({

                message: "Login Successful",

                token,

                admin: {

                    admin_id: admin.admin_id,

                    username: admin.username,

                    full_name: admin.full_name

                }

            });

        }

    );

};



/* =====================================
        ADMIN DASHBOARD
===================================== */

exports.getDashboard = (req, res) => {

    const dashboard = {};

    db.query(

        "SELECT COUNT(*) AS totalSellers FROM sellers",

        (err, sellers) => {

            if (err) return res.status(500).json(err);

            dashboard.totalSellers = sellers[0].totalSellers;

            db.query(

                "SELECT COUNT(*) AS totalProducts FROM products",

                (err, products) => {

                    if (err) return res.status(500).json(err);

                    dashboard.totalProducts = products[0].totalProducts;

                    db.query(

                        "SELECT COUNT(*) AS totalCustomers FROM customers",

                        (err, customers) => {

                            if (err) return res.status(500).json(err);

                            dashboard.totalCustomers = customers[0].totalCustomers;

                            db.query(

                                "SELECT COUNT(*) AS totalOrders FROM orders",

                                (err, orders) => {

                                    if (err) return res.status(500).json(err);

                                    dashboard.totalOrders = orders[0].totalOrders;
                                    db.query(

    "SELECT SUM(total_amount) AS totalRevenue FROM orders WHERE payment_status='success'",

    (err, revenue) => {

        if (err) return res.status(500).json(err);

        dashboard.totalRevenue = revenue[0].totalRevenue || 0;
        });

                                    db.query(

                                        `SELECT
                                            full_name,
                                            shop_name,
                                            status
                                        FROM sellers
                                        ORDER BY seller_id DESC
                                        LIMIT 5`,

                                        (err, sellersList) => {

                                            if (err)
                                                return res.status(500).json(err);

                                            dashboard.recentSellers =
                                                sellersList;

                                            res.json(dashboard);

                                        }

                                    );

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};

/* =====================================
        GET PENDING SELLERS
===================================== */

exports.getPendingSellers = (req, res) => {

    const query = `

        SELECT

            seller_id,
            full_name,
            shop_name,
            email,
            phone,
            city,
            status

        FROM sellers

        WHERE status = 'Pending'

        ORDER BY created_at DESC

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
        UPDATE SELLER STATUS
===================================== */

exports.updateSellerStatus = (req, res) => {

    const { seller_id, status } = req.body;

    if (!seller_id || !status) {
        return res.status(400).json({
            message: "Missing Data"
        });
    }

    db.query(
        "SELECT full_name, email FROM sellers WHERE seller_id=?",
        [seller_id],

        async (err, sellerResult) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

   
            if (sellerResult.length === 0) {
    return res.status(404).json({
        message: "Seller not found"
    });
}
const seller = sellerResult[0];

            const query = `
                UPDATE sellers
                SET status=?
                WHERE seller_id=?
            `;

            db.query(
                query,
                [status, seller_id],

                async (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Database Error"
                        });
                    }

                   

let subject = "";
let message = "";

if (status === "Approved") {

    subject = "Your NexCart Seller Account Has Been Approved 🎉";

    message = `
        <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 18px rgba(0,0,0,.12);">

<div style="background:#111;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ff7300;font-size:34px;">🛒 NexCart</h1>
<p style="margin-top:8px;color:white;">Premium Multi-Vendor Marketplace</p>
</div>

<div style="padding:35px;color:#333;">

<h2 style="color:#ff7300;">Seller Account Approved 🎉</h2>

<p>Hello <b>${seller.full_name}</b>,</p>

<p>Congratulations! Your seller account has been approved.</p>

<div style="background:#fff7f0;border-left:5px solid #ff7300;padding:20px;margin:25px 0;border-radius:8px;">

<p style="margin:0;color:#555;line-height:1.7;">
You can now log in to your seller dashboard and start listing your products on NexCart.
</p>

</div>

<div style="text-align:center;margin-top:30px;">

<a href="http://localhost:3000/"
style="
background:#ff7300;
color:white;
text-decoration:none;
padding:14px 32px;
border-radius:6px;
font-weight:bold;
display:inline-block;
">
Go to NexCart
</a>

</div>

<p style="margin-top:35px;">
We're excited to have you as part of the NexCart seller community.
</p>

<p>
Regards,<br>
<b>Team NexCart</b>
</p>

</div>

<div style="background:#111;padding:20px;text-align:center;">
<p style="color:white;">📧 nexcart.service@gmail.com</p>
<p style="color:#999;font-size:12px;">© 2026 NexCart. All Rights Reserved.</p>
</div>

</div>

</body>
</html>
    `;

}
else if (status === "Rejected") {

    subject = "NexCart Seller Registration Update ⚠️";

    message = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 18px rgba(0,0,0,.12);">

<div style="background:#111;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ff7300;font-size:34px;">🛒 NexCart</h1>
<p style="margin-top:8px;color:white;">Premium Multi-Vendor Marketplace</p>
</div>

<div style="padding:35px;color:#333;">

<h2 style="color:#ff7300;">Seller Account Rejected ⚠️</h2>

<p>Hello <b>${seller.full_name}</b>,</p>

<p>Thank you for your interest in becoming a seller on NexCart.</p>

<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
border-radius:8px;
">

<p style="margin:0;color:#555;line-height:1.7;">
After reviewing your application, we're unable to approve your seller account at this time.
If you believe this was a mistake or require further clarification, please contact the NexCart support team.
</p>

</div>
<div style="text-align:center;margin-top:30px;">

<a href="http://localhost:3000/"
style="
background:#ff7300;
color:white;
text-decoration:none;
padding:14px 32px;
border-radius:6px;
font-weight:bold;
display:inline-block;
">
Go to NexCart
</a>

</div>
<p>
Regards,<br>
<b>Team NexCart</b>
</p>

</div>

<div style="background:#111;padding:20px;text-align:center;">
<p style="color:white;">📧 nexcart.service@gmail.com</p>
<p style="color:#999;font-size:12px;">© 2026 NexCart. All Rights Reserved.</p>
</div>

</div>

</body>
</html>
`;

}
else if (status === "Blocked") {

    subject = "Your NexCart Seller Account Has Been Blocked 🚫";

    message = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 18px rgba(0,0,0,.12);">

<div style="background:#111;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ff7300;font-size:34px;">🛒 NexCart</h1>
<p style="margin-top:8px;color:white;">Premium Multi-Vendor Marketplace</p>
</div>

<div style="padding:35px;color:#333;">

<h2 style="color:#ff7300;">Seller Account Blocked 🚫</h2>

<p>Hello <b>${seller.full_name}</b>,</p>

<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
border-radius:8px;
">

<p style="margin:0;color:#555;line-height:1.7;">
Your NexCart seller account has been blocked. If you believe this action was taken in error or need further assistance, please contact the NexCart support team.
</p>

</div>
<div style="text-align:center;margin-top:30px;">

<a href="http://localhost:3000/"
style="
background:#ff7300;
color:white;
text-decoration:none;
padding:14px 32px;
border-radius:6px;
font-weight:bold;
display:inline-block;
">
Go to NexCart
</a>

</div>
<p>
Regards,<br>
<b>Team NexCart</b>
</p>

</div>

<div style="background:#111;padding:20px;text-align:center;">
<p style="color:white;">📧 nexcart.service@gmail.com</p>
<p style="color:#999;font-size:12px;">© 2026 NexCart. All Rights Reserved.</p>
</div>

</div>

</body>
</html>
`;

}

                    try {

                        await sendMail(
                            seller.email,
                            subject,
                            message
                        );

                    } catch (mailErr) {

                        console.log(mailErr);

                    }

                    res.status(200).json({
                        message: `Seller ${status} Successfully`
                    });

                }

            );

        }

    );

};
/* =====================================
        GET ALL CUSTOMERS
===================================== */

exports.getAllCustomers = (req,res)=>{

    const query = `
        SELECT
            customer_id,
            full_name,
            email,
            phone,
            created_at
        FROM customers
        ORDER BY customer_id DESC
    `;


    db.query(query,(err,result)=>{

        if(err){
            return res.status(500).json({
                message:"Database Error"
            });
        }


        res.json(result);

    });

};
/* =====================================
        GET APPROVED SELLERS
===================================== */

exports.getApprovedSellers = (req,res)=>{


    const query = `

        SELECT
            seller_id,
            full_name,
            shop_name,
            email,
            phone,
            city,
            status

        FROM sellers

        WHERE status='Approved'

        ORDER BY seller_id DESC

    `;


    db.query(query,(err,result)=>{


        if(err){

            return res.status(500).json({
                message:"Database Error"
            });

        }


        res.json(result);


    });


};
/* =====================================
        GET APPROVED PRODUCTS
===================================== */

exports.getApprovedProducts = (req,res)=>{

const query = `

    SELECT

        p.product_id,
        p.product_name,
        p.thumbnail,
        p.price,
        p.final_price,
        p.stock,
        p.status,
        s.shop_name

    FROM products p

    JOIN sellers s
    ON p.seller_id = s.seller_id

    WHERE p.status = 'Approved'

    ORDER BY p.product_id DESC

`;


    db.query(query,(err,result)=>{

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
        GET ALL ORDERS
===================================== */

exports.getAllOrders = (req,res)=>{


const query = `

SELECT

o.order_id,
o.total_amount,
o.order_status,
o.payment_status,
o.created_at,
c.full_name,
c.email

FROM orders o

JOIN customers c
ON o.customer_id=c.customer_id

ORDER BY o.order_id DESC

`;


db.query(query,(err,result)=>{


if(err){

return res.status(500).json({
message:"Database Error"
});

}


res.json(result);


});


};
/* =====================================
        GET ALL SELLERS
===================================== */

exports.getAllSellers = (req,res)=>{

    const query = `

        SELECT

            seller_id,
            full_name,
            shop_name,
            email,
            phone,
            city,
            status

        FROM sellers

        ORDER BY seller_id DESC

    `;


    db.query(query,(err,result)=>{

        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Database Error"
            });

        }


        res.json(result);

    });

};