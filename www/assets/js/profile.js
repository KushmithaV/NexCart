console.log("PROFILE JS LOADED");
const customer = JSON.parse(localStorage.getItem("customer"));

if (!customer) {
    window.location.href = "customer-login.html";
}



async function loadProfile(){

    try{

const response = await fetch(
    `http://localhost:3000/api/customer/profile/${customer.customer_id}`
);

        const data = await response.json();

        console.log("PROFILE DATA:", data);


        document.getElementById("customerName").textContent =
            data.full_name;


        document.getElementById("customerEmail").textContent =
            data.email;


        document.getElementById("avatar").textContent =
            data.full_name.charAt(0).toUpperCase();



        document.getElementById("fullName").value =
            data.full_name || "";

        document.getElementById("email").value =
            data.email || "";

        document.getElementById("phone").value =
            data.phone || "";

        document.getElementById("address").value =
            data.address || "";

        document.getElementById("city").value =
            data.city || "";

        document.getElementById("state").value =
            data.state || "";

        document.getElementById("pincode").value =
            data.pincode || "";


        disableEdit();


    }
    catch(err){

        console.log(err);

    }

}


loadProfile();





// disable fields initially

function disableEdit(){

    document.querySelectorAll(
        "#fullName,#phone,#city,#state,#pincode,#address"
    )
    .forEach(field=>{

        field.disabled=true;

    });


    document.querySelector(".save-btn").style.display="none";

}





// when Edit button clicked

function editProfile(){


    document.querySelectorAll(
        "#fullName,#phone,#city,#state,#pincode,#address"
    )
    .forEach(field=>{

        field.disabled=false;

    });


    document.querySelector(".save-btn").style.display="block";


    document.querySelector(".edit-btn").style.display="none";

}





async function saveProfile(){

const customer = JSON.parse(localStorage.getItem("customer"));

fetch(`http://localhost:3000/api/customer/update/${customer.customer_id}`,{

    method:"PUT",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        full_name:document.getElementById("fullName").value,
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
    customer.name = document.getElementById("fullName").value;
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

    alert(data.message);
    loadProfile();

});

}



function logout(){

    localStorage.removeItem("customer");

    localStorage.removeItem("token");

    window.location.href="customer-login.html";

}