let inLocalStorage = JSON.parse(localStorage.getItem("productToCart"));
console.log(inLocalStorage);

for (const item of inLocalStorage) {

    //Récupération données de l'API
    fetch(`http://localhost:3000/api/products/${item.id}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (product) {
            displayProduct(product, item);
            modifyProductQuantity(item);
            deleteProductQuantity();
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

/** Modifier la quantité d'un produit */
function modifyProductQuantity(item) {
    const quantityToCheck = document.querySelector('.itemQuantity')
    console.log(quantityToCheck)

    quantityToCheck.addEventListener('change', function () {
        const modifiedQuantity = quantityToCheck.value;
        console.log(item.quantity)
        console.log(modifiedQuantity)
        item.quantity = modifiedQuantity
    });
}

function deleteProductQuantity() {
    /** Supprimer un produit */
    const deleteButton = document.querySelector(".deleteItem")
    deleteButton.addEventListener('click', function () {
        console.log("suppr !")
        toBeDeleteProduct = deleteButton.closest('.cart__item')
        console.log(toBeDeleteProduct.dataset.id)
    })
}