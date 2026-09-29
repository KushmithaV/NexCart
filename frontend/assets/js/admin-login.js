/* ==========================================
        SHOW / HIDE PASSWORD
========================================== */

const passwordInput =
document.getElementById("password");

const togglePassword =
document.getElementById("toggleAdminPassword");

togglePassword.addEventListener("click", () => {

if(passwordInput.type==="password"){

passwordInput.type="text";

togglePassword.classList.remove("fa-eye");

togglePassword.classList.add("fa-eye-slash");

}else{

passwordInput.type="password";

togglePassword.classList.remove("fa-eye-slash");

togglePassword.classList.add("fa-eye");

}

});


/* ==========================================
        ADMIN LOGIN
========================================== */

const adminLoginForm =
document.getElementById("adminLoginForm");

adminLoginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const username =
document.getElementById("username").value.trim();

const password =
document.getElementById("password").value;

const response = await fetch(

"http://localhost:3000/api/admin/login",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

username,

password

})

}

);

const data = await response.json();

if(response.ok){

localStorage.setItem(

"adminToken",

data.token

);

localStorage.setItem(

"admin",

JSON.stringify(data.admin)

);

showToast(

"Login Successful",

"success"

);

setTimeout(()=>{

window.location.href=

"admin-dashboard.html";

},1200);

}else{

showToast(

data.message,

"error"

);

}

});