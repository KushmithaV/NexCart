/* ==========================================
        SHOW / HIDE PASSWORD
========================================== */

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggleSellerPassword");

if (passwordInput && togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");

        }

    });

}


/* ==========================================
        SELLER REGISTER
========================================== */

const sellerForm = document.getElementById("sellerRegisterForm");

if (sellerForm) {

sellerForm.addEventListener("submit", async (e) => {

e.preventDefault();

const sellerBtn = document.querySelector(".seller-btn");

sellerBtn.innerHTML = "Registering...";
sellerBtn.disabled = true;

const sellerData = {

fullname: document.getElementById("fullname").value.trim(),

email: document.getElementById("email").value.trim(),

phone: document.getElementById("phone").value.trim(),

shop_name: document.getElementById("shop_name").value.trim(),

gst_number: document.getElementById("gst_number").value.trim(),

address: document.getElementById("address").value.trim(),

city: document.getElementById("city").value.trim(),

state: document.getElementById("state").value.trim(),

pincode: document.getElementById("pincode").value.trim(),

password: document.getElementById("password").value

};

try{

const response = await fetch(
"http://localhost:3000/api/seller/register",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(sellerData)

});

const data = await response.json();

if(response.ok){

showToast("Seller Registered Successfully!", "success");

setTimeout(() => {

    window.location.href = "seller-login.html";

}, 1500);

}else{

showToast(data.message, "error");

}

}catch(error){

showToast("Unable to connect to server.", "error");
}

sellerBtn.innerHTML="Register as Seller";

sellerBtn.disabled=false;

});

}