/*====================================
        TOAST MESSAGE
====================================*/

function showToast(message,type){

    const toast=document.getElementById("toast");

    const text=document.getElementById("toastMessage");

    const icon=document.getElementById("toastIcon");

    text.innerHTML=message;

    toast.className="toast show "+type;

    if(type==="success"){

        icon.className="fa-solid fa-circle-check";

    }else{

        icon.className="fa-solid fa-circle-xmark";

    }

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}
/* ==========================================
        SHOW / HIDE PASSWORD
========================================== */

function setupPasswordToggle(inputId, iconId){

    const input=document.getElementById(inputId);
    const icon=document.getElementById(iconId);

    if(!input || !icon) return;

    icon.addEventListener("click",()=>{

        if(input.type==="password"){

            input.type="text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        }else{

            input.type="password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

}

setupPasswordToggle("password","togglePassword");
setupPasswordToggle("confirmPassword","toggleConfirmPassword");


/* ==========================================
                LOGIN
========================================== */

const loginForm=document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value.trim();

const loginBtn=document.querySelector(".login-btn");

loginBtn.innerHTML="Logging In...";
loginBtn.disabled=true;

try{

const response=await fetch("http://localhost:3000/api/auth/login",{
    method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email,
password

})

});


const data = await response.json();

console.log(data);

if(response.ok){

localStorage.setItem("token", data.token);
localStorage.setItem("customer", JSON.stringify(data.customer));

showToast("Login Successful!","success");

setTimeout(()=>{

window.location.href="index.html";

},1500);

window.location.href="index.html";

}else{

showToast(data.message, "error");}

}catch(err){

showToast("Unable to connect to server.","error");
}

loginBtn.innerHTML="Login";

loginBtn.disabled=false;

});

}


/* ==========================================
                REGISTER
========================================== */

const registerForm=document.getElementById("registerForm");

if(registerForm){

registerForm.addEventListener("submit",async(e)=>{

e.preventDefault();


const fullname=document.getElementById("fullname").value.trim();

const email=document.getElementById("email").value.trim();

const phone=document.getElementById("phone").value.trim();

const password=document.getElementById("password").value;

const confirmPassword=document.getElementById("confirmPassword").value;



if(password!==confirmPassword){

showToast("Passwords do not match.","error");
return;

}


if(password.length<6){

showToast("Password should be at least 6 characters.","error");
return;

}



const registerBtn=document.querySelector(".login-btnn");

registerBtn.innerHTML="Creating Account...";
registerBtn.disabled=true;



try{


const response = await fetch("http://localhost:3000/api/auth/register", {

    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        fullname,
        email,
        phone,
        password

    })

});



const data = await response.json();


console.log(data);



if(response.ok){


showToast(data.message,"success");


setTimeout(()=>{

window.location.href="login.html";

},1500);



}else{


showToast(data.message,"error");


}



}catch(err){


console.log(err);

showToast("Unable to connect to server.","error");


}



registerBtn.innerHTML="Create Account";

registerBtn.disabled=false;



});

}