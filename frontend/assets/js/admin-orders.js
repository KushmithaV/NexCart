document.addEventListener("DOMContentLoaded",()=>{


const ordersBox = document.getElementById("ordersBox");



fetch("http://localhost:3000/api/orders/admin")

.then(res=>res.json())

.then(orders=>{


    ordersBox.innerHTML="";


    orders.forEach(order=>{


        ordersBox.innerHTML += `

        <div class="order-card">


            <div class="order-top">

                <div>

                    <h3>
                    Order #${order.order_id}
                    </h3>

                    <p>
                    Customer : ${order.customer_name}
                    </p>

                </div>


                <span class="status ${order.order_status.toLowerCase()}">

                    ${order.order_status}

                </span>


            </div>



            <div class="product-info">


<img src="http://localhost:3000${order.thumbnail}">

                <div>

                    <h4>
                    ${order.product_name}
                    </h4>


                    <p>
                    Quantity : ${order.quantity}
                    </p>


                   <p>
Seller : ${order.shop_name}
</p>

<p>
Payment Method : <b>${order.payment_method.toUpperCase()}</b>
</p>

<p>
Payment Status :
<span class="${order.payment_status === "Success" ? "paid" : "pending"}">
${order.payment_status}
</span>
</p>

                </div>


            </div>



            <div class="order-bottom">


                <h3>
                Amount : ₹${order.total_amount}
                </h3>


                <div>

                ${
order.order_status === "Placed"
                ?

                `
                <button 
class="confirm"
onclick="confirmOrder(${order.order_id})">
Confirm
</button>


                <button class="cancel"
                onclick="cancelOrder(${order.order_id})">
                Cancel
                </button>
                `

                :

                ""

                }


                </div>


            </div>


        </div>

        `;


    });


})

.catch(err=>{

console.log("Order loading error:",err);

});


});




// Confirm order

function confirmOrder(id){

fetch(`http://localhost:3000/api/orders/confirm/${id}`,{
    method:"PUT"
})

.then(res=>res.json())

.then(data=>{

    alert("Order Confirmed");

    location.reload();

})

.catch(err=>{

    console.log(err);

});

}


// Cancel order

function cancelOrder(id){


let check = confirm(
"Are you sure you want to cancel this order?"
);


if(check){

alert("Order "+id+" cancelled");

}


}