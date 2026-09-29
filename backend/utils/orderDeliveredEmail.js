const sendMail = require("./mailer");


const sendOrderDeliveredEmail = async (customer, order)=>{


const subject = "Your NexCart Order Has Been Delivered 🎉";


const html = `

<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>


<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">


<div style="
max-width:650px;
margin:auto;
background:white;
border-radius:12px;
overflow:hidden;
box-shadow:0 5px 18px rgba(0,0,0,.12);
">


<div style="
background:#111;
padding:28px;
text-align:center;
">

<h1 style="color:#ff7300;">
🛒 NexCart
</h1>

<p style="color:white;">
Premium Multi-Vendor Marketplace
</p>

</div>



<div style="padding:35px;color:#333;">


<h2 style="color:#ff7300;">
Order Delivered Successfully 🎉
</h2>


<p>
Hello <b>${customer.full_name}</b>,
</p>


<p>
Your NexCart order has been delivered successfully.
We hope you enjoy your purchase!
</p>



<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
">


<p>
<b>Order ID:</b> #${order.order_id}
</p>


<p>
<b>Products:</b> ${order.products}
</p>


<p>
<b>Total Amount:</b> ₹${order.total_amount}
</p>


<p>
<b>Status:</b> Delivered ✅
</p>


</div>



<p style="line-height:1.7;color:#555;">

Thank you for shopping with NexCart.
We look forward to serving you again.

</p>



<p style="margin-top:35px;">

Regards,<br>

<b>Team NexCart</b>

</p>


</div>



<div style="
background:#111;
padding:20px;
text-align:center;
color:white;
">

📧 nexcart.service@gmail.com

</div>


</div>


</body>

</html>

`;



await sendMail(
    customer.email,
    subject,
    html
);


};


module.exports = {
    sendOrderDeliveredEmail
};