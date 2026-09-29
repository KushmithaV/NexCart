const db = require("../config/db");
const { sendOrderConfirmationEmail } = require("../utils/orderStatusEmail");
const { sendOrderShippingEmail } = require("../utils/orderShippingEmail");
const { sendOrderDeliveredEmail } = require("../utils/orderDeliveredEmail");
const { sendOrderCancelledEmail } = require("../utils/orderCancelledEmail");
function createNotification(receiverType, receiverId, title, message) {

    db.query(
        `INSERT INTO notifications
        (receiver_type, receiver_id, title, message)
        VALUES (?,?,?,?)`,
        [
            receiverType,
            receiverId,
            title,
            message
        ],
        (err) => {
            if (err) console.log("Notification Error:", err);
        }
    );

}
// PLACE ORDER

exports.placeOrder = (req,res)=>{

const {
    customer_id,
    receiver_name,
    phone,
    address_line,
    landmark,
    city,
    state,
    pincode,
    subtotal,
    delivery_charge,
    discount,
    total_amount,
    payment_method,
    payment_status,
    items
} = req.body;
console.log(req.body);
console.log("Payment Method:", payment_method);
console.log("Payment Status:", payment_status);

const addressQuery = `

INSERT INTO customer_addresses
(
customer_id,
receiver_name,
phone,
address_line,
landmark,
city,
state,
pincode
)

VALUES(?,?,?,?,?,?,?,?)

`;

db.query(

addressQuery,

[
customer_id,
receiver_name,
phone,
address_line,
landmark,
city,
state,
pincode
],

(err,addressResult)=>{

if(err){

console.log(err);

return res.status(500).json({
message:"Address save failed"
});

}

const address_id = addressResult.insertId;



    const orderQuery = `

  INSERT INTO orders
(
    customer_id,
    address_id,
    subtotal,
    delivery_charge,
    discount,
    total_amount,
    payment_method,
    payment_status,
    order_status
)

VALUES(?,?,?,?,?,?,?,?,'Placed')

    `;



    db.query(

        orderQuery,

        [
    customer_id,
    address_id,
    subtotal,
    delivery_charge,
    discount,
    total_amount,
    payment_method,
    payment_status
],

        (err,result)=>{


            if(err){
                console.log(err);
                return res.status(500).json({
                    message:"Order creation failed"
                });
            }



            const order_id=result.insertId;



const itemQuery = `
INSERT INTO order_items
(
    order_id,
    product_id,
    seller_id,
    quantity,
    price
)
VALUES ?
`;


let itemValues = [];

let completed = 0;


items.forEach(item => {


    db.query(

        "SELECT seller_id FROM products WHERE product_id=?",

        [item.product_id],

        (err, product)=>{


            if(err){

                console.log(err);

                return res.status(500).json({
                    message:"Seller fetch failed"
                });

            }


            if(product.length === 0){

    return res.status(400).json({
        message:"Product seller not found"
    });

}


itemValues.push([

    order_id,
    item.product_id,
    product[0].seller_id,
    item.quantity,
    item.price

]);


            completed++;


            if(completed === items.length){


db.query(

itemQuery,

[itemValues],

(err2)=>{

if(err2){

console.log(err2);

return res.status(500).json({
message:"Items failed"
});

}


// UPDATE STOCK

let stockUpdated = 0;


items.forEach(item=>{


db.query(

`
UPDATE products
SET stock = stock - ?
WHERE product_id = ?
`,

[
item.quantity,
item.product_id
],

(err)=>{

if(err){
console.log("Stock update error:",err);
}


stockUpdated++;


if (stockUpdated === items.length) {

    db.query(

        "SELECT full_name FROM customers WHERE customer_id=?",

        [customer_id],

        (err, customerResult) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Customer fetch failed"
                });
            }

            const customerName = customerResult[0].full_name;

            createNotification(
                "admin",
                null,
                "New Order Received",
                `Order #${order_id} placed by ${customerName}.`
            );
            const sellerIds = [...new Set(itemValues.map(item => item[2]))];

sellerIds.forEach(sellerId => {

    const sellerProducts = itemValues
        .filter(item => item[2] === sellerId);


    const productIds = sellerProducts.map(item => item[1]);


    db.query(
        `
        SELECT GROUP_CONCAT(product_name) AS products
        FROM products
        WHERE product_id IN (?)
        `,
        [productIds],
        (err, productResult)=>{


            const productNames =
            productResult[0].products;


            createNotification(
                "seller",
                sellerId,
                "New Order Received",
                `Order #${order_id} placed by ${customerName}. Products: ${productNames}`
            );


        }
    );

});

            return res.json({
                message: "Order placed successfully",
                order_id
            });

        }

    );

}


}

);


});


}

);

            }


        }

    );


});



        }

    );

            



        }

    );

};
exports.getAdminOrders = (req,res)=>{


const query = `

SELECT


o.order_id,
o.total_amount,
o.order_status,
o.payment_method,
o.payment_status,
o.order_date,

c.full_name AS customer_name,

p.product_name,
p.thumbnail,

oi.quantity,

s.shop_name

FROM orders o


JOIN customers c
ON o.customer_id = c.customer_id


JOIN order_items oi
ON o.order_id = oi.order_id


JOIN products p
ON oi.product_id = p.product_id


JOIN sellers s
ON oi.seller_id = s.seller_id


ORDER BY o.order_date DESC

`;


db.query(query,(err,result)=>{


if(err){

console.log(err);

return res.status(500).json({
message:"Failed to fetch orders"
});

}


res.json(result);


});


};
// ================================
// CONFIRM ORDER (ADMIN APPROVAL)
// ================================

