/** Récupération ID de la commande */
let getOrderId = window.location.search
orderId = getOrderId.substring(1)
console.log(orderId)

// Place l'ID sur la page
document.getElementById('orderId').innerHTML = orderId;