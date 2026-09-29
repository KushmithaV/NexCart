/* ==========================================
        CHECK ADMIN LOGIN
========================================== */

const admin = JSON.parse(localStorage.getItem("admin"));
const token = localStorage.getItem("adminToken");

if (!admin || !token) {

    window.location.href = "admin-login.html";

}

/* ==========================================
        LOGOUT
========================================== */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (e) => {

    e.preventDefault();

    localStorage.removeItem("admin");

    localStorage.removeItem("adminToken");

    window.location.href = "admin-login.html";

});


/* ==========================================
        LOAD DASHBOARD
========================================== */

async function loadDashboard() {

    try {

        const response = await fetch(

            "http://localhost:3000/api/admin/dashboard"

        );

        const data = await response.json();

        document.getElementById("sellerCount").innerText =
            data.totalSellers;

        document.getElementById("productCount").innerText =
            data.totalProducts;

        document.getElementById("customerCount").innerText =
            data.totalCustomers;

        document.getElementById("orderCount").innerText =
            data.totalOrders;
       // document.getElementById("revenue").innerText =
  //  "₹" + data.totalRevenue;

        loadRecentSellers(data.recentSellers);

    }

    catch (error) {

        console.log(error);

    }
    

}


/* ==========================================
        RECENT SELLERS
========================================== */

function loadRecentSellers(sellers) {

    const table =
    document.getElementById("sellerTable");

    table.innerHTML = "";

    sellers.forEach((seller) => {

        table.innerHTML += `

        <tr>

            <td>${seller.full_name}</td>

            <td>${seller.shop_name}</td>

            <td>

                <span class="${seller.status.toLowerCase()}">

                    ${seller.status}

                </span>

            </td>

        </tr>

        `;

    });

}


/* ==========================================
        START
========================================== */

loadDashboard();
async function loadRecentActivity(){

    const res = await fetch(
        "http://localhost:3000/api/activity"
    );

    const activities = await res.json();


    document.getElementById("recentActivity").innerHTML =
    activities.map(activity=>`

        <div class="activity-item">

            <i class="fa-solid fa-clock"></i>

            <div>
                <p>${activity.activity_message}</p>

                <small>
                ${new Date(activity.created_at).toLocaleString()}
                </small>

            </div>

        </div>

    `).join("");

}


loadRecentActivity();
/* ==========================================
        ADMIN NOTIFICATIONS
========================================== */

const bell = document.getElementById("notificationBell");
const dropdown = document.getElementById("notificationDropdown");
const count = document.getElementById("notificationCount");
const notificationList =
document.getElementById("notificationList");

async function loadNotifications() {

    try {

        const res = await fetch(
            "http://localhost:3000/api/orders/admin-notifications"
        );

        const notifications = await res.json();

        notificationList.innerHTML = "";

        if (notifications.length === 0) {

            notificationList.innerHTML = `
                <div class="notification-item">
                    <p>No notifications</p>
                </div>
            `;

            count.style.display = "none";

            return;

        }

        count.style.display = "flex";
        count.innerText = notifications.length;

        notifications.forEach(notification => {

            notificationList.innerHTML += `

                <div class="notification-item">

                    <h4>${notification.title}</h4>

                    <p>${notification.message}</p>

                    <small>
                        ${new Date(notification.created_at).toLocaleString()}
                    </small>

                </div>

            `;

        });

    }

    catch (err) {

        console.log(err);

    }

}
bell.addEventListener("click", () => {

    if (dropdown.style.display === "block") {

        dropdown.style.display = "none";

    } else {

        dropdown.style.display = "block";

    }

});
loadNotifications();

setInterval(loadNotifications, 5000);
document.getElementById("markReadBtn").addEventListener("click", async () => {

    try{

        const res = await fetch(
            "http://localhost:3000/api/orders/admin-notifications/read",
            {
                method:"PUT"
            }
        );

        const data = await res.json();

        console.log(data);

        dropdown.style.display = "none";

        loadNotifications();

    }

    catch(err){

        console.log(err);

    }

});
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", function (event) {

    event.stopPropagation();

    sidebar.classList.toggle("open");

});


// CLICK OUTSIDE SIDEBAR
document.addEventListener("click", function (event) {

    if (!sidebar.classList.contains("open")) {
        return;
    }

    if (
        !sidebar.contains(event.target) &&
        event.target !== menuToggle &&
        !menuToggle.contains(event.target)
    ) {

        sidebar.classList.remove("open");

    }

});


// CLICK SIDEBAR LINK
sidebar.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

        sidebar.classList.remove("open");

    });

});