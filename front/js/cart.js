/** Récupération des données du localStorage */
let inLocalStorage = JSON.parse(localStorage.getItem("productToCart"));
console.log(inLocalStorage);

//Récupération données de l'API
if (inLocalStorage) {
    for (const item of inLocalStorage) {
        //Récupération données de l'API
        fetch("http://localhost:3000/api/products/" + item.id)
            .then(function (response) {
                return response.json();
            })
            .then(
                function (data) {
                    displayProduct(data, item)
                    totalPrice(data, item)
                    modifyProductQuantity()
                    deleteProduct()
                })
            .catch(function (error) {
                console.log('fetch error', error);
            });
    }
    totalQuantity();
    sendForm();
}


function displayProduct(data, item) {

    //Récupération élément du panier
    const itemId = item.id
    const itemColor = item.color
    const itemQty = item.quantity

    const cartContainer = document.getElementById('cart__items')
    // Elements de la page à remplir
    const cartItem = document.createElement('article')
    cartItem.classList.add("cart__item")
    cartItem.setAttribute('data-id', itemId)
    cartItem.setAttribute('data-color', itemColor)
    cartContainer.appendChild(cartItem)

    const imgContainer = document.createElement('div')
    imgContainer.classList.add("cart__item__img")
    const productImg = document.createElement('img')
    productImg.setAttribute('src', data.imageUrl)
    productImg.setAttribute('alt', data.altTxt)
    cartItem.appendChild(imgContainer)
    imgContainer.appendChild(productImg)

    const cartItemContent = document.createElement('div')
    cartItemContent.classList.add("cart__item__content")
    cartItem.appendChild(cartItemContent)

    const cartItemDescription = document.createElement('div')
    cartItemDescription.classList.add("cart__item__content__description")
    cartItemContent.appendChild(cartItemDescription)

    //Description du produit
    const productName = document.createElement('h2')
    productName.innerHTML = data.name

    const productColor = document.createElement('p')
    productColor.innerHTML = itemColor

    const productPrice = document.createElement('p')
    productPrice.innerHTML = data.price + ' €'

    cartItemDescription.appendChild(productName)
    cartItemDescription.appendChild(productColor)
    cartItemDescription.appendChild(productPrice)

    const cartItemSettings = document.createElement('div')
    cartItemSettings.classList.add('cart__item__content__settings')
    cartItemContent.appendChild(cartItemSettings)

    const cartItemQty = document.createElement('div')
    cartItemQty.classList.add('cart__item__content__settings__quantity')
    cartItemSettings.appendChild(cartItemQty)

    const cartItemSettingsQty = document.createElement('p')
    cartItemSettingsQty.innerHTML = "Qté : "
    cartItemQty.appendChild(cartItemSettingsQty)

    const productQty = document.createElement('input')
    productQty.classList.add('itemQuantity')
    productQty.setAttribute('type', 'number')
    productQty.setAttribute('name', 'itemQuantity')
    productQty.setAttribute('min', '1')
    productQty.setAttribute('max', '100')
    productQty.setAttribute('value', itemQty)
    cartItemQty.appendChild(productQty)

    const cartItemSettingsDelete = document.createElement('div')
    cartItemSettingsDelete.classList.add('cart__item__content__settings__delete')
    cartItemSettings.appendChild(cartItemSettingsDelete)

    const cartItemDelete = document.createElement('p')
    cartItemDelete.classList.add('deleteItem')
    cartItemDelete.innerHTML = "Supprimer"
    cartItemSettingsDelete.appendChild(cartItemDelete)
}

/** Modifier la quantité d'un produit*/
function modifyProductQuantity() {
    // Cibler les input de quantité
    const quantityToCheck = document.querySelectorAll('.itemQuantity')
    // Pour chaque input, au clic ..
    for (let products of quantityToCheck) {
        products.addEventListener('change', function (event) {
            //Cible la quantité modifiée dans le DOM
            products.value = event.target.value
            //Cible le produit à modifier
            productToModify = products.closest('article')
            productToModifyId = productToModify.dataset.id
            productToModifyColor = productToModify.dataset.color
            //On vérifie que la valeur est bien comprise entre 1 et 100
            if (products.value > 0 && products.value <= 100) {
                //Modification dans le local storage
                let foundProduct = inLocalStorage.find(p => p.id == productToModifyId && p.color == productToModifyColor)
                if (foundProduct != undefined) {
                    foundProduct.quantity = products.value
                    localStorage.setItem("productToCart", JSON.stringify(inLocalStorage))
                    totalQuantity()
                    updateTotalPrice()
                }
            } else {
                alert("Veuillez sélectionner une quantité comprise entre 1 et 100.")
            }
        })
    }
}

