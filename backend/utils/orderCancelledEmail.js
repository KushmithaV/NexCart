const sendMail = require("./mailer");

exports.sendOrderCancelledEmail = async (user, order, role) => {

    let subject = "";
    let message = "";

    if (role === "Customer") {

        subject = "Your NexCart Order Has Been Cancelled";

        message = `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 18px rgba(0,0,0,.12);">

<div style="background:#111;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ff7300;">🛒 NexCart</h1>
<p style="margin-top:8px;color:#fff;">Premium Multi-Vendor Marketplace</p>
</div>

<div style="padding:35px;color:#333;">

<h2 style="color:#ff7300;">Order Cancelled</h2>

<p>Hi <b>${user.full_name}</b>,</p>

<p>Your order has been cancelled successfully.</p>

<div style="background:#fff7f0;border-left:5px solid #ff7300;padding:18px;border-radius:8px;margin:25px 0;">

<p><b>Order ID:</b> #${order.order_id}</p>

<p><b>Product:</b> ${order.products}</p>

<p><b>Refund Status:</b> 95% refund has been initiated.</p>

</div>

<p>Your refund will be processed shortly according to NexCart's refund policy.</p>

<p>Thank you for shopping with NexCart.</p>

<p>
Regards,<br>
<b>Team NexCart</b>
</p>

</div>

<div style="background:#111;padding:20px;text-align:center;">

<p style="color:#fff;margin:0;">
📧 nexcart.service@gmail.com
</p>

<p style="margin-top:10px;color:#999;font-size:12px;">
© 2026 NexCart. All Rights Reserved.
</p>

</div>

</div>

</body>
</html>
`;

    }

    else if (role === "Seller") {

        subject = "Order Cancelled by Customer";

        message = `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 18px rgba(0,0,0,.12);">

<div style="background:#111;padding:28px;text-align:center;">
<h1 style="margin:0;color:#ff7300;">🛒 NexCart</h1>
<p style="margin-top:8px;color:#fff;">Premium Multi-Vendor Marketplace</p>
</div>

<div style="padding:35px;color:#333;">

<h2 style="color:#ff7300;">Order Cancelled</h2>

<p>Hi <b>${user.full_name}</b>,</p>

<p>A customer has cancelled an order for your product.</p>

<div style="background:#fff7f0;border-left:5px solid #ff7300;padding:18px;border-radius:8px;margin:25px 0;">

<p><b>Order ID:</b> #${order.order_id}</p>

<p><b>Product:</b> ${order.products}</p>

</div>

<p>The stock has been restored automatically.</p>

<p>
Regards,<br>
<b>Team NexCart</b>
</p>

</div>

<div style="background:#111;padding:20px;text-align:center;">

<p style="color:#fff;margin:0;">
📧 nexcart.service@gmail.com
</p>

<p style="margin-top:10px;color:#999;font-size:12px;">
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
        message
    );

};