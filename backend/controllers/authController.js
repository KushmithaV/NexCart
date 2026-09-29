const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* =====================================
        REGISTER USER
===================================== */

exports.register = async (req, res) => {

    console.log("REGISTER REQUEST:");
    console.log(req.body);

    try {

        const {
            fullname,
            email,
            phone,
            password
        } = req.body;

        if (!fullname || !email || !phone || !password) {

            return res.status(400).json({
                message: "Please fill all fields."
            });

        }

        db.query(

            "SELECT * FROM customers WHERE email=?",

            [email],

            async (err, result) => {
                if (err){

    console.log("SELECT ERROR:");
    console.log(err);

    return res.status(500).json({
        message: err.message
    });

}

                if (result.length > 0) {

                    return res.status(400).json({
                        message: "Email already exists."
                    });

                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                db.query(

                    `INSERT INTO customers
                    (full_name,email,phone,password)
                    VALUES(?,?,?,?)`,

                    [
                        fullname,
                        email,
                        phone,
                        hashedPassword
                    ],
                    (err, result) => {

    if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json(err);
    }

    console.log("INSERT SUCCESS");
    console.log(result);

    db.query("SELECT * FROM customers", (err, rows) => {

        console.log("ROWS AFTER INSERT:");
        console.log(rows);

    });

    res.status(201).json({
        message: "Registration Successful."
    });

}

                );

            }

        );

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



/* =====================================
            LOGIN USER
===================================== */

exports.login = (req, res) => {

    const {

        email,
        password

    } = req.body;

    db.query(

        "SELECT * FROM customers WHERE email=?",

        [email],

        async (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0) {

                return res.status(400).json({

                    message: "Invalid Email."

                });

            }

            const user = result[0];

            const match =
                await bcrypt.compare(

                    password,

                    user.password

                );

            if (!match) {

                return res.status(400).json({

                    message: "Invalid Password."

                });

            }

            const token = jwt.sign(

                {

                    id: user.customer_id,

                    email: user.email

                },

                process.env.JWT_SECRET,

                {

                    expiresIn: "1d"

                }

            );

            res.json({

                message: "Login Successful",

                token,

                user: {

                    id: user.customer_id,

                    fullname: user.full_name,

                    email: user.email

                }

            });

        }

    );

};