/** Supprimer un produit */
function deleteProduct() {
    // Cibler les boutons suppr
    let deleteBtn = document.querySelectorAll(".deleteItem")
    // Pour chaque bouton, au clic ..
    for (let products of deleteBtn) {
        products.addEventListener('click', function () {
            //Cible et supprime le produit dans le DOM
            let productToDelete = products.closest('article')
            productToDelete.remove()
            const productToDeleteId = productToDelete.dataset.id
            const productToDeleteColor = productToDelete.dataset.color
            //Cible et supprime le produit dans le LocalStorage
            let productToRemove = inLocalStorage.filter((item) => item.id !== productToDeleteId || item.color !== productToDeleteColor)
            inLocalStorage = productToRemove
            localStorage.setItem("productToCart", JSON.stringify(inLocalStorage))
            totalQuantity()
            updateTotalPrice()
        })
    }
}

/** Quantité totale du panier */
function totalQuantity() {
    let total = 0
    for (let products of inLocalStorage) {
        total += parseInt(products.quantity)
    }
    let totalQuantity = document.getElementById('totalQuantity')
    totalQuantity.innerHTML = total
}

/** Prix total du panier */
total = 0;
function totalPrice(data, item) {
    productsPrice = item.quantity * data.price
    total += productsPrice
    let totalPrice = document.getElementById('totalPrice')
    totalPrice.innerHTML = total

}

/** Réactualisation du prix après modification ou suppression */
function updateTotalPrice() {
    let updatedTotal = 0
    //Récupération des produits qu'il y a dans le panier
    for (const product of inLocalStorage) {
        const idLocalStorage = product.id
        const qtyLocalStorage = product.quantity
        //Récupération données API
        fetch("http://localhost:3000/api/products/")
            .then(function (response) {
                return response.json();
            })
            .then(function (ApiData) {
                const findProducts = ApiData.find((element) => element._id === idLocalStorage)
                //Si même id dans panier + api on recalcule le prix
                if (findProducts) {
                    const productsPrice = findProducts.price * qtyLocalStorage
                    updatedTotal += productsPrice
                    let updatedTotalPrice = document.getElementById('totalPrice')
                    updatedTotalPrice.innerHTML = updatedTotal
                }
            })
            .catch(function (error) {
                console.log('fetch error', error);
            });
    }
}


function sendForm() {
    //Récupération des champs formulaire
    const form = document.querySelector('.cart__order__form')
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')
    const address = document.getElementById('address')
    const city = document.getElementById('city')
    const email = document.getElementById('email')

    /** Récupérer les données formulaires */

    //Au submit du formulire ...
    form.addEventListener('submit', function (e) {
        e.preventDefault()

        // Vérification des input formulaire
        let checked = checkForm()
        if (checked === true) {

            // si formulaire vérifié création d'un objet contact ...
            const contact = {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value
            }

            // ... et d'un tableau contenant les produits dans le panier de l'user
            let products = []
            for (item of inLocalStorage) {
                products.push(item.id)
            }

            const body = {
                contact, products
            }
            // On envoie l'objet et le tableau au back & on vide le local storage
            sendPost(body)
            localStorage.removeItem("productToCart");

        } else {
            checkForm()
        }
    })
}

function checkForm() {//Récupération des valeurs de chaque input
    const firstNameValue = firstName.value.trim()
    const lastNameValue = lastName.value.trim()
    const addressValue = address.value.trim()
    const cityValue = city.value.trim()
    const emailValue = email.value.trim()

    const firstNameError = document.getElementById('firstNameErrorMsg')
    const lastNameError = document.getElementById('lastNameErrorMsg')
    const addressError = document.getElementById('addressErrorMsg')
    const cityError = document.getElementById('cityErrorMsg')
    const emailError = document.getElementById('emailErrorMsg')


    //Vérifications des valeurs de chaque input
    const textRegex = /^[A-Za-z' -]{2,20}$/;
    const addressRegex = /^[A-Za-z0-9' -]{5,40}$/
    const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

    firstNameError.innerHTML = "";
    lastNameError.innerHTML = "";
    addressError.innerHTML = "";
    cityError.innerHTML = "";
    emailError.innerHTML = "";

    if (!textRegex.test(firstNameValue)) {
        firstNameError.innerHTML = "Veuillez saisir un prénom valide."
        return false
    }

    if (!textRegex.test(lastNameValue)) {
        lastNameError.innerHTML = "Veuillez saisir un nom de famille valide."
        return false
    }

    if (!addressRegex.test(addressValue)) {
        addressError.innerHTML = "Veuillez saisir une adresse valide."
        return false
    }

    if (!textRegex.test(cityValue)) {
        cityError.innerHTML = "Veuillez saisir un nom de ville valide."
        return false
    }

    if (emailValue.length < 6 || !emailRegex.test(emailValue)) {
        emailError.innerHTML = "Veuillez saisir un e-mail valide."
        return false
    }

    return true;
}

/** Fonction d'envoi des infos au backend */
function sendPost(body) {
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (value) {
            // lorsqu'on récupère la réponse du back on inscrit l'ID dans l'URL de redirection pour la confirmation de commande
            console.log(value);
            let orderId = value.orderId
            window.location.replace('./confirmation.html?' + orderId);
        })
        .catch(function (error) {
            console.log('fetch error', error);
        });
}
