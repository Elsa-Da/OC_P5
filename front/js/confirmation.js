/** Récupération ID de la commande */
let params = new URLSearchParams(document.location.search)
let id = params.get("id")

// Place l'ID sur la page
document.getElementById('orderId').innerHTML = id