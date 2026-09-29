/* ==========================================
        CHECK ADMIN LOGIN
========================================== */

const admin = JSON.parse(localStorage.getItem("admin"));
const token = localStorage.getItem("adminToken");

if (!admin || !token) {

    window.location.href = "admin-login.html";

}


/* ==========================================
        LOAD PENDING SELLERS
========================================== */

async function loadPendingSellers() {

    try {

        const response = await fetch(

            "http://localhost:3000/api/admin/pending-sellers"

        );

        const sellers = await response.json();

        const table =
            document.getElementById("sellerTable");

        table.innerHTML = "";

        if (sellers.length === 0) {

            table.innerHTML = `

            <tr>

                <td colspan="8" style="text-align:center">

                    No Pending Sellers

                </td>

            </tr>

            `;

            return;

        }

        sellers.forEach((seller) => {

            table.innerHTML += `

            <tr>

                <td>${seller.seller_id}</td>

                <td>${seller.full_name}</td>

                <td>${seller.shop_name}</td>

                <td>${seller.email}</td>

                <td>${seller.phone}</td>

                <td>${seller.city}</td>

                <td>

                    <span class="${seller.status.toLowerCase()}">

                        ${seller.status}

                    </span>

                </td>

                <td>

                    <button
                    class="action-btn approve-btn"
                    onclick="updateSeller(${seller.seller_id},'Approved')">

                        <i class="fa-solid fa-check"></i>

                    </button>

                    <button
                    class="action-btn reject-btn"
                    onclick="updateSeller(${seller.seller_id},'Rejected')">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                    <button
                    class="action-btn block-btn"
                    onclick="updateSeller(${seller.seller_id},'Blocked')">

                        <i class="fa-solid fa-ban"></i>

                    </button>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}


/* ==========================================
        UPDATE SELLER STATUS
========================================== */

async function updateSeller(id, status) {

    try {

        const response = await fetch(

            "http://localhost:3000/api/admin/update-seller",

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    seller_id: id,

                    status: status

                })

            }

        );

        const data = await response.json();

        alert(data.message);

        loadPendingSellers();

    }

    catch (error) {

        console.log(error);

    }

}


/* ==========================================
        START
========================================== */

loadPendingSellers();