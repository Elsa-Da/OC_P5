/** Récupération ID du produit */
let params = new URLSearchParams(document.location.search)
let id = params.get("id")

/** Fonction pour récupérer les données du produit */
fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (response) {
        return response.json()
    })
    .then(function (productData) {
        fillProduct(productData)

        // Changer le titre de la page par le nom du produit
        document.title = productData.name

        /**  Au clic du bouton "Ajouter au panier", le produit s'ajoute*/
        productToCart = document.getElementById('addToCart')

        productToCart.addEventListener("click", function () {
            //Récupération des options choisies
            let selectedOptions = selectedProduct()
            //Ajout au panier
            selectedOptions ? addToCart(selectedOptions) : null
        })
    }
    )
    .catch(function (error) {
        console.log('fetch error', error)
        setTimeout(function () {
            alert("Ce produit n'existe plus")
            window.location.replace("index.html")
        })
    })


/** Fonction pour remplir les données dans la fiche produit */
function fillProduct(product) {

    // Elements de la page à remplir
    const productImgContainer = document.querySelector('.item__img')
    const productName = document.getElementById('title')
    const productPrice = document.getElementById('price')
    const productDescription = document.getElementById('description')

    //pour les images
    const productImg = document.createElement('img')
    productImg.setAttribute('src', product.imageUrl)
    productImg.setAttribute('alt', product.altTxt)
    productImgContainer.appendChild(productImg)

    //pour le texte
    productName.innerHTML = product.name
    productPrice.innerHTML = product.price
    productDescription.innerHTML = product.description

    //pour les couleurs
    for (const color of product.colors) {
        productColorSelector = document.getElementById('colors')
        colorSelector = document.createElement('option')
        colorSelector.innerHTML = color
        colorSelector.setAttribute('value', color)
        productColorSelector.appendChild(colorSelector)
    }
}

/** Fonction pour ajouter le produit au panier */
function addToCart(selectedOptions) {
    // Récupération des produits dans le panier
    let cart = JSON.parse(localStorage.getItem("productToCart"))

    //S'il y a déjà des produits dans le panier
    if (cart) {
        let cartStorageUpdate = false
        for (let product of cart) {
            // comparer pour voir si id & couleur identique
            if (product.color === selectedOptions.color && product.id === selectedOptions.id) {
                //si oui, ajouter la nouvelle quantité à l'ancienne
                product.quantity += parseInt(selectedOptions.quantity)
                cartStorageUpdate = true
            }
        }
        if (!cartStorageUpdate) {
            //si non, ajouter nouveau produit
            cart.push(selectedOptions)
        }
    } else {
        //S'il n'y a pas de produits dans le panier, créer un tableau puis push le premier produit
        cart = []
        cart.push(selectedOptions)
    }

    // Enregistrer à nouveau le local storage
    localStorage.setItem("productToCart", JSON.stringify(cart))
    alert("Produit ajouté au panier !")
}

/** Fonction pour récupérer les options sélectionnées par le client */
function selectedProduct() {
    let selectedColor = document.getElementById("colors").value
    let selectedQuantity = document.getElementById("quantity").value

    // création d'un objet avec l'id, la couleur et la quantité sélectionnée
    let selectedOptions = {
        id: id,
        color: selectedColor,
        quantity: parseInt(selectedQuantity),
    }

    console.log(selectedOptions)

    // si couleur ou quantité bien rempli, on ajoute au panier sinon alerte
    if (!(selectedColor != "" && selectedQuantity != "0")) {
        alert("Veuillez sélectionner une couleur et/ou une quantité")
        return
    }

    if (!(selectedQuantity > 0 && selectedQuantity <= 100)) {
        alert("Veuillez sélectionner une quantité comprise entre 1 et 100.")
        return
    }

    return selectedOptions
}




