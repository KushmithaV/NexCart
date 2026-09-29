let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const container = document.getElementById("wishlistItems");



function displayWishlist(){


    container.innerHTML = "";



    if(wishlist.length === 0){


        container.innerHTML = `


        <div class="empty-wishlist">
            <a href="index.html">
            Continue Shopping
            </a>


        </div>


        `;


        return;


    }





    wishlist.forEach((item,index)=>{


        container.innerHTML += `



        <div class="wishlist-card">


            <img src="${item.image}">



            <div class="wishlist-info">


                <h3>
                ${item.name}
                </h3>



                <p class="wishlist-price">
                ₹${item.price}
                </p>



                <div class="wishlist-actions">



                    <button class="move-cart"
                    onclick="moveToCart(${index})">

                    Add To Cart

                    </button>



                    <button class="remove-wish"
                    onclick="removeWishlist(${index})">

                    Remove

                    </button>



                </div>



            </div>



        </div>


        `;



    });



}




function moveToCart(index){


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    let product = wishlist[index];


    let existing = cart.find(
        item=>item.id===product.id
    );



    if(existing){


        existing.quantity++;


    }
    else{


        cart.push({

            ...product,

            quantity:1

        });


    }



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    removeWishlist(index);


}





function removeWishlist(index){


    wishlist.splice(index,1);



    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );



    displayWishlist();


}





displayWishlist();