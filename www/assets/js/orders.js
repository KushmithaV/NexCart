const ordersContainer = document.getElementById("ordersList");


const customer = JSON.parse(localStorage.getItem("customer"));


if(!customer){

    window.location.href = "customer-login.html";

}


// support both formats
const customerId = customer.customer_id || customer.id;


fetch(`http://localhost:3000/api/orders/customer/${customerId}`)


.then(res => res.json())


.then(orders=>{


    console.log("ORDERS:", orders);



    if(!orders || orders.length === 0){


        ordersContainer.innerHTML = `

        <div class="empty">
            No orders found
        </div>

        `;

        return;

    }



    let html = "";



    orders.forEach(order=>{


        html += `


        <div class="order-card">


            <div class="order-header">


                <h2>
                    Order #${order.order_id}
                </h2>


              <span class="status ${order.order_status.toLowerCase()}">

${
    order.order_status === "Placed"
        ? "Pending Approval"
        : order.order_status
}

</span>


            </div>




            <div class="product">


                <img 
                src="http://localhost:3000${order.thumbnail}"
                onerror="this.src='../assets/images/default.png'"
                >


                <div>


                    <h3>
                        ${order.product_name}
                    </h3>


                    <p>
                        Seller: ${order.shop_name}
                    </p>


                    <p>
                        Quantity: ${order.quantity}
                    </p>


                    <p>
                        Price: ₹${order.price}
                    </p>
                    <p>
    Payment Method:
    <b>${order.payment_method ? order.payment_method.toUpperCase() : "-"}</b>
</p>

<p>
    Payment Status:
    <span class="${order.payment_status === "Success" ? "paid" : "pending"}">
        ${order.payment_status || "-"}
    </span>
</p>


                </div>


            </div>




            <div class="amount">

                Total: ₹${order.total_amount}

            </div>





<div class="timeline">

    <div class="step ${["Placed","Confirmed","Shipped","Delivered"].includes(order.order_status) ? "active" : ""}">
        <div class="circle">✓</div>
        <p>Placed</p>
    </div>

    <div class="line"></div>

    <div class="step ${["Confirmed","Shipped","Delivered"].includes(order.order_status) ? "active" : ""}">
        <div class="circle">✔</div>
        <p>Confirmed</p>
    </div>

    <div class="line"></div>

    <div class="step ${["Shipped","Delivered"].includes(order.order_status) ? "active" : ""}">
        <div class="circle">🚚</div>
        <p>Shipped</p>
    </div>

    <div class="line"></div>

    <div class="step ${order.order_status==="Delivered" ? "active" : ""}">
        <div class="circle">🏠</div>
        <p>Delivered</p>
    </div>

</div>





            <div class="buttons">


                <button 
                class="track-btn">
                    Track Order
                </button>



${
    (order.order_status === "Placed" || order.order_status === "Confirmed")

    ?

    `
    <button 
    class="cancel-btn"
    data-id="${order.order_id}">
        Cancel Order
    </button>
    `

    :

    order.order_status === "Cancelled"

    ?

    `
    <button disabled>
        Cancelled
    </button>
    `

    :

    `
    <button disabled>
        Cannot Cancel
    </button>
    `

}



            </div>


        </div>


        `;


    });



    ordersContainer.innerHTML = html;




    // CANCEL ORDER

    document.querySelectorAll(".cancel-btn")
    .forEach(button=>{


        button.addEventListener("click",()=>{


            const id = button.dataset.id;


            if(confirm(
            "Cancel this order?\n95% refund will be processed."
            )){


                fetch(
                `http://localhost:3000/api/orders/cancel/${id}`,
                {
                    method:"PUT"
                }
                )


                .then(res=>res.json())


                .then(()=>{


                    alert(
                    "Order cancelled successfully.\n95% refund will be processed."
                    );


                    location.reload();


                });


            }


        });


    });




    // TRACK

    document.querySelectorAll(".track-btn")
    .forEach(button=>{


        button.onclick=()=>{

            alert("Tracking will update soon");

        };


    });



})


.catch(err=>{


    console.log(err);


    ordersContainer.innerHTML = `

    <div class="empty">
        Unable to load orders
    </div>

    `;


});