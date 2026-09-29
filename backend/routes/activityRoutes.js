const express = require("express");
const router = express.Router();

const db = require("../config/db");


router.get("/:sellerId", (req,res)=>{

    const sellerId = req.params.sellerId;

    const query = `

        SELECT *

        FROM activities

        WHERE seller_id = ?

        ORDER BY created_at DESC

        LIMIT 5

    `;

    db.query(query, [sellerId], (err, result)=>{

        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Database Error"
            });

        }

        res.json(result);

    });

});


module.exports = router;