// ================================
// CONFIRM ORDER (ADMIN APPROVAL)
// ================================

exports.confirmOrder = (req,res)=>{

const order_id = req.params.id;
    const fetchQuery = `

    SELECT

        o.order_id,
        o.total_amount,

        c.full_name AS customer_name,
        c.email AS customer_email,


        s.seller_id,
        s.full_name AS seller_name,
        s.email AS seller_email,


        GROUP_CONCAT(p.product_name) AS products


    FROM orders o


    JOIN customers c
    ON o.customer_id = c.customer_id


    JOIN order_items oi
    ON o.order_id = oi.order_id


    JOIN products p
    ON oi.product_id = p.product_id


    JOIN sellers s
    ON oi.seller_id = s.seller_id


    WHERE o.order_id=?


    GROUP BY 
    o.order_id,
    c.customer_id,
    s.seller_id

    `;



    db.query(fetchQuery,[order_id],(err,result)=>{


        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Unable to fetch order details"
            });

        }



        if(result.length===0){

            return res.status(404).json({
                message:"Order not found"
            });

        }



        const order = {

            order_id: result[0].order_id,

            total_amount: result[0].total_amount,

            products: result
            .map(item=>item.products)
            .join(", ")

        };



        const customer = {

            full_name: result[0].customer_name,

            email: result[0].customer_email

        };



        // UPDATE STATUS FIRST

        db.query(

            `
            UPDATE orders
            SET order_status='Confirmed'
            WHERE order_id=?
            `,

            [order_id],

            (err)=>{


                if(err){

                    console.log(err);

                    return res.status(500).json({
                        message:"Unable to confirm order"
                    });

                }



                // CUSTOMER MAIL

                sendOrderConfirmationEmail(
                    customer,
                    order,
                    "Customer"
                );




                // SELLER MAILS

                result.forEach(row=>{


                    const seller = {

                        full_name: row.seller_name,

                        email: row.seller_email

                    };


                    const sellerOrder = {

                        order_id: order.order_id,

                        total_amount: order.total_amount,

                        products: row.products

                    };



                    sendOrderConfirmationEmail(
                        seller,
                        sellerOrder,
                        "Seller"
                    );


                });



                res.json({

                    message:
                    "Order approved and confirmation emails sent"

                });


            }

        );


    });


};

// ================================
// CANCEL ORDER
// ================================

