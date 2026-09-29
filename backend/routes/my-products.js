/* ==========================================
        CHECK SELLER LOGIN
========================================== */

const seller = JSON.parse(localStorage.getItem("seller"));

if (!seller) {

    window.location.href = "seller-login.html";

}

/* ==========================================
        API URL
========================================== */

const API = "http://localhost:3000/api/products";

/* ==========================================
        LOAD PRODUCTS
========================================== */

async function loadProducts() {

    try {

        const response = await fetch(

            `${API}/seller/${seller.seller_id}`

        );

        const products = await response.json();

        const productGrid = document.getElementById("productGrid");

        productGrid.innerHTML = "";

        if(products.length===0){

            productGrid.innerHTML=`

            <h2 style="text-align:center;width:100%;">

                No Products Added Yet

            </h2>

            `;

            return;

        }

        products.forEach(product=>{

            productGrid.innerHTML += `

            <div class="product-card">

                <img src="${
                    product.thumbnail ||
                    'https://placehold.co/400x250?text=No+Image'
                }">

                <div class="product-info">

                    <h3>${product.product_name}</h3>

                    <p>

                        <b>Brand:</b>

                        ${product.brand_name}

                    </p>

                    <p>

                        <b>Category:</b>

                        ${product.category_name}

                    </p>

                    <div class="price">

                        ₹${product.final_price || product.price}

                    </div>

                    <span class="stock">

                        Stock : ${product.stock}

                    </span>

                    <div class="actions">

                        <button

                        class="edit-btn"

                        onclick='openEdit(${JSON.stringify(product)})'>

                            <i class="fa-solid fa-pen"></i>

                            Edit

                        </button>

                        <button

                        class="delete-btn"

                        onclick="deleteProduct(${product.product_id})">

                            <i class="fa-solid fa-trash"></i>

                            Delete

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

        showToast(

            "Unable to load products",

            "error"

        );

    }

}

/* ==========================================
        DELETE PRODUCT
========================================== */

async function deleteProduct(id){

    if(!confirm("Delete this product?")){

        return;

    }

    try{

        const response=await fetch(

            `${API}/delete/${id}`,

            {

                method:"DELETE"

            }

        );

        const data=await response.json();

        showToast(

            data.message,

            "success"

        );

        loadProducts();

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================================
        EDIT PRODUCT
========================================== */

const modal=document.getElementById("editModal");

const close=document.querySelector(".close");

close.onclick=()=>{

    modal.style.display="none";

};

function openEdit(product){

    modal.style.display="flex";

    document.getElementById("editProductId").value=
    product.product_id;

    document.getElementById("editName").value=
    product.product_name;

    document.getElementById("editDescription").value=
    product.description;

    document.getElementById("editPrice").value=
    product.price;

    document.getElementById("editDiscount").value=
    product.discount;

    document.getElementById("editStock").value=
    product.stock;

}

/* ==========================================
        UPDATE PRODUCT
========================================== */

document.getElementById("editForm")

.addEventListener("submit",async(e)=>{

e.preventDefault();

const id=document.getElementById("editProductId").value;

const updatedProduct={

product_name:
document.getElementById("editName").value,

description:
document.getElementById("editDescription").value,

price:
document.getElementById("editPrice").value,

discount:
document.getElementById("editDiscount").value,

stock:
document.getElementById("editStock").value

};

try{

const response=await fetch(

`${API}/update/${id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(updatedProduct)

}

);

const data=await response.json();

showToast(

data.message,

"success"

);

modal.style.display="none";

loadProducts();

}catch(error){

console.log(error);

}

});

/* ==========================================
        PAGE LOAD
========================================== */

loadProducts();