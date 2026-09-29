const validateEmail = require("../utils/emailValidator");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/mailer");
/* =====================================
        REGISTER SELLER
===================================== */

/* =====================================
        REGISTER SELLER
===================================== */

exports.registerSeller = async (req, res) => {

    console.log("========== SELLER REGISTER ==========");
    console.log(req.body);


    try {

        const {
            fullname,
            email,
            phone,
            password,
            shop_name,
            gst_number,
            address,
            city,
            state,
            pincode
        } = req.body;


        if (
            !fullname ||
            !email ||
            !phone ||
            !password ||
            !shop_name ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {

            return res.status(400).json({
                message: "Please fill all required fields."
            });

        }


const isValidEmail = await validateEmail(email);

if (!isValidEmail) {

    return res.status(400).json({

        message: "Entered email is invalid."

    });

}
        db.query(
"SELECT * FROM sellers WHERE email=? OR phone=?",
            [email, phone],

            async (err, result)=>{


                if(err){
                    return res.status(500).json(err);
                }


                if(result.length > 0){

                    return res.status(400).json({
                        message:"Seller already exists."
                    });

                }



                const hashedPassword =
                    await bcrypt.hash(password,10);



                db.query(

                    `
                    INSERT INTO sellers
                    (
                        full_name,
                        email,
                        phone,
                        password,
                        shop_name,
                        gst_number,
                        address,
                        city,
                        state,
                        pincode
                    )

                    VALUES (?,?,?,?,?,?,?,?,?,?)
                    `,

                    [

                        fullname,
                        email,
                        phone,
                        hashedPassword,
                        shop_name,
                        gst_number,
                        address,
                        city,
                        state,
                        pincode

                    ],


async (err, result) => {

                        if(err){

                            console.log("INSERT ERROR:");
                            console.log(err);

                            return res.status(500).json(err);

                        }



                        console.log("SELLER INSERT SUCCESS");



                        // ===============================
                        // RECENT ACTIVITY INSERT
                        // ===============================


                        const activityQuery = `

                            INSERT INTO activities
                            (
                                activity_message,
                                activity_type
                            )

                            VALUES (?,?)

                        `;



                        db.query(

                            activityQuery,

                            [
                                `New seller registration received from ${fullname}`,
                                "SELLER"
                            ],

                            (activityErr)=>{

                                if(activityErr){

                                    console.log(
                                        "Activity Error:",
                                        activityErr
                                    );

                                }

                            }

                        );


try{

await sendMail(

    email,

    "Welcome to NexCart Seller Portal 🎉",

`
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

<h2 style="color:#ff7300;">Seller Registration Successful!</h2>

<p>Hello <b>${fullname}</b>,</p>

<p>Thank you for registering as a seller on NexCart.</p>

<p>Your seller account has been created successfully.</p>

<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
border-radius:8px;
">

<p style="margin:0;color:#555;line-height:1.7;">
Thank you for registering as a seller on <b>NexCart</b>. You'll receive another email once your account has been approved by our team.
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
Visit NexCart
</a>

</div>

<p style="margin-top:35px;">
Thank you for choosing <b>NexCart</b>.
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
`

);

} catch (mailErr) {

    console.log("Seller Mail Error:", mailErr);

}

res.status(201).json({

    message: "Seller Registration Successful."

});


                    }

                );

            }

        );

    }


    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};
/* =====================================
        SELLER LOGIN
===================================== */

/* =====================================
        SELLER LOGIN
===================================== */

exports.loginSeller = (req, res) => {

    const { email, password } = req.body;

    db.query(

        "SELECT * FROM sellers WHERE email=?",

        [email],

        async (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            if (result.length === 0) {

                return res.status(404).json({

                    message: "Seller not found."

                });

            }

            const seller = result[0];

            /* ===============================
                CHECK SELLER STATUS
            =============================== */

            if (seller.status === "Pending") {

                return res.status(403).json({

                    message: "Your account is waiting for Admin approval."

                });

            }

            if (seller.status === "Rejected") {

                return res.status(403).json({

                    message: "Your seller account has been rejected."

                });

            }

            if (seller.status === "Blocked") {

                return res.status(403).json({

                    message: "Your seller account has been blocked."

                });

            }

            /* ===============================
                CHECK PASSWORD
            =============================== */

            const checkPassword = await bcrypt.compare(

                password,

                seller.password

            );

            if (!checkPassword) {

                return res.status(401).json({

                    message: "Invalid Password"

                });

            }
            /* =====================================
        CHECK APPROVAL STATUS
===================================== */

if (seller.status === "Pending") {

    return res.status(403).json({

        message: "Your account is waiting for admin approval."

    });

}

if (seller.status === "Rejected") {

    return res.status(403).json({

        message: "Your seller account has been rejected."

    });

}

if (seller.status === "Blocked") {

    return res.status(403).json({

        message: "Your seller account has been blocked."

    });

}

            /* ===============================
                CREATE JWT
            =============================== */

            const token = jwt.sign(

                {

                    id: seller.seller_id,

                    role: "seller"

                },

                process.env.JWT_SECRET,

                {

                    expiresIn: "1d"

                }

            );

            res.status(200).json({

                message: "Login Successful",

                token,

                seller: {

                    seller_id: seller.seller_id,

                    full_name: seller.full_name,

                    shop_name: seller.shop_name,

                    email: seller.email,

                    status: seller.status

                }

            });

        }

    );

};
/* =====================================
        GET SELLER PROFILE
===================================== */

exports.getSellerProfile = (req,res)=>{


    const sellerId = req.params.id;


    db.query(

        "SELECT seller_id,full_name,email,phone,shop_name,gst_number,address,city,state,pincode FROM sellers WHERE seller_id=?",

        [sellerId],

        (err,result)=>{


            if(err){

                return res.status(500).json(err);

            }


            if(result.length===0){

                return res.status(404).json({
                    message:"Seller not found"
                });

            }


            res.json(result[0]);

        }

    );


};
/* =====================================
        UPDATE SELLER PROFILE
===================================== */


exports.updateSellerProfile = (req,res)=>{


    const sellerId = req.params.id;


    const {
        phone,
        address,
        city,
        state,
        pincode
    } = req.body;



    db.query(

        `UPDATE sellers
        SET phone=?,
        address=?,
        city=?,
        state=?,
        pincode=?
        WHERE seller_id=?`,

        [
            phone,
            address,
            city,
            state,
            pincode,
            sellerId
        ],


        (err,result)=>{


            if(err){

                return res.status(500).json(err);

            }


            res.json({

                message:"Seller profile updated"

            });


        }

    );


};
/* =====================================
        SELLER DASHBOARD STATS
===================================== */

exports.getSellerDashboardStats = (req,res)=>{

    const sellerId = req.params.id;


    const query = `

        SELECT

        COUNT(DISTINCT oi.order_id) AS orders,

        COALESCE(SUM(oi.subtotal),0) AS revenue


        FROM order_items oi


        JOIN orders o

        ON oi.order_id = o.order_id


        WHERE oi.seller_id = ?

        AND o.payment_status = 'Success'

    `;


    db.query(query,[sellerId],(err,result)=>{


        if(err){

            console.log(err);

            return res.status(500).json({

                message:"Database Error"

            });

        }


        res.json({

            orders: result[0].orders,

            revenue: result[0].revenue

        });


    });


};