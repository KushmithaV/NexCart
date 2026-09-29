const navCustomer = JSON.parse(localStorage.getItem("customer"));

const loginBtn = document.getElementById("loginBtn");
const loginText = document.getElementById("loginText");
const dropdownMenu = document.getElementById("dropdownMenu");
const loginDropdown = document.querySelector(".login-dropdown");


/* =====================================
        LOGIN / PROFILE DROPDOWN
===================================== */

if (navCustomer) {

    loginText.textContent = `Hi, ${(navCustomer.name || "Customer").split(" ")[0]}`;

    dropdownMenu.innerHTML = `

        <a href="profile.html">
            <i class="fa-solid fa-user"></i>
            My Profile
        </a>

        <a href="orders.html">
            <i class="fa-solid fa-box"></i>
            My Orders
        </a>

        <a href="#" id="logoutBtn">
            <i class="fa-solid fa-right-from-bracket"></i>
            Logout
        </a>

    `;

} else {

    loginText.textContent = "Login";

    dropdownMenu.innerHTML = `

        <a href="login.html">
            <i class="fa-solid fa-user"></i>
            Customer Login
        </a>

        <a href="seller-login.html">
            <i class="fa-solid fa-store"></i>
            Seller Login
        </a>

        <a href="admin-login.html">
            <i class="fa-solid fa-user-shield"></i>
            Admin Login
        </a>

    `;

}


/* =====================================
        LOGOUT
===================================== */

function logout(){

    localStorage.removeItem("customer");
    localStorage.removeItem("token");

    window.location.href="customer-login.html";

}


document.addEventListener("click", function (e) {

    if (e.target.closest("#logoutBtn")) {

        e.preventDefault();

        localStorage.removeItem("customer");
        localStorage.removeItem("token");

        window.location.href = "index.html";
    }

});


/* =====================================
        CART
===================================== */

function openCart() {

    if (navCustomer) {

        window.location.href = "cart.html";

    } else {

        window.location.href = "login-required.html";

    }

}


/* =====================================
        WISHLIST
===================================== */

function openWishlist() {

    if (navCustomer) {

        window.location.href = "wishlist.html";

    } else {

        window.location.href = "login-required.html";

    }

}