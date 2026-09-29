/* ==========================================
        CHECK SELLER LOGIN
========================================== */
const brands = {

1:[
{id:1,name:"Apple"},
{id:2,name:"Samsung"},
{id:3,name:"Boat"}
],

2:[
{id:4,name:"Nike"},
{id:5,name:"Adidas"},
{id:6,name:"Puma"}
],

3:[
{id:7,name:"Classmate"}
],

4:[
{id:8,name:"Godrej"}
],

5:[
{id:9,name:"Aashirvaad"}
],

6:[
{id:10,name:"Cosco"}
],

7:[
{id:11,name:"Lakme"}
],

8:[
{id:12,name:"Funskool"}
]

};
const seller = JSON.parse(localStorage.getItem("seller"));
const token = localStorage.getItem("sellerToken");

if (!seller || !token) {

    window.location.href = "seller-login.html";

}


/* ==========================================
            LIVE PREVIEW
========================================== */

const productName = document.getElementById("product_name");
const brand = document.getElementById("brand");
const category = document.getElementById("category");
const price = document.getElementById("price");
const image = document.getElementById("product_image");

const previewName = document.getElementById("previewName");
const previewBrand = document.getElementById("previewBrand");
const previewPrice = document.getElementById("previewPrice");
const previewCategory = document.getElementById("previewCategory");
const previewImage = document.getElementById("previewImage");


productName.addEventListener("input", () => {

    previewName.innerText =
        productName.value || "Product Name";

});


brand.addEventListener("change", () => {

    previewBrand.innerText =
        brand.options[brand.selectedIndex].text || "Brand";

});


price.addEventListener("input", () => {

    previewPrice.innerText =
        "₹" + (price.value || "0");

});


category.addEventListener("change", () => {

    previewCategory.innerText =
        category.options[category.selectedIndex].text || "Category";

});


image.addEventListener("change", () => {

    const file = image.files[0];

    if (file) {

        previewImage.src = URL.createObjectURL(file);

    }

});
/* ==========================================
        ADD PRODUCT
========================================== */

/* ==========================================
        ADD PRODUCT
========================================== */

const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!seller || !seller.seller_id) {

        showToast(
            "Seller login expired. Please login again.",
            "error"
        );

        return;

    }

    const formData = new FormData();

    formData.append(
        "seller_id",
        seller.seller_id
    );

    formData.append(
        "category_id",
        category.value
    );

    formData.append(
        "brand_id",
        brand.value
    );
    formData.append(
    "custom_brand",
    document.getElementById("custom_brand").value.trim()
);

    formData.append(
        "product_name",
        productName.value.trim()
    );

    formData.append(
        "description",
        document.getElementById("description").value.trim()
    );

    formData.append(
        "price",
        price.value
    );

    formData.append(
        "discount",
        document.getElementById("discount").value || 0
    );

    formData.append(
        "stock",
        document.getElementById("stock").value
    );

    formData.append(
        "sku",
        document.getElementById("sku").value.trim()
    );

    if (image.files.length > 0) {

        formData.append(
            "product_image",
            image.files[0]
        );

    }

    try {

        const response = await fetch(

            "http://localhost:3000/api/products/add",

            {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${token}`

                },

                body: formData

            }

        );

        const data = await response.json();

        if (response.ok) {

            showToast(
                "Product added successfully",
                "success"
            );

            productForm.reset();

            previewName.innerText = "Product Name";

            previewBrand.innerText = "Brand";

            previewPrice.innerText = "₹0";

            previewCategory.innerText = "Category";

            previewImage.src =
                "https://placehold.co/350x260?text=Product+Image";

        }

        else {

            showToast(

                data.message || "Failed to add product",

                "error"

            );

        }

    }

    catch (error) {

        console.log(error);

        showToast(
            "Server not connected",
            "error"
        );

    }

});