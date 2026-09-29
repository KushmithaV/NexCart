document.addEventListener("DOMContentLoaded",()=>{


const sellersBox = document.getElementById("sellersBox");


fetch("http://localhost:3000/api/admin/sellers")

.then(res=>res.json())

.then(sellers=>{


sellersBox.innerHTML="";


sellers.forEach(seller=>{


sellersBox.innerHTML += `

<tr>

<td>${seller.seller_id}</td>

<td>${seller.full_name}</td>

<td>${seller.shop_name}</td>

<td>${seller.email}</td>

<td>${seller.phone}</td>

<td>${seller.city}</td>


<td>

<span class="status ${seller.status.toLowerCase()}">

${seller.status}

</span>

</td>


</tr>

`;


});


})


.catch(err=>{

console.log("Seller loading error:",err);

});


});