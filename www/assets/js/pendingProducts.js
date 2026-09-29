/* ==========================================
        LOAD PENDING PRODUCTS
========================================== */

async function loadProducts() {

    try {

        const response = await fetch(
            "http://localhost:3000/api/admin/products/pending"
        );

        const products = await response.json();

        const table = document.getElementById("productTable");

        table.innerHTML = "";

        if (products.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="8" class="empty">
                        No pending products available.
                    </td>
                </tr>
            `;

            return;

        }

        products.forEach(product => {

            table.innerHTML += `

            <tr>

                <td>

                    <img
                        class="product-image"
                        src="${product.thumbnail}"
                        alt="${product.product_name}"
                    >

                </td>

                <td>

                    <strong>${product.product_name}</strong>

                </td>

                <td>${product.shop_name}</td>

                <td>${product.category_name}</td>

                <td>${product.brand_name}</td>

                <td>

                    <strong>₹${product.price}</strong>

                </td>

                <td>

                    <span class="status">
                        ${product.status}
                    </span>

                </td>

                <td>

                    <div class="actions">

                        <button
                            class="action-btn approve"
                            onclick="approveProduct(${product.product_id})"
                            title="Approve Product">

                            <i class="fa-solid fa-check"></i>

                        </button>

                        <button
                            class="action-btn reject"
                            onclick="rejectProduct(${product.product_id})"
                            title="Reject Product">

                            <i class="fa-solid fa-xmark"></i>

                        </button>

                    </div>

                </td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

loadProducts();

/* ==========================================
        APPROVE PRODUCT
========================================== */

async function approveProduct(id) {

    try {

        await fetch(
            `http://localhost:3000/api/admin/products/approve/${id}`,
            {
                method: "PUT"
            }
        );

        alert("Product Approved Successfully.");

        loadProducts();

    }

    catch (error) {

        console.log(error);

    }

}

/* ==========================================
        REJECT PRODUCT
========================================== */

async function rejectProduct(id) {

    try {

        await fetch(
            `http://localhost:3000/api/admin/products/reject/${id}`,
            {
                method: "PUT"
            }
        );

        alert("Product Rejected Successfully.");

        loadProducts();

    }

    catch (error) {

        console.log(error);

    }

}