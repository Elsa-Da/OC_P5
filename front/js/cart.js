/** Récupération des données du localStorage */
let inLocalStorage = JSON.parse(localStorage.getItem("productToCart"));
console.log(inLocalStorage);

for (const item of inLocalStorage) {
    //Récupération données de l'API
    fetch(`http://localhost:3000/api/products/${item.id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (product) {
            let qty = item.quantity
            let prc = product.price
            displayProduct(product, item);
            modifyProductQuantity();
            totalPrice(qty, prc);
            deleteProduct(qty, prc);
            totalQuantity(qty, prc);
            sendForm();
        })
        .catch(function (error) {
            console.log('fetch error', error);
        });
}

function displayProduct(product, item) {
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
    productImg.setAttribute('src', product.imageUrl)
    productImg.setAttribute('alt', product.altTxt)
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
    productName.innerHTML = product.name

    const productColor = document.createElement('p')
    productColor.innerHTML = itemColor

    const productPrice = document.createElement('p')
    productPrice.innerHTML = product.price + ' €'

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
    let cart = JSON.parse(localStorage.getItem("productToCart"));

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

            //Modification dans le local storage
            let foundProduct = cart.find(p => p.id == productToModifyId && p.color == productToModifyColor);
            if (foundProduct != undefined) {
                foundProduct.quantity = products.value
                localStorage.setItem("productToCart", JSON.stringify(cart));
                totalQuantity();
                location.reload();
            }
        })
    }
}

/** Supprimer un produit */
function deleteProduct(qty, prc) {
    let cart = JSON.parse(localStorage.getItem("productToCart"));

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
            let productToRemove = cart.filter((item) => item.id !== productToDeleteId || item.color !== productToDeleteColor);
            cart = productToRemove

            localStorage.setItem("productToCart", JSON.stringify(cart));
            totalQuantity();
            //totalPrice(-qty, prc);
            location.reload();
        })
    }
}


/** Quantité totale du panier */
function totalQuantity() {
    let cart = JSON.parse(localStorage.getItem("productToCart"));
    let total = 0
    for (let products of cart) {
        total += parseInt(products.quantity)
    }
    let totalQuantity = document.getElementById('totalQuantity')
    totalQuantity.innerHTML = total
}

total = 0;
function totalPrice(qty, prc) {
    productsPrice = qty * prc
    total += productsPrice
    let totalPrice = document.getElementById('totalPrice')
    totalPrice.innerHTML = total

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

        checkForm()

        const contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        }

        let products = []
        for (item of inLocalStorage) {
            products.push(item.id)
        }

        const body = {
            contact, products
        }

        sendPost(body)
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
    const masque = "[^A-Za-z]";
    if (firstNameValue.length < 2 || firstNameValue.length > 15) {
        firstNameError.style.display = "contents"
        firstNameError.innerHTML = "Veuillez saisir un prénom valide."
        checkForm()
    } else if (firstNameValue.match(masque)) {
        firstNameError.style.display = "contents"
        firstNameError.innerHTML = "Les chiffres et caractères spéciaux sont interdits pour ce champ."
        checkForm()
    } else {
        firstNameError.style.display = "none";
    }

    if (lastNameValue.length < 2 || lastNameValue.length > 20) {
        lastNameError.style.display = "contents"
        lastNameError.innerHTML = "Veuillez saisir un nom valide."
        checkForm()
    } else if (lastNameValue.match(masque)) {
        lastNameError.style.display = "contents"
        lastNameError.innerHTML = "Les chiffres et caractères spéciaux sont interdits pour ce champ."
        checkForm()
    } else {
        lastNameError.style.display = "none"
    }

    if (addressValue.length < 5) {
        addressError.style.display = "contents"
        addressError.innerHTML = "Veuillez saisir une adresse valide."
        checkForm()
    } else {
        addressError.style.display = "none"
    }

    if (cityValue.length < 2) {
        cityError.style.display = "contents"
        cityError.innerHTML = "Veuillez saisir un nom de ville valide."
        checkForm()
    } else if (cityValue.match(masque)) {
        cityError.style.display = "contents"
        cityError.innerHTML = "Les chiffres et caractères spéciaux sont interdits pour ce champ."
        checkForm()
    } else {
        cityError.style.display = "none"
    }

    if (emailValue.length < 6) {
        emailError.style.display = "contents"
        emailError.innerHTML = "Veuillez saisir un e-mail valide."
        checkForm()
    } else {
        emailError.style.display = "none"
    }
}


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
            console.log(value);
            let orderId = value.orderId
            window.location.replace('./confirmation.html?' + orderId);
        })
        .catch(function (error) {
            console.log('fetch error', error);
        });
}