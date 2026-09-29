/* ==========================================
        CHECK SELLER LOGIN
========================================== */

const seller = JSON.parse(localStorage.getItem("seller"));
const token = localStorage.getItem("sellerToken");

if (!seller || !token) {

    window.location.href = "seller-login.html";

}


/* ==========================================
        ELEMENTS
========================================== */

const ordersContainer = document.getElementById("ordersContainer");
const searchInput = document.getElementById("searchOrder");
const statusFilter = document.getElementById("statusFilter");

let allOrders = [];


/* ==========================================
        LOAD ORDERS
========================================== */

async function loadOrders() {

    try {

        const response = await fetch(

            `http://localhost:3000/api/orders/seller/${seller.seller_id}`,

            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        allOrders = data;

        displayOrders(allOrders);

    }

    catch (error) {

        console.log(error);

        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>Unable to load orders</h2>

                <p>Please try again later.</p>

            </div>

        `;

    }

}


/* ==========================================
        DISPLAY ORDERS
========================================== */

function displayOrders(orders) {

    if (orders.length === 0) {

        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <i class="fa-solid fa-box-open"></i>

                <h2>No Orders Yet</h2>

                <p>Your received orders will appear here.</p>

            </div>

        `;

        return;

    }

    ordersContainer.innerHTML = "";

    orders.forEach(order => {

        const statusClass = order.order_status.toLowerCase();

        ordersContainer.innerHTML += `

        <div class="order-card">

            <div class="order-top">

                <div>

                    <div class="order-id">

                        Order #${order.order_id}

                    </div>

                    <div class="order-date">

                        ${new Date(order.order_date).toLocaleDateString()}

                    </div>

                </div>

                <span class="status ${statusClass}">

                    ${order.order_status}

                </span>

            </div>


            <div class="order-body">


                <div class="order-section">

                    <h3>

                        Customer Details

                    </h3>

                    <p>

                        <strong>Name:</strong>

                        ${order.receiver_name}

                    </p>

                    <p>

                        <strong>Phone:</strong>

                        ${order.receiver_phone}

                    </p>

                    <p>

                        <strong>Address:</strong>

                        ${order.address_line},

                        ${order.city},

                        ${order.state}

                        -

                        ${order.pincode}

                    </p>

                </div>



                <div class="order-section">

                    <h3>

                        Product

                    </h3>

                    <div class="product-box">

                        <img
                        src="${order.thumbnail}"
                        alt="">

                        <div class="product-details">

                            <h4>

                                ${order.product_name}

                            </h4>

                            <p>

                                Quantity :
                                ${order.quantity}

                            </p>

                            <p>

                                Price :
                                ₹${order.price}

                            </p>

                        </div>

                    </div>

                </div>



         <div class="order-section">

    <h3>

        Payment Details

    </h3>

    <div class="amount">

        ₹${order.total_amount}

    </div>

    <p>

        <strong>Method:</strong>

        ${order.payment_method.toUpperCase()}

    </p>

    <div class="payment">

        ${order.payment_status}

    </div>

<div class="order-actions">

    ${
        order.order_status === "Confirmed"
        ?
        `
        <button 
        class="dispatch-btn"
        onclick="dispatchOrder(${order.order_id})">

            <i class="fa-solid fa-truck"></i>
            Dispatch Order

        </button>
        `
        :
        ""
    }


    ${
        order.order_status === "Shipped"
        ?
        `
        <button 
        class="deliver-btn"
        onclick="deliverOrder(${order.order_id})">

            <i class="fa-solid fa-check"></i>
            Mark Delivered

        </button>
        `
        :
        ""
    }


</div>

</div>
            </div>

        </div>

        `;

    });

}


/* ==========================================
        SEARCH
========================================== */

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = allOrders.filter(order =>

        order.product_name.toLowerCase().includes(value)

        ||

        order.receiver_name.toLowerCase().includes(value)

        ||

        order.order_id.toString().includes(value)

    );

    displayOrders(filtered);

});


/* ==========================================
        STATUS FILTER
========================================== */

statusFilter.addEventListener("change", () => {

    const status = statusFilter.value;

    if (status === "") {

        displayOrders(allOrders);

        return;

    }

    const filtered = allOrders.filter(order =>

        order.order_status === status

    );

    displayOrders(filtered);

});


/* ==========================================
        INITIAL LOAD
========================================== */
async function dispatchOrder(order_id){

    try{

        const response = await fetch(

            `http://localhost:3000/api/orders/dispatch/${order_id}`,

            {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        const data = await response.json();

        alert(data.message);

        loadOrders();


    }
    catch(error){

        console.log(error);

    }

}



async function deliverOrder(order_id){

    try{

        const response = await fetch(

            `http://localhost:3000/api/orders/deliver/${order_id}`,

            {
                method:"PUT",
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        const data = await response.json();

        alert(data.message);

        loadOrders();


    }
    catch(error){

        console.log(error);

    }

}
loadOrders();