const sendMail = require("./mailer");
const sendProductStatusEmail = async (seller, product, status) => {

    let subject;
    let html;


    if(status === "Approved"){

        subject = "Your NexCart Product Has Been Approved 🎉";

        html = html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 18px rgba(0,0,0,.12);">


<!-- HEADER -->

<div style="background:#111;padding:28px;text-align:center;">

<h1 style="margin:0;color:#ff7300;font-size:34px;">
🛒 NexCart
</h1>

<p style="margin-top:8px;color:white;">
Premium Multi-Vendor Marketplace
</p>

</div>


<!-- BODY -->

<div style="padding:35px;color:#333;">


<h2 style="color:#ff7300;">
Product Approved 🎉
</h2>


<p>
Hello <b>${seller.full_name}</b>,
</p>


<p>
Your product has been reviewed and approved by the NexCart team.
</p>



<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
border-radius:8px;
">


<p style="margin:8px 0;">
<b>Product:</b> ${product.product_name}
</p>


<p style="margin:8px 0;">
<b>Status:</b> Approved ✅
</p>


<p style="margin:15px 0;color:#555;line-height:1.7;">
Your product meets NexCart’s marketplace guidelines and is now live for customers.
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
Regards,<br>
<b>Team NexCart</b>
</p>


</div>



<!-- FOOTER -->

<div style="background:#111;padding:20px;text-align:center;">

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


    else if(status === "Rejected"){

        subject = "NexCart Product Review Update ⚠️";

        html =html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

<div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 5px 18px rgba(0,0,0,.12);">


<div style="background:#111;padding:28px;text-align:center;">

<h1 style="margin:0;color:#ff7300;font-size:34px;">
🛒 NexCart
</h1>

<p style="margin-top:8px;color:white;">
Premium Multi-Vendor Marketplace
</p>

</div>



<div style="padding:35px;color:#333;">


<h2 style="color:#ff7300;">
Product Review Update
</h2>


<p>
Hello <b>${seller.full_name}</b>,
</p>


<p>
After reviewing your product submission, we’re unable to approve it at this time.
</p>



<div style="
background:#fff7f0;
border-left:5px solid #ff7300;
padding:20px;
margin:25px 0;
border-radius:8px;
">


<p style="margin:8px 0;">
<b>Product:</b> ${product.product_name}
</p>


<p style="margin:8px 0;">
<b>Status:</b> Rejected ❌
</p>


<p style="margin:15px 0;color:#555;line-height:1.7;">
This product does not meet NexCart’s marketplace guidelines.
Please review the product details, images, description, and other information before submitting again.
</p>


</div>



<div style="text-align:center;margin-top:30px;">

<a href="http://localhost:3000/"
style="
background:#ff7300;
color:white;
text-decoration:none;
padding:14px+32px;
border-radius:6px;
font-weight:bold;
display:inline-block;
">
Go to NexCart
</a>

</div>



<p style="margin-top:35px;">
Regards,<br>
<b>Team NexCart</b>
</p>


</div>



<div style="background:#111;padding:20px;text-align:center;">

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
        seller.email,
        subject,
        html
    );

};


module.exports = {
    sendProductStatusEmail
};