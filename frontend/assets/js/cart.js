let cart = JSON.parse(localStorage.getItem("cart")) || [];

console.log(cart);
const container=document.getElementById("cartItems");

const total=document.getElementById("total");

const subtotal=document.getElementById("subtotal");

const empty=document.getElementById("emptyCart");

const layout=document.getElementById("cartLayout");





function displayCart(){


container.innerHTML="";


let amount=0;



if(cart.length===0){


empty.style.display="flex";

layout.style.display="none";


return;


}


empty.style.display="none";

layout.style.display="grid";




cart.forEach((item,index)=>{


let qty=item.quantity || 1;


amount += item.price * qty;



container.innerHTML += `


<div class="cart-item">


<img src="${item.image}">



<div class="cart-details">


<h3>
    ${item.product_name || item.name || item.title || "Product"}
</h3>



<p class="cart-price">
₹${item.price}
</p>




<div class="quantity-box">


<button onclick="decrease(${index})">
-
</button>


<span>
${qty}
</span>



<button onclick="increase(${index})">
+
</button>


</div>



<button class="remove-btn"
onclick="removeItem(${index})">

Remove

</button>



</div>


</div>


`;



});



subtotal.innerHTML="₹"+amount;

total.innerHTML="₹"+amount;



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



}




function increase(index){


cart[index].quantity =
(cart[index].quantity || 1)+1;


displayCart();


}





function decrease(index){


if(cart[index].quantity>1){


cart[index].quantity--;


}

else{


cart.splice(index,1);


}


displayCart();


}





function removeItem(index){


cart.splice(index,1);


displayCart();


}




function checkout(){


if(cart.length===0){

alert("Your cart is empty");

return;

}


window.location.href="checkout.html";


}




displayCart();