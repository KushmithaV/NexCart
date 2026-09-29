

const products = [

{
    id:1,
    name:"Wireless Noise Cancelling Headphones",
    category:"Electronics",
    price:2499,
    oldPrice:4999,
    discount:"-20%",
    rating:"★★★★★",
    reviews:248,
    image:"../assets/images/product1.png"
},

{
    id:2,
    name:"NexFit Smart Watch Pro Series Gold",
    category:"Electronics",
    price:2999,
    oldPrice:3599,
    discount:"-30%",
    rating:"★★★★★",
    reviews:180,
    image:"../assets/images/product2.png"
},

{
    id:3,
    name:"Premium UltraFlex Grey Running Shoes",
    category:"Fashion",
    price:2499,
    oldPrice:4499,
    discount:"-25%",
    rating:"★★★★☆",
    reviews:120,
    image:"../assets/images/product3.png"
},

{
    id:4,
    name:"UrbanShield Premium Laptop Backpack",
    category:"Accessories",
    price:999,
    oldPrice:1499,
    discount:"-35%",
    rating:"★★★★★",
    reviews:90,
    image:"../assets/images/product4.png"
}

];



const productContainer = document.getElementById("featuredProducts");



products.forEach(product => {


productContainer.innerHTML += `


<div class="product-card" onclick="openProduct(${product.product_id})">
<div class="product-image">


<span class="discount">
${product.discount}
</span>


<button
    class="wishlist"
    type="button"
    onclick="addWishlist(${product.id}); this.blur();">

    <i class="fa-regular fa-heart"></i>

</button>



<img src="${product.image}">


</div>



<div class="product-info">


<span class="category">
${product.category}
</span>


<h3>
${product.name}
</h3>



<div class="rating">

${product.rating}

<small>
(${product.reviews})
</small>

</div>



<div class="price">

<h4>
₹${product.price}
</h4>

<span>
₹${product.oldPrice}
</span>

</div>



<div id="cart-action-${product.id}">

<button class="cart-btn" onclick="increaseHome(${product.id})">

Add To Cart

</button>

</div>



</div>


</div>


`;

});



// ============================
// TOAST
// ============================

function showToast(message){

let toast=document.getElementById("toast");


toast.innerHTML=message;


toast.classList.add("show");


setTimeout(()=>{

toast.classList.remove("show");

},2000);

}



// ============================
// ADD CART
// ============================


function addCart(id){

    const customer = JSON.parse(localStorage.getItem("customer"));

    if(!customer){

        showToast("Please login to continue.");

 

        return;

    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let product = products.find(p => p.id === id);

    let existing = cart.find(item => item.id === id);

    if(existing){

        existing.quantity++;

    }

    else{

        cart.push({

            ...product,

            quantity:1

        });

    }

    localStorage.setItem("cart",JSON.stringify(cart));

    showToast("Product added to cart 🛒");

}



// ============================
// WISHLIST
// ============================


function addWishlist(id){

    const customer = JSON.parse(localStorage.getItem("customer"));

    if(!customer){

        showToast("Please login to continue.");

  

        return;

    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let product = products.find(p => p.id === id);

    let exists = wishlist.find(item => item.id === id);

    if(!exists){

        wishlist.push(product);

        localStorage.setItem("wishlist",JSON.stringify(wishlist));

        showToast("Added to wishlist ❤️");

    }

    else{

        showToast("Already in wishlist ❤️");

    }

}



// ============================
// GET QUANTITY
// ============================


function getQuantity(id){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


let item =
cart.find(product=>product.id===id);


return item ? item.quantity : 0;


}




// ============================
// HOME CART BUTTONS
// ============================


function increaseHome(id){

    addCart(id);

    updateCartButton(id);

}




function decreaseHome(id){


let cart =
JSON.parse(localStorage.getItem("cart")) || [];


let item =
cart.find(product=>product.id===id);



if(item){


item.quantity--;


if(item.quantity<=0){


cart =
cart.filter(product=>product.id!==id);


}


}



localStorage.setItem(
"cart",
JSON.stringify(cart)
);



updateCartButton(id);


}




function updateCartButton(id){


let box =
document.getElementById(`cart-action-${id}`);



if(!box) return;



let qty =
getQuantity(id);



if(qty>0){


box.innerHTML=`


<div class="cart-control">


<button onclick="decreaseHome(${id})">
-
</button>



<span class="quantity-number">
${qty}
</span>



<button onclick="increaseHome(${id})">
+
</button>



</div>


`;


}


else{


box.innerHTML=`


<button class="cart-btn" onclick="increaseHome(${id})">

Add To Cart

</button>


`;


}



}
