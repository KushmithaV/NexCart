document.addEventListener("DOMContentLoaded",()=>{


const customersBox = document.getElementById("customersBox");


fetch("http://localhost:3000/api/admin/customers")


.then(res=>res.json())


.then(customers=>{


customersBox.innerHTML="";


customers.forEach(customer=>{


customersBox.innerHTML += `


<tr>


<td>${customer.customer_id}</td>


<td>${customer.full_name}</td>


<td>${customer.email}</td>


<td>${customer.phone}</td>


<td>
${new Date(customer.created_at).toLocaleDateString()}
</td>


</tr>


`;


});


})


.catch(err=>{

console.log("Customer loading error:",err);

});


});