let currentProduct = null;


// ============================
// GET PRODUCT ID
// ============================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");


const container = document.getElementById("productDetails");



// ============================
// CHECK ID
// ============================

if(!id){

    container.innerHTML = `
        <h2>No product selected</h2>
    `;

    throw new Error("Product ID missing");

}



// ============================
// LOAD PRODUCT
// ============================

async function loadProduct(){

    try{


        const response = await fetch(
            `http://localhost:3000/api/products/${id}`
        );


        if(!response.ok){

            throw new Error("Product not found");

        }


        const product = await response.json();


        currentProduct = product;


        console.log(product);



        container.innerHTML = `


        <div class="product-container">


            <div>


                <img 
                src="http://localhost:3000${product.thumbnail}"
                alt="${product.product_name}">


            </div>




            <div>



                <span class="product-category">

                    ${product.category_name || "Product"}

                </span>




                <h1>

                    ${product.product_name}

                </h1>




                <div class="product-rating">

                    ★★★★★

                </div>





                <div class="product-price">


                    <h2>

                        ₹${product.final_price}

                    </h2>



                    <span class="old-price">

                        ₹${product.price}

                    </span>



                    <span class="discount">

                        ${product.discount}% OFF

                    </span>


                </div>





                <p class="product-description">

                    ${product.description}

                </p>





                <div class="delivery-box">


                    🚚 Delivery available in 5-7 days


                </div>





   <div class="action-buttons">

    <div id="cartAction">

        <button 
        class="cart-btn"
        onclick="addToCart()">

            Add To Cart

        </button>

    </div>


    <button 
    class="wish-btn"
    onclick="addToWishlist()">

        ❤️ Wishlist

    </button>

</div>



            </div>



        </div>


        `;



    }


    catch(error){


        console.log(error);


        container.innerHTML = `

            <h2>
                Product not found
            </h2>

        `;


    }


}



loadProduct();





// ============================
// ADD TO CART
// ============================

function addToCart(){

    const customer =
    JSON.parse(localStorage.getItem("customer"));


    if(!customer){

        showToast("Please login to continue.");

        return;

    }


    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


    let existing =
    cart.find(
        item => item.product_id == currentProduct.product_id
    );


    if(existing){

        existing.quantity++;

    }

    else{

cart.push({

    product_id: currentProduct.product_id,

    seller_id: currentProduct.seller_id,

    name: currentProduct.product_name,

    price: Number(currentProduct.final_price),

    image: currentProduct.thumbnail,

    quantity: 1

});

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    showToast("Product added to cart 🛒");


    updateCartButton();

}


function updateCartButton(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let item = cart.find(
        product => product.product_id == currentProduct.product_id
    );

    let box = document.getElementById("cartAction");

    if(!box) return;

    if(item){

        box.innerHTML = `

        <div class="quantity-box">

            <button onclick="decreaseQuantity()">-</button>

            <span>${item.quantity}</span>

            <button onclick="increaseQuantity()">+</button>

        </div>

        `;

    }else{

        box.innerHTML = `

        <button
        class="cart-btn"
        onclick="addToCart()">

            Add To Cart

        </button>

        `;

    }

}

// ============================
// WISHLIST
// ============================

function addToWishlist(){


    const customer =
    JSON.parse(localStorage.getItem("customer"));



    if(!customer){

        showToast("Please login to continue.");

        return;

    }




    let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];




    let exists =
    wishlist.find(
        item => item.product_id == currentProduct.product_id
    );




    if(exists){

        showToast("Already in wishlist ❤️");

        return;

    }





    wishlist.push({


        product_id:
        currentProduct.product_id,


        name:
        currentProduct.product_name,


        price:
        Number(currentProduct.final_price),


        image:
        currentProduct.thumbnail


    });





    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );



    showToast("Added to wishlist ❤️");

}




// ============================
// TOAST
// ============================

function showToast(message){


    const toast =
    document.getElementById("toast");



    if(!toast) return;



    toast.innerHTML = message;


    toast.classList.add("show");



    setTimeout(()=>{


        toast.classList.remove("show");


    },2000);


}
function increaseQuantity(){

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


    let item =
    cart.find(
        p => p.product_id == currentProduct.product_id
    );


    item.quantity++;


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartButton();

}




function decreaseQuantity(){

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


    let index =
    cart.findIndex(
        p => p.product_id == currentProduct.product_id
    );


    if(index !== -1){

        cart[index].quantity--;


        if(cart[index].quantity <= 0){

            cart.splice(index,1);

        }

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartButton();

}