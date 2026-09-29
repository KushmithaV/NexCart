/* ==========================================
        SHOW / HIDE PASSWORD
========================================== */

const sellerPassword =
document.getElementById("password");

const sellerToggle =
document.getElementById("toggleSellerLoginPassword");

if(sellerPassword && sellerToggle){

sellerToggle.addEventListener("click",()=>{

if(sellerPassword.type==="password"){

sellerPassword.type="text";

sellerToggle.classList.remove("fa-eye");

sellerToggle.classList.add("fa-eye-slash");

}else{

sellerPassword.type="password";

sellerToggle.classList.remove("fa-eye-slash");

sellerToggle.classList.add("fa-eye");

}

});

}


/* ==========================================
            SELLER LOGIN
========================================== */

const sellerLoginForm =
document.getElementById("sellerLoginForm");

if(sellerLoginForm){

sellerLoginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const loginBtn =
document.querySelector(".seller-btn");

loginBtn.innerHTML="Logging In...";

loginBtn.disabled=true;

const email =
document.getElementById("email").value.trim();

const password =
document.getElementById("password").value;

try{

const response = await fetch("http://localhost:3000/api/seller/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email,
        password
    })
});

const data = await response.json();

if(response.ok){

localStorage.setItem(

"sellerToken",

data.token

);

localStorage.setItem(

"seller",

JSON.stringify(data.seller)

);

showToast(

"Login Successful",

"success"

);

setTimeout(()=>{

window.location.href="seller-dashboard.html";

},1200);

}else{

showToast(

data.message,

"error"

);

}

}catch(error){

showToast(

"Unable to connect to server.",

"error"

);

}

loginBtn.innerHTML="Login to Dashboard";

loginBtn.disabled=false;

});

}