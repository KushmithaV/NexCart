document.addEventListener("DOMContentLoaded", () => {


    const seller = JSON.parse(localStorage.getItem("seller"));


    // Check login
    if (!seller || !seller.seller_id) {

        alert("Seller session expired");

        window.location.href = "seller-login.html";

        return;

    }



    console.log("Logged seller:", seller);



    // =====================================
    // LOAD SELLER PROFILE
    // =====================================

    async function loadProfile() {


        try {


            const response = await fetch(

                `http://localhost:3000/api/seller/profile/${seller.seller_id}`

            );


            const data = await response.json();


            console.log("Profile response:", data);



            if (!response.ok) {

                alert(data.message || "Unable to load profile");

                return;

            }



            document.getElementById("full_name").value =
                data.full_name || "";

            document.getElementById("email").value =
                data.email || "";

            document.getElementById("phone").value =
                data.phone || "";

            document.getElementById("shop_name").value =
                data.shop_name || "";

            document.getElementById("gst_number").value =
                data.gst_number || "";

            document.getElementById("address").value =
                data.address || "";

            document.getElementById("city").value =
                data.city || "";

            document.getElementById("state").value =
                data.state || "";

            document.getElementById("pincode").value =
                data.pincode || "";


        }


        catch(error) {


            console.log(
                "Profile loading error:",
                error
            );


            alert("Server connection failed");


        }


    }



    loadProfile();





    // =====================================
    // UPDATE SELLER PROFILE
    // =====================================


    document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {


        e.preventDefault();



        const updatedData = {


            phone:
            document.getElementById("phone").value,


            address:
            document.getElementById("address").value,


            city:
            document.getElementById("city").value,


            state:
            document.getElementById("state").value,


            pincode:
            document.getElementById("pincode").value


        };



        console.log(
            "Updating:",
            updatedData
        );



        try {



            const response = await fetch(


                `http://localhost:3000/api/seller/profile/${seller.seller_id}`,


                {

                    method:"PUT",


                    headers:{

                        "Content-Type":"application/json"

                    },


                    body:
                    JSON.stringify(updatedData)

                }


            );



            const result = await response.json();



            console.log(
                "Update response:",
                result
            );



            if(response.ok){


                alert(
                    "Profile updated successfully"
                );


            }


            else{


                alert(
                    result.message ||
                    "Update failed"
                );


            }



        }


        catch(error){


            console.log(
                "Update error:",
                error
            );


            alert(
                "Server connection failed"
            );


        }



    });



});