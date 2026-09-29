const validateEmail = require("../utils/emailValidator");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mailer");

/* =====================================
        CUSTOMER REGISTER
===================================== */

exports.registerCustomer = async (req,res)=>{


    try{


  const {
    fullname,
    email,
    phone,
    password
} = req.body;



        if(
            !fullname ||
            !email ||
            !phone ||
            !password
        ){

            return res.status(400).json({

                message:"Please fill all required fields."

            });

        }


const isValidEmail = await validateEmail(email);

if (!isValidEmail) {

    return res.status(400).json({

        message: "Entered email is invalid."

    });

}
        db.query(

"SELECT * FROM customers WHERE email=? OR phone=?",
            [email, phone],

            async(err,result)=>{


                if(err){

                    return res.status(500).json({
    message: err.sqlMessage
});

                }



                if(result.length>0){

                    return res.status(400).json({

                        message:"Customer already exists."

                    });

                }



                const hashedPassword =
                await bcrypt.hash(password,10);



                db.query(

                    `INSERT INTO customers
(
    full_name,
    email,
    phone,
    password
)
VALUES (?,?,?,?)`,

                    [
    fullname,
    email,
    phone,
    hashedPassword
],


                    (err,result)=>{


                      if(err){

    if(err.code === "ER_DUP_ENTRY"){

        return res.status(400).json({

            message:"User with this email or phone number already exists."

        });

    }


    return res.status(500).json({

        message:"Registration failed"

    });

}



db.query(
    `INSERT INTO notifications
    (receiver_type, receiver_id, title, message)
    VALUES (?,?,?,?)`,
    [
        "admin",
        null,
        "New Customer Registered",
        `${fullname} has registered successfully.`
    ],
    async (notificationErr) => {

        if (notificationErr) {
            console.log("Notification Error:", notificationErr);
        }

        await sendMail(

            email,

            "Welcome to NexCart 🎉",
     `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>

<body style="
margin:0;
padding:40px 0;
background:#f5f5f5;
font-family:Arial,Helvetica,sans-serif;
">

<div style="
max-width:650px;
margin:auto;
background:#ffffff;
border-radius:12px;
overflow:hidden;
box-shadow:0 5px 18px rgba(0,0,0,.12);
">

<!-- HEADER -->

<div style="
background:#111111;
padding:28px;
text-align:center;
">

<h1 style="
margin:0;
color:#ff7300;
font-size:34px;
letter-spacing:1px;
">
🛒 NexCart
</h1>

<p style="
margin-top:8px;
color:#ffffff;
font-size:15px;
">
Premium Multi-Vendor Marketplace
</p>

</div>

<!-- BODY -->

<div style="
padding:35px;
color:#333;
">

<h2 style="
margin-top:0;
color:#ff7300;
">
Welcome to NexCart!
</h2>

<p>
Hi <b>${fullname}</b>,
</p>

<p>
We're excited to have you with us.
</p>

<p>
Your account has been created successfully.
</p>

<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:18px;
margin:25px 0;
border-radius:8px;
">

<p style="margin:8px 0;">✔ Browse thousands of products</p>

<p style="margin:8px 0;">✔ Add products to your cart & wishlist</p>

<p style="margin:8px 0;">✔ Place secure orders</p>

<p style="margin:8px 0;">✔ Track your orders anytime</p>

</div>

<div style="text-align:center;margin-top:30px;">

<a
href="http://localhost:3000/"
style="
background:#ff7300;
color:white;
text-decoration:none;
padding:14px 32px;
border-radius:6px;
font-size:16px;
font-weight:bold;
display:inline-block;
">
Start Shopping
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

<!-- FOOTER -->

<div style="
background:#111111;
padding:20px;
text-align:center;
">

<p style="
color:#ffffff;
margin:0;
font-size:14px;
">

Need help?<br>

📧 nexcart.service@gmail.com

</p>

<p style="
margin-top:12px;
color:#999;
font-size:12px;
">

© 2026 NexCart. All Rights Reserved.

</p>

</div>

</div>

</body>

</html>

            `

        );

        res.status(201).json({

            message: "Customer Registration Successful."

        });

    }
);


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
        CUSTOMER LOGIN
===================================== */

exports.loginCustomer=(req,res)=>{


    const {
        email,
        password
    }=req.body;



    db.query(

        "SELECT * FROM customers WHERE email=?",

        [email],


        async(err,result)=>{


            if(err){

                return res.status(500).json(err);

            }



            if(result.length===0){

                return res.status(404).json({

                    message:"Customer not found"

                });

            }



            const customer=result[0];



            const match =
            await bcrypt.compare(
                password,
                customer.password
            );



            if(!match){

                return res.status(401).json({

                    message:"Invalid password"

                });

            }



            const token = jwt.sign(

                {
                    id:customer.customer_id,
                    role:"customer"
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:"1d"
                }

            );



            res.json({

                message:"Login successful",

                token,
customer:{

    customer_id: customer.customer_id,

    name: customer.full_name,

    email: customer.email,

    phone: customer.phone,

    address: customer.address,

    city: customer.city,

    state: customer.state,

    pincode: customer.pincode

}

            });



        }


    );


};





/* =====================================
        GET CUSTOMER PROFILE
===================================== */

exports.getCustomerProfile=(req,res)=>{


    const id=req.params.id;


    db.query(

        `SELECT 
        customer_id,
        full_name,
        email,
        phone,
        address,
        city,
        state,
        pincode

        FROM customers

        WHERE customer_id=?`,

        [id],


        (err,result)=>{


            if(err){

                return res.status(500).json(err);

            }


            res.json(result[0]);


        }


    );


};





/* =====================================
        UPDATE CUSTOMER PROFILE
===================================== */


exports.updateCustomerProfile=(req,res)=>{


    const id=req.params.id;


    const {
        phone,
        address,
        city,
        state,
        pincode
    }=req.body;



    db.query(

        `UPDATE customers
        SET phone=?,
        address=?,
        city=?,
        state=?,
        pincode=?

        WHERE customer_id=?`,

        [
            phone,
            address,
            city,
            state,
            pincode,
            id
        ],


        (err,result)=>{


            if(err){

                return res.status(500).json(err);

            }



            res.json({

                message:"Profile updated successfully"

            });


        }


    );


};
exports.updateCustomer = (req, res) => {
        console.log("UPDATE HIT");
        console.log(req.body);

    const id = req.params.id;

    const {
        full_name,
        phone,
        email,
        address,
        city,
        state,
        pincode
    } = req.body;

    const query = `
        UPDATE customers
        SET
            full_name=?,
            phone=?,
            email=?,
            address=?,
            city=?,
            state=?,
            pincode=?
        WHERE customer_id=?
    `;

    db.query(
        query,
        [
            full_name,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            id
        ],
        (err) => {

            if(err){
                return res.status(500).json({
                    message:"Database Error"
                });
            }

            res.json({
                message:"Profile Updated Successfully"
            });

        }
    );

};