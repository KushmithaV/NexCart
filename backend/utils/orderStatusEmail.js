const sendMail = require("./mailer");


const sendOrderConfirmationEmail = async (user, order, type) => {

    let subject;
    let html;


    if(type === "Seller"){

        subject = "New Confirmed Order Received - NexCart 🛒";


        html = `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>


<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">


<div style="
max-width:650px;
margin:auto;
background:#ffffff;
border-radius:12px;
overflow:hidden;
box-shadow:0 5px 18px rgba(0,0,0,.12);
">


<div style="
background:#111;
padding:28px;
text-align:center;
">

<h1 style="
margin:0;
color:#ff7300;
font-size:34px;
">

🛒 NexCart

</h1>


<p style="
margin-top:8px;
color:white;
">

Premium Multi-Vendor Marketplace

</p>

</div>



<div style="
padding:35px;
color:#333;
">


<h2 style="
color:#ff7300;
">

New Order Confirmed 🎉

</h2>


<p>
Hello <b>${user.full_name}</b>,
</p>


<p>
An order containing your product(s) has been confirmed by the NexCart team.
</p>



<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
border-radius:8px;
">


<p>
<b>Order ID:</b> #${order.order_id}
</p>


<p>
<b>Products:</b> ${order.products}
</p>


<p>
<b>Order Amount:</b> ₹${order.total_amount}
</p>


<p>
<b>Status:</b> Confirmed ✅
</p>


</div>



<p style="
line-height:1.7;
color:#555;
">

Please prepare the order and dispatch it from your seller dashboard.

</p>



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

Open NexCart

</a>

</div>



<p style="margin-top:35px;">

Regards,<br>

<b>Team NexCart</b>

</p>


</div>



<div style="
background:#111;
padding:20px;
text-align:center;
">


<p style="color:white;">
📧 nexcart.service@gmail.com
</p>


<p style="color:#999;font-size:12px;">
© 2026 NexCart. All Rights Reserved.
</p>


</div>


</div>

</body>

</html>
`;

    }



    else if(type === "Customer"){


        subject = "Your NexCart Order Has Been Confirmed 🎉";


        html = `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>


<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">


<div style="
max-width:650px;
margin:auto;
background:#ffffff;
border-radius:12px;
overflow:hidden;
box-shadow:0 5px:18px rgba(0,0,0,.12);
">


<div style="
background:#111;
padding:28px;
text-align:center;
">

<h1 style="
margin:0;
color:#ff7300;
font-size:34px;
">

🛒 NexCart

</h1>


<p style="
margin-top:8px;
color:white;
">

Premium Multi-Vendor Marketplace

</p>

</div>



<div style="
padding:35px;
color:#333;
">


<h2 style="
color:#ff7300;
">

Order Confirmed 🎉

</h2>


<p>
Hello <b>${user.full_name}</b>,
</p>


<p>
Your NexCart order has been successfully confirmed by our team.
</p>



<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
border-radius:8px;
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
<b>Status:</b> Confirmed ✅
</p>


</div>



<p style="
line-height:1.7;
color:#555;
">

Your order is now being prepared. 
We will notify you once it has been shipped.

</p>



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

Track Order

</a>

</div>



<p style="margin-top:35px;">

Regards,<br>

<b>Team NexCart</b>

</p>


</div>



<div style="
background:#111;
padding:20px;
text-align:center;
">


<p style="color:white;">
📧 nexcart.service@gmail.com
</p>


<p style="color:#999;font-size:12px;">
© 2026 NexCart. All Rights Reserved.
</p>


</div>


</div>

</body>

</html>
`;

    }



    await sendMail(
        user.email,
        subject,
        html
    );

};



module.exports = {
    sendOrderConfirmationEmail
};