/* ==========================================
        LOAD CART ITEMS
========================================== */

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const customer = JSON.parse(localStorage.getItem("customer"));

if (!customer) {
    alert("Please login first");
    window.location.href = "customer-login.html";
}

const checkoutItems = document.getElementById("checkoutItems");
const subtotalElement = document.getElementById("subtotal");
const shippingElement = document.getElementById("shipping");
const discountElement = document.getElementById("discount");
const totalElement = document.getElementById("totalAmount");

let subtotal = 0;
let shipping = 0;
let discount = 0;
let codCharge = 0;

/* ==========================================
        DISPLAY PRODUCTS
========================================== */

function loadCheckout() {

    checkoutItems.innerHTML = "";
document.getElementById("fullName").value = customer.name || "";
document.getElementById("phone").value = customer.phone || "";
document.getElementById("email").value = customer.email || "";
document.getElementById("address").value = customer.address || "";
document.getElementById("city").value = customer.city || "";
document.getElementById("state").value = customer.state || "";
document.getElementById("pincode").value = customer.pincode || "";
disableShipping();

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;
        const customer = JSON.parse(localStorage.getItem("customer"));

if(!customer){

    alert("Please login first");

    window.location.href="customer-login.html";

    return;

}

        subtotalElement.textContent = "₹0";
        shippingElement.textContent = "₹0";
        discountElement.textContent = "₹0";
        totalElement.textContent = "₹0";

        return;
    }
    

    cart.forEach(product => {

        const qty = product.quantity || 1;

        const totalPrice = product.price * qty;

        subtotal += totalPrice;

checkoutItems.innerHTML += `

<div class="checkout-product">

<img src="${product.image}" alt="${product.name || product.product_name || "Product"}">
<div class="product-info">

<h4>${product.name || product.product_name || "Product"}</h4>
    <p>₹${product.price}</p>

    <span>Qty : ${qty}</span>

</div>

</div>

`;

    });

   subtotalElement.textContent = `₹${subtotal}`;

discountElement.textContent = `₹${discount}`;


// default delivery charge

if(subtotal < 999){

    shipping = 50;

    shippingElement.textContent = "Delivery ₹50";

}
else{

    shipping = 0;

    shippingElement.textContent = "FREE";

}


// show total immediately

totalElement.textContent =
`₹${subtotal + shipping - discount}`;

}

loadCheckout();


/* ==========================================
        APPLY COUPON
========================================== */

const couponInput = document.querySelector(".coupon input");
const applyBtn = document.querySelector(".coupon button");

applyBtn.addEventListener("click", () => {

    const code = couponInput.value.trim().toUpperCase();

    if (code === "NEX10") {

        discount = subtotal * 0.10;

        discountElement.textContent = `-₹${discount}`;

        totalElement.textContent = `₹${subtotal + shipping - discount}`;

        alert("Coupon Applied Successfully!");

    }
    else {

        alert("Invalid Coupon Code");

    }

});


/* ==========================================
        PLACE ORDER
========================================== */

const placeOrderBtn = document.querySelector(".place-order-btn");
const popup = document.getElementById("successPopup");

placeOrderBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }
    const customer = JSON.parse(localStorage.getItem("customer"));

if(!customer){

    alert("Please login first");

    return;

}
console.log(customer);
console.log("Customer ID:", customer.customer_id);
const newOrder = {

customer_id: customer.customer_id,
receiver_name: document.getElementById("fullName").value,

phone: document.getElementById("phone").value,

address_line: document.getElementById("address").value,

landmark: "",

city: document.getElementById("city").value,

state: document.getElementById("state").value,

pincode: document.getElementById("pincode").value,

    subtotal: subtotal,

    delivery_charge: shipping,

    discount: discount,


    total_amount:
    subtotal + shipping - discount + codCharge,


    payment_method:
document.querySelector('input[name="payment"]:checked')?.value || "cod",

payment_status:
document.querySelector('input[name="payment"]:checked')?.value === "cod"
? "Pending"
: "Success",


    items: cart.map(product => ({

        product_id: product.product_id,

        seller_id: product.seller_id,

        quantity: product.quantity || 1,

        price: product.price

    }))

};





