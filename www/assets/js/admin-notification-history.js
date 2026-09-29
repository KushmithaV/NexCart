const container =
document.getElementById("historyContainer");

async function loadHistory(){

    try{

        const res = await fetch(
            "http://localhost:3000/api/orders/admin-notification-history"
        );

        const notifications =
        await res.json();

        container.innerHTML="";

        if(notifications.length===0){

            container.innerHTML=`

                <p>No notification history found.</p>

            `;

            return;

        }

        notifications.forEach(notification=>{

            container.innerHTML += `

                <div class="history-card">

                    <h3>${notification.title}</h3>

                    <p>${notification.message}</p>

                    <small>

                        ${new Date(notification.created_at).toLocaleString()}

                    </small>

                </div>

            `;

        });

    }

    catch(err){

        console.log(err);

    }

}

loadHistory();