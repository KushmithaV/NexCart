/* ==========================================
        CHECK SELLER LOGIN
========================================== */

const seller = JSON.parse(localStorage.getItem("seller"));
const token = localStorage.getItem("sellerToken");

console.log("Logged in seller:", seller);

if (!seller || !token) {

    window.location.href = "seller-login.html";

}

/* ==========================================
        DISPLAY SELLER NAME
========================================== */

const sellerName = document.getElementById("sellerName");

if (sellerName) {

    sellerName.innerText = seller.full_name;

}

/* ==========================================
        LOAD DASHBOARD
========================================== */

async function loadDashboard() {

    try {

        const response = await fetch(

            `http://localhost:3000/api/products/seller/${seller.seller_id}`

        );

        const products = await response.json();


        document.getElementById("totalProducts").innerText =
            products.length;



        // ===============================
        // LOAD SELLER REVENUE
        // ===============================

        const revenueResponse = await fetch(

            `http://localhost:3000/api/orders/seller-revenue/${seller.seller_id}`

        );


        const revenueData = await revenueResponse.json();


        document.getElementById("totalRevenue").innerText =

            "₹" + (revenueData.totalRevenue || 0);

// ===============================
// LOAD SELLER ORDERS COUNT
// ===============================

const ordersResponse = await fetch(

    `http://localhost:3000/api/orders/seller-orders-count/${seller.seller_id}`

);

const ordersData = await ordersResponse.json();


document.getElementById("totalOrders").innerText =
    ordersData.totalOrders || 0;

    }
    

    catch (error) {

        console.log("Dashboard Error:", error);

    }

}

loadDashboard();

/* ==========================================
            LOGOUT
========================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", (e) => {

        e.preventDefault();

        localStorage.removeItem("seller");
        localStorage.removeItem("sellerToken");

        window.location.href = "seller-login.html";

    });

}

/* ==========================================
        QUICK ACTIONS
========================================== */

const actionCards = document.querySelectorAll(".action-card");

if (actionCards.length > 0) {

    actionCards[0].addEventListener("click", (e) => {

        e.preventDefault();

        window.location.href = "add-product.html";

    });

    actionCards[1].addEventListener("click", (e) => {

        e.preventDefault();

        window.location.href = "my-products.html";

    });

    actionCards[2].addEventListener("click", (e) => {

        e.preventDefault();

        window.location.href = "seller-orders.html";

    });

    actionCards[3].addEventListener("click", (e) => {

        e.preventDefault();

        window.location.href = "seller-profile.html";

    });

}

/* ==========================================
        SIDEBAR ACTIVE MENU
========================================== */

const menuLinks = document.querySelectorAll(".menu li a");

menuLinks.forEach(link => {

    link.addEventListener("click", function () {

        menuLinks.forEach(item => {

            item.parentElement.classList.remove("active");

        });

        this.parentElement.classList.add("active");

    });

});

/* ==========================================
        LOAD RECENT ACTIVITY
========================================== */

async function loadRecentActivity() {

    try {

        const response = await fetch(

            `http://localhost:3000/api/activity/${seller.seller_id}`

        );

        const activities = await response.json();

        const activityBox = document.getElementById("recentActivity");

        if (!activityBox) return;

        if (activities.length === 0) {

            activityBox.innerHTML = `

                <i class="ri-information-line"></i>

                <p>No recent activity available.</p>

            `;

            return;

        }

        activityBox.innerHTML = activities.map(activity => `

            <div class="activity-item">

                <i class="ri-history-line"></i>

                <div>

                    <p>${activity.activity_message}</p>

                    <small>

                        ${new Date(activity.created_at).toLocaleString()}

                    </small>

                </div>

            </div>

        `).join("");

    }

    catch (error) {

        console.log("Activity Error:", error);

    }

}

loadRecentActivity();
/* ==========================================
        SELLER NOTIFICATIONS
========================================== */

const bell = document.getElementById("notificationBell");
const dropdown = document.getElementById("notificationDropdown");
const count = document.getElementById("notificationCount");
const notificationList = document.getElementById("notificationList");

async function loadNotifications(){

    try{

        const res = await fetch(

            `http://localhost:3000/api/orders/seller-notifications/${seller.seller_id}`

        );

        const notifications = await res.json();

        notificationList.innerHTML = "";

        if(notifications.length === 0){

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

        notifications.forEach(notification=>{

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

    catch(err){

        console.log(err);

    }

}

bell.addEventListener("click",()=>{

    dropdown.classList.toggle("show");

});
document.getElementById("markReadBtn").addEventListener("click", async()=>{

    try{

await fetch(
    `http://localhost:3000/api/orders/seller-notifications/read/${seller.seller_id}`,
    {
        method:"PUT",
        headers:{
            "Authorization": `Bearer ${token}`
        }
    }
);


        // hide notification count
        count.style.display = "none";


        // close dropdown
        dropdown.style.display = "none";


        // show empty notification next time
        notificationList.innerHTML = `
            <div class="notification-item">
                <p>No notifications</p>
            </div>
        `;





    }
    catch(err){
        console.log(err);
    }

});

loadNotifications();

//setInterval(loadNotifications,5000);