console.log(newOrder);
fetch("http://localhost:3000/api/orders/place", {

    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify(newOrder)

})
.then(res=>res.json())

.then(data=>{

    console.log(data);

if(data.order_id){

    localStorage.setItem(
        "lastOrder",
        JSON.stringify({
            orderId: data.order_id,
            totalAmount: newOrder.total_amount,
            paymentMethod: newOrder.payment_status === "Pending" ? "cod" : "online"
        })
    );

    localStorage.removeItem("cart");

    window.location.href = "order-success.html";

}
else{

    alert("Order failed");

}

})

.catch(err=>{

    console.log(err);

    alert("Server error");

});






localStorage.removeItem("cart");

});


/* ==========================================
        CONTINUE SHOPPING
========================================== */

document.querySelector(".popup-content button")

.addEventListener("click", () => {

    window.location.href = "order-success.html";

});
const upiBox = document.getElementById("upiBox");
const cardBox = document.getElementById("cardBox");
const bankBox = document.getElementById("bankBox");


const paymentOptions = document.querySelectorAll(
    'input[name="payment"]'
);


paymentOptions.forEach(option=>{

    option.addEventListener("change",()=>{


        if(option.value === "cod"){

            codCharge = 20;

            // enable place order for COD
            document.querySelector(".place-order-btn").disabled = false;

        }
        else{

            codCharge = 0;

        }


        const finalTotal =
        subtotal + shipping - discount + codCharge;


        totalElement.textContent =
        `₹${finalTotal}`;


        // hide payment boxes

        upiBox.style.display="none";
        cardBox.style.display="none";
        bankBox.style.display="none";


        if(option.value==="upi"){

            upiBox.style.display="block";

        }

        else if(option.value==="card"){

            cardBox.style.display="block";

        }

        else if(option.value==="netbanking"){

            bankBox.style.display="block";

        }


    });

});
const deliveryOptions = document.querySelectorAll(
    'input[name="delivery"]'
);


deliveryOptions.forEach(option => {

    option.addEventListener("change", function(){


        console.log("Delivery selected:", this.value);


        if(this.value === "express"){

            shipping = 99;

            shippingElement.textContent =
            "Express Delivery +₹99";

        }
        else{

    if(subtotal < 999){

        shipping = 50;

        shippingElement.textContent =
        "Delivery ₹50";

    }
    else{

        shipping = 0;

        shippingElement.textContent =
        "Standard Delivery FREE";

    }

}


        const finalTotal =
subtotal + shipping - discount + codCharge;


        totalElement.textContent =
        `₹${finalTotal}`;


    });

});
/* ==========================================
        PAYMENT VERIFICATION
========================================== */


// UPI VERIFY

const verifyUpi = document.getElementById("verifyUpi");

verifyUpi.addEventListener("click",()=>{

    const upiId = document.getElementById("upiId").value.trim();

    const selectedApp = document.getElementById("selectedUpiApp").innerText;


    if(selectedApp === "Select an app"){

        alert("Please select UPI app");

        return;

    }


    if(upiId === ""){

        alert("Please enter UPI ID");

        return;

    }


 
alert("UPI Payment Verified Successfully");

paymentVerified = true;

document.querySelector(".place-order-btn").disabled = false;

document.querySelector(".place-order-btn").innerHTML =
`
<i class="fa-solid fa-check"></i>
Place Order
`;

});


document.querySelectorAll(".upi-app").forEach(button => {

    button.addEventListener("click",()=>{

        document.getElementById("selectedUpiApp").innerText =
        button.dataset.app;

    });

});

// CARD VERIFY

const verifyCard = document.getElementById("verifyCard");

