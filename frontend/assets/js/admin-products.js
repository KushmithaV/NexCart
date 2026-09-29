document.addEventListener("DOMContentLoaded",()=>{

    const productsTable = document.getElementById("productsTable");


    fetch("http://localhost:3000/api/admin/products")

    .then(res=>res.json())

    .then(products=>{

        productsTable.innerHTML="";


        products.forEach(product=>{
            console.log(product.thumbnail);


           let imagePath = product.thumbnail;

if(imagePath){

    if(!imagePath.startsWith("/uploads/")){
        imagePath = "/uploads/" + imagePath.replace("/uploads/","");
    }

    imagePath = "http://localhost:3000" + imagePath;

}


            productsTable.innerHTML += `


            <tr>


                <td>

                    <img 
                    src="${imagePath || 'assets/images/no-image.png'}"
                    class="product-img"

                </td>


                <td>
                    ${product.product_name}
                </td>


                <td>
                    ${product.shop_name || "N/A"}
                </td>


                <td>
                    ₹${product.price}
                </td>


                <td>
                    ₹${product.final_price || product.price}
                </td>


                <td>
                    ${product.stock}
                </td>


                <td>

                    <span class="status">
                        ${product.status}
                    </span>

                </td>


            </tr>


            `;


        });


    })


    .catch(err=>{

        console.log("Product loading error:",err);

    });


});