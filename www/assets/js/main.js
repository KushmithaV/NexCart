console.log("NexCart Loaded Successfully");
/* Wishlist Toggle */

document.querySelectorAll(".wishlist").forEach(button=>{

    button.addEventListener("click",()=>{

        button.classList.toggle("active");

        if(button.classList.contains("active")){

            button.innerHTML='<i class="fa-solid fa-heart"></i>';

        }else{

            button.innerHTML='<i class="fa-regular fa-heart"></i>';

        }

    });

});

/* ===============================
        FLASH SALE TIMER
================================ */

const endDate = new Date();

endDate.setDate(endDate.getDate() + 5);

function updateCountdown(){

    const now = new Date();

    const diff = endDate - now;

    if(diff <= 0) return;

    const days = Math.floor(diff / (1000*60*60*24));

    const hours = Math.floor((diff/(1000*60*60)) % 24);

    const minutes = Math.floor((diff/(1000*60)) % 60);

    const seconds = Math.floor((diff/1000) % 60);

    document.getElementById("days").innerText = String(days).padStart(2,'0');
    document.getElementById("hours").innerText = String(hours).padStart(2,'0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2,'0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2,'0');

}

updateCountdown();

setInterval(updateCountdown,1000);
/* WHY CARDS */

const whyCards = document.querySelectorAll(".why-card");

whyCards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-12px)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0)";

    });

});
/* Brand Cards */

