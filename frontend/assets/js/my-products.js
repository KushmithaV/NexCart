/* ==========================================
        CHECK SELLER LOGIN
========================================== */

const seller = JSON.parse(localStorage.getItem("seller"));

if (!seller) {

    window.location.href = "seller-login.html";

}

/* ==========================================
        LOAD MY PRODUCTS
========================================== */

async function loadProducts() {

    try {

        const response = await fetch(

            `http://localhost:3000/api/products/seller/${seller.seller_id}`

        );

        const products = await response.json();

        const productGrid = document.getElementById("productGrid");

        productGrid.innerHTML = "";

        if (products.length === 0) {

            productGrid.innerHTML = `

                <h2 style="text-align:center;width:100%;margin-top:80px;">

                    No Products Added Yet

                </h2>

            `;

            return;

        }

        products.forEach(product => {

            productGrid.innerHTML += `

            <div class="product-card">
            

                <img src="${product.thumbnail || '../assets/images/default-product.jpg'}"

                <div class="product-info">
                

                    <h3>${product.product_name}</h3>

                    <p>${product.category_name}</p>

                    <p>${product.brand_name}</p>

                    <div class="price">

                        ₹${product.final_price}

                    </div>
                    

                    <span class="stock">

                        Stock : ${product.stock}

                    </span>
                                            <span class="status ${product.status.toLowerCase()}">
${product.status}
</span>
                    

                    <div class="actions">

                        <button

                            class="edit-btn"

                            onclick="openEdit(${product.product_id},
                            '${product.product_name}',
                            \`${product.description}\`,
                            ${product.price},
                            ${product.discount},
                            ${product.stock})">

                            Edit

                        </button>
                        

                        <button

                            class="delete-btn"

                            onclick="deleteProduct(${product.product_id})">

                            Delete

                        </button>


                    </div>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

        showToast("Unable to load products","error");

    }

}

loadProducts();

/* ==========================================
            EDIT MODAL
========================================== */

const modal = document.getElementById("editModal");

document.querySelector(".close").onclick = () => {

    modal.style.display = "none";

};

function openEdit(

    id,
    name,
    description,
    price,
    discount,
    stock

){

    modal.style.display = "flex";

    document.getElementById("editProductId").value = id;

    document.getElementById("editName").value = name;

    document.getElementById("editDescription").value = description;

    document.getElementById("editPrice").value = price;

    document.getElementById("editDiscount").value = discount;

    document.getElementById("editStock").value = stock;

}

/* ==========================================
        UPDATE PRODUCT
========================================== */

document.getElementById("editForm")

.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const id = document.getElementById("editProductId").value;

    const body = {

        product_name:document.getElementById("editName").value,

        description:document.getElementById("editDescription").value,

        price:document.getElementById("editPrice").value,

        discount:document.getElementById("editDiscount").value,

        stock:document.getElementById("editStock").value

    };

    const response = await fetch(

        `http://localhost:3000/api/products/update/${id}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(body)

        }

    );

    const data = await response.json();

    showToast(data.message,"success");

    modal.style.display="none";

    loadProducts();

});

/* ==========================================
        DELETE PRODUCT
========================================== */

async function deleteProduct(id){

    if(!confirm("Delete this product?")){

        return;

    }

    const response = await fetch(

        `http://localhost:3000/api/products/delete/${id}`,

        {

            method:"DELETE"

        }

    );

    const data = await response.json();

    showToast(data.message,"success");

    loadProducts();

}