exports.cancelOrder = (req, res) => {

const order_id = req.params.id;
    const fetchQuery = `

    SELECT

        oi.order_item_id,
        oi.quantity,

        o.order_id,
        o.total_amount,

        c.full_name AS customer_name,
        c.email AS customer_email,

        s.full_name AS seller_name,
        s.email AS seller_email,

        p.product_id,
        p.product_name

    FROM order_items oi

    JOIN orders o
    ON oi.order_id = o.order_id

    JOIN customers c
    ON o.customer_id = c.customer_id

    JOIN sellers s
    ON oi.seller_id = s.seller_id

    JOIN products p
    ON oi.product_id = p.product_id

WHERE o.order_id = ?
    `;

    db.query(fetchQuery, [order_id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Unable to fetch order"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        const item = result[0];

        // Restore stock
        db.query(

            `
            UPDATE products
            SET stock = stock + ?
            WHERE product_id = ?
            `,

            [
                item.quantity,
                item.product_id
            ]

        );
        if (order.order_status === "Dispatched" || order.order_status === "Delivered") {
    return res.status(400).json({
        message: "Order cannot be cancelled after shipping"
    });
}

        // Cancel order item
        db.query(

            `
            
UPDATE orders
SET order_status='Cancelled'
WHERE order_id=?
            `,

            [order_id],

            (err2) => {

                if (err2) {

                    console.log(err2);

                    return res.status(500).json({
                        message: "Unable to cancel order"
                    });

                }

                const customer = {

                    full_name: item.customer_name,
                    email: item.customer_email

                };

                const seller = {

                    full_name: item.seller_name,
                    email: item.seller_email

                };

                const order = {

                    order_id: item.order_id,
                    total_amount: item.total_amount,
                    products: item.product_name

                };

                sendOrderCancelledEmail(
                    customer,
                    order,
                    "Customer"
                );

                sendOrderCancelledEmail(
                    seller,
                    order,
                    "Seller"
                );

                res.json({

                    message: "Order cancelled successfully"

                });

            }

        );

    });

};
exports.getCustomerOrders = (req,res)=>{


const customer_id = req.params.id;


const query = `

SELECT

o.order_id,
o.order_date,
o.order_status,
o.total_amount,
o.payment_method,
o.payment_status,

oi.quantity,
oi.price,

p.product_name,
p.thumbnail,

s.shop_name


FROM orders o


JOIN order_items oi
ON o.order_id = oi.order_id


JOIN products p
ON oi.product_id = p.product_id


JOIN sellers s
ON oi.seller_id = s.seller_id


WHERE o.customer_id = ?


ORDER BY o.order_date DESC

`;



db.query(query,[customer_id],(err,result)=>{


if(err){

console.log(err);

return res.status(500).json({
message:"Unable to fetch customer orders"
});

}


res.json(result);


});


};
// ================================
// GET SELLER ORDERS
// ================================

exports.getSellerOrders = (req, res) => {

    const seller_id = req.params.id;
    console.log("Seller ID:", seller_id);

    const query = `

    SELECT

        o.order_id,
        o.order_date,
        o.order_status,
        o.payment_method,
        o.payment_status,
        o.total_amount,

        c.full_name,
        c.email,
        c.phone,

        ca.receiver_name,
        ca.phone AS receiver_phone,
        ca.address_line,
        ca.landmark,
        ca.city,
        ca.state,
        ca.pincode,

        p.product_name,
        p.thumbnail,

        oi.quantity,
        oi.price

    FROM orders o

    JOIN customers c
    ON o.customer_id = c.customer_id

    JOIN customer_addresses ca
    ON o.address_id = ca.address_id

    JOIN order_items oi
    ON o.order_id = oi.order_id

    JOIN products p
    ON oi.product_id = p.product_id

    WHERE oi.seller_id = ?

    ORDER BY o.order_date DESC

    `;

    db.query(query, [seller_id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Unable to fetch seller orders"
            });

        }

        res.json(result);

    });

};
// ================================
// GET SELLER REVENUE
// ================================

exports.getSellerRevenue = (req,res)=>{

    const seller_id = req.params.id;

    const query = `

    SELECT 
    SUM(oi.subtotal) AS totalRevenue

    FROM order_items oi

    JOIN orders o
    ON oi.order_id = o.order_id

    WHERE oi.seller_id = ?
    AND o.payment_status = 'success'

    `;


    db.query(query,[seller_id],(err,result)=>{

        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Revenue fetch failed"
            });

        }


        res.json({
            totalRevenue: result[0].totalRevenue || 0
        });

    });

};



// ================================
// GET SELLER ORDER COUNT
// ================================

exports.getSellerOrdersCount = (req,res)=>{

    const seller_id = req.params.id;


    const query = `

    SELECT COUNT(DISTINCT oi.order_id) AS totalOrders

    FROM order_items oi

    JOIN orders o
    ON oi.order_id = o.order_id

    WHERE oi.seller_id = ?
    AND o.order_status != 'Cancelled'

    `;


    db.query(query,[seller_id],(err,result)=>{

        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Order count failed"
            });

        }


        res.json({
            totalOrders: result[0].totalOrders
        });

    });

};