verifyCard.addEventListener("click",()=>{


    const cardNumber =
    document.getElementById("cardNumber").value.trim();


    const cardName =
    document.getElementById("cardName").value.trim();


    const expiry =
    document.getElementById("expiry").value.trim();


    const cvv =
    document.getElementById("cvv").value.trim();



    if(cardNumber === "" ||
       cardName === "" ||
       expiry === "" ||
       cvv === ""){


        alert("Please fill all card details");

        return;

    }


    alert("Card Payment Verified Successfully");
paymentVerified = true;

document.querySelector(".place-order-btn").disabled = false;

});





// NET BANKING

const verifyBank = document.getElementById("verifyBank");


verifyBank.addEventListener("click",()=>{


    const bank =
    document.getElementById("bankSelect").value;



    if(bank === ""){


        alert("Please select your bank");

        return;

    }


    alert("Net Banking Payment Verified Successfully");
paymentVerified = true;

document.querySelector(".place-order-btn").disabled = false;

});
document.getElementById("saveAddressBtn")
.addEventListener("click",()=>{

fetch(`http://localhost:3000/api/customers/update/${customer.customer_id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name: document.getElementById("fullName").value,
phone:document.getElementById("phone").value,
email:document.getElementById("email").value,
address:document.getElementById("address").value,
city:document.getElementById("city").value,
state:document.getElementById("state").value,
pincode:document.getElementById("pincode").value

})

})

.then(res=>res.json())

.then(data=>{

customer.full_name=document.getElementById("fullName").value;
customer.phone=document.getElementById("phone").value;
customer.email=document.getElementById("email").value;
customer.address=document.getElementById("address").value;
customer.city=document.getElementById("city").value;
customer.state=document.getElementById("state").value;
customer.pincode=document.getElementById("pincode").value;

localStorage.setItem(
"customer",
JSON.stringify(customer)
);

alert("Address Saved Successfully");

});

});
function disableShipping(){

    document.querySelectorAll(
        "#fullName,#phone,#email,#address,#city,#state,#pincode"
    ).forEach(field=>{

        field.readOnly = true;

    });
    document.querySelectorAll(
    "#fullName,#phone,#email,#address,#city,#state,#pincode"
).forEach(field => {

    field.disabled = true;

});

document.querySelector(".save-btn").style.display = "none";
document.querySelector(".edit-btn").style.display = "inline-block";

    document.querySelector(".save-btn").style.display = "none";
    document.querySelector(".edit-btn").style.display = "inline-block";

}
function editShipping(){

    document.querySelectorAll(
        "#fullName,#phone,#address,#city,#state,#pincode"
    ).forEach(field=>{

        field.readOnly = false;

    });
    document.querySelectorAll(
    "#fullName,#phone,#address,#city,#state,#pincode"
).forEach(field => {

    field.disabled = false;

});

// Keep email disabled
document.getElementById("email").disabled = true;

document.querySelector(".edit-btn").style.display = "none";
document.querySelector(".save-btn").style.display = "inline-block";

    document.querySelector(".edit-btn").style.display = "none";
    document.querySelector(".save-btn").style.display = "inline-block";

}
function saveShipping(){

    const customer = JSON.parse(localStorage.getItem("customer"));

    customer.name = document.getElementById("fullName").value;
    customer.phone = document.getElementById("phone").value;
    customer.email = document.getElementById("email").value;
    customer.address = document.getElementById("address").value;
    customer.city = document.getElementById("city").value;
    customer.state = document.getElementById("state").value;
    customer.pincode = document.getElementById("pincode").value;

    localStorage.setItem("customer", JSON.stringify(customer));

    alert("Shipping details updated.");
    fetch(`http://localhost:3000/api/customer/update/${customer.customer_id}`,{

    method:"PUT",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        full_name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode

    })

})
.then(res=>res.json())
.then(data=>console.log(data));

    disableShipping();

}