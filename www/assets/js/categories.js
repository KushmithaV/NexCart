/* ==========================================
        GET CATEGORY FROM URL
========================================== */

const params = new URLSearchParams(window.location.search);

const categoryId = params.get("id");


/* ==========================================
        PAGE ELEMENTS
========================================== */

const categoryTitle =
document.getElementById("categoryTitle");

const categoryHeroTitle =
document.getElementById("categoryHeroTitle");

const productGrid =
document.getElementById("productGrid");

const productCount =
document.getElementById("productCount");

const searchInput =
document.getElementById("searchProduct");


/* ==========================================
        CATEGORY NAMES
========================================== */

const categoryNames = {

    1:"Electronics",

    2:"Fashion",

    3:"Groceries",

    4:"Furniture",

    5:"Beauty",

    6:"Sports",


};


/* ==========================================
        LOAD PAGE TITLE
========================================== */

if(categoryId){

    categoryTitle.innerText =
    categoryNames[categoryId];

    categoryHeroTitle.innerText =
    categoryNames[categoryId];

}


/* ==========================================
        LOAD PRODUCTS
========================================== */

let allProducts=[];

async function loadProducts(){

try{

const response = await fetch(

`http://localhost:3000/api/products/category/${categoryId}`

);

const data = await response.json();

allProducts=data;

displayProducts(data);

}

catch(error){

console.log(error);

productGrid.innerHTML=`

<div class="empty-products">

Unable to load products.

</div>

`;

}

}

loadProducts();

function getCartQuantity(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = cart.find(
        product => product.product_id == productId
    );

    return item ? item.quantity : 0;

}
/* ==========================================
        DISPLAY PRODUCTS
========================================== */

function displayProducts(products){

productGrid.innerHTML="";

productCount.innerText=

`${products.length} Products Found`;

if(products.length===0){

productGrid.innerHTML=`

<div class="empty-products">

No products available.

</div>

`;

return;

}

products.forEach(product=>{

productGrid.innerHTML+=`

<div class="product-card">

<div class="product-image-box">

<button
type="button"
class="wishlist-icon"
onclick="toggleWishlist(${product.product_id}, this)">

<i class="${
isWishlisted(product.product_id)
? 'fa-solid fa-heart'
: 'fa-regular fa-heart'
}"></i>

</button>

<img

class="product-image"

src="${
product.thumbnail ||
'https://placehold.co/400x300?text=No+Image'
}">

</div>

<div class="product-details">

<h3 class="product-name">

${product.product_name}

</h3>

<p class="product-brand">

Brand :
${product.brand_name || "No Brand"}

</p>

<p class="product-seller">

Seller :
${product.shop_name}

</p>

<div class="price-section">

<span class="final-price">

₹${product.final_price}

</span>

${
product.discount>0 ?

`<span class="original-price">

₹${product.price}

</span>

<span class="discount">

${product.discount}% OFF

</span>`

:""

}

</div>

<p class="${
product.stock>0 ?

'stock'

:

'out-stock'

}">

${
product.stock>0 ?

`${product.stock} In Stock`

:

'Out Of Stock'

}

</p>

<div class="product-buttons">

<button class="view-btn" onclick="openProduct(${product.product_id})">
    View
</button>

${
getCartQuantity(product.product_id) > 0 ?

`

<div class="quantity-controls">

<button
onclick="decreaseQuantity(${product.product_id})">

-

</button>

<span>

${getCartQuantity(product.product_id)}

</span>

<button
onclick="increaseQuantity(${product.product_id})">

+

</button>

</div>

`

:

`

<button

class="cart-btn"

onclick="addToCart(${product.product_id})">

Add To Cart

</button>

`

}

</div>

</div>

</div>

`;

});

}


/* ==========================================
        SEARCH
========================================== */

searchInput.addEventListener("input",()=>{

const keyword=

searchInput.value.toLowerCase();

const filtered=

allProducts.filter(product=>

product.product_name
.toLowerCase()
.includes(keyword)

);

displayProducts(filtered);

});


/* ==========================================
        ADD TO CART
========================================== */

function addToCart(productId) {

    const customer = JSON.parse(localStorage.getItem("customer"));

    if(!customer){

        showToast("Please login to continue.");

        return;

    }

    const product = allProducts.find(
        p => p.product_id == productId
    );

    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
        item => item.product_id == productId
    );

    if(existing){

        existing.quantity++;

    }else{

   cart.push({

    product_id: product.product_id,

    product_name: product.product_name,

    seller_id: product.seller_id,

    price: Number(product.final_price),

    image: product.thumbnail ||

    "https://placehold.co/400x300?text=No+Image",

    quantity: 1

});

    }

    localStorage.setItem("cart",JSON.stringify(cart));

    showToast("Product added to cart");

    displayProducts(allProducts);

}
function increaseQuantity(productId){

    const customer = JSON.parse(localStorage.getItem("customer"));

    if(!customer){

        showToast("Please login to continue.");

        return;

    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = cart.find(
        product => product.product_id == productId
    );

    if(item){

        item.quantity++;

    }

    localStorage.setItem("cart",JSON.stringify(cart));

    displayProducts(allProducts);

}

function decreaseQuantity(productId){

    const customer = JSON.parse(localStorage.getItem("customer"));

    if(!customer){

        showToast("Please login to continue.");

        return;

    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex(
        product => product.product_id == productId
    );

    if(index>-1){

        cart[index].quantity--;

        if(cart[index].quantity<=0){

            cart.splice(index,1);

        }

    }

    localStorage.setItem("cart",JSON.stringify(cart));

    displayProducts(allProducts);

}
function toggleWishlist(productId, button){

    const customer = JSON.parse(localStorage.getItem("customer"));

    if(!customer){

        showToast("Please login to continue.");

        return;

    }

    const product = allProducts.find(
        p => p.product_id == productId
    );

    if(!product) return;

    let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

    const index = wishlist.findIndex(
        item => item.product_id == productId
    );

    if(index>-1){

        wishlist.splice(index,1);

        button.innerHTML =
        '<i class="fa-regular fa-heart"></i>';

        showToast("Removed from Wishlist");

    }else{

        wishlist.push({

            product_id: product.product_id,

            name: product.product_name,

            price: Number(product.final_price),

            image: product.thumbnail

        });

        button.innerHTML =
        '<i class="fa-solid fa-heart"></i>';

        showToast("Added to Wishlist");

    }

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}
function isWishlisted(productId){

    let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some(
        item => item.product_id == productId
    );

}
function openProduct(id){
    window.location.href = "product-details.html?id=" + id;
}