exports.getAdminNotifications = (req, res) => {

const query = `
    SELECT *
    FROM notifications
    WHERE receiver_type='admin'
    AND is_read = 0
    ORDER BY created_at DESC
`;

    db.query(query, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Unable to fetch notifications"
            });

        }

        res.json(result);

    });

};
exports.getAdminNotificationHistory = (req, res) => {

    const query = `
        SELECT *
        FROM notifications
        WHERE receiver_type='admin'
        AND is_read = 1
        ORDER BY created_at DESC
    `;

    db.query(query, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Unable to fetch notification history"
            });

        }

        res.json(result);

    });

};
exports.markAdminNotificationsRead = (req, res) => {

    const query = `
        UPDATE notifications
        SET is_read = 1
        WHERE receiver_type='admin'
        AND is_read = 0
    `;

    db.query(query, (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Unable to update notifications"
            });

        }

        res.json({
            message: "Notifications marked as read"
        });

    });

};
exports.getSellerNotifications = (req, res) => {

    const seller_id = req.params.id;

    const query = `
        SELECT *
        FROM notifications
        WHERE receiver_type='seller'
        AND receiver_id=?
        AND is_read=0
        ORDER BY created_at DESC
    `;

    db.query(query, [seller_id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Unable to fetch notifications"
            });

        }

        res.json(result);

    });

};
exports.getSellerNotificationHistory = (req, res) => {

    const seller_id = req.params.id;

    const query = `
        SELECT *
        FROM notifications
        WHERE receiver_type='seller'
        AND receiver_id=?
        AND is_read=1
        ORDER BY created_at DESC
    `;

    db.query(query, [seller_id], (err, result) => {

        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Unable to fetch notification history"
            });

        }

        res.json(result);

    });

};
exports.markSellerNotificationsRead = (req, res) => {

    const seller_id = req.params.id;

    db.query(
        `
        UPDATE notifications
        SET is_read = 1
        WHERE receiver_type = 'seller'
        AND receiver_id = ?
        AND is_read = 0
        `,
        [seller_id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Unable to mark notifications as read"
                });
            }

            res.json({
                message: "Notifications marked as read"
            });

        }
    );

};

// ================================
// SELLER DISPATCH ORDER
// ================================

exports.dispatchOrder = (req,res)=>{

    const order_id = req.params.id;


    const fetchQuery = `

    SELECT

    o.order_id,
    o.total_amount,

    c.full_name,
    c.email,

    GROUP_CONCAT(p.product_name) AS products


    FROM orders o


    JOIN customers c
    ON o.customer_id=c.customer_id


    JOIN order_items oi
    ON o.order_id=oi.order_id


    JOIN products p
    ON oi.product_id=p.product_id


    WHERE o.order_id=?


    GROUP BY o.order_id

    `;



    db.query(fetchQuery,[order_id],(err,result)=>{


        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Order fetch failed"
            });

        }



        const customer={

            full_name:result[0].full_name,

            email:result[0].email

        };


        const order={

            order_id:result[0].order_id,

            total_amount:result[0].total_amount,

            products:result[0].products

        };



        db.query(

        `
        UPDATE orders
        SET order_status='Shipped'
        WHERE order_id=?
        `,

        [order_id],


        (err)=>{


            if(err){

                console.log(err);

                return res.status(500).json({
                    message:"Unable to dispatch order"
                });

            }



            sendOrderShippingEmail(
                customer,
                order
            );



            res.json({

                message:"Order shipped and customer notified"

            });


        });



    });



};


// ================================
// SELLER DELIVER ORDER
// ================================

// ================================
// SELLER DELIVER ORDER
// ================================

exports.deliverOrder = (req,res)=>{


    const order_id = req.params.id;



    const fetchQuery = `

    SELECT

    o.order_id,
    o.total_amount,

    c.full_name,
    c.email,

    GROUP_CONCAT(p.product_name) AS products


    FROM orders o


    JOIN customers c
    ON o.customer_id=c.customer_id


    JOIN order_items oi
    ON o.order_id=oi.order_id


    JOIN products p
    ON oi.product_id=p.product_id


    WHERE o.order_id=?


    GROUP BY o.order_id

    `;



    db.query(fetchQuery,[order_id],(err,result)=>{


        if(err){

            console.log(err);

            return res.status(500).json({
                message:"Order fetch failed"
            });

        }



        const customer = {

            full_name: result[0].full_name,

            email: result[0].email

        };



        const order = {

            order_id: result[0].order_id,

            total_amount: result[0].total_amount,

            products: result[0].products

        };



        db.query(

        `
        UPDATE orders
        SET order_status='Delivered'
        WHERE order_id=?
        `,

        [order_id],

        (err)=>{


            if(err){

                console.log(err);

                return res.status(500).json({
                    message:"Unable to update order"
                });

            }



            sendOrderDeliveredEmail(
                customer,
                order
            );



            res.json({

                message:"Order delivered and customer notified"

            });


        });


    });


};