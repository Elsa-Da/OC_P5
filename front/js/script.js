


/** Création fonction qui permet de récupérer les données de l'API
 */
fetch("http://localhost:3000/api/products")
    .then(function (response) {
        return response.json();
    })
    .then(function (productsData) {
        const items = document.getElementById("items")
        for (const data of productsData) {
            items.appendChild(createProductCard(data))
        }
    })
    .catch(function (error) {
        console.log('fetch error');
    });


/** Création de la carte produit pour la page d'accueil */
function createProductCard(product) {
    const productLink = document.createElement('a')
    productLink.setAttribute('href', `./product.html?id=${product._id}`)

    const productCard = document.createElement('article')

    const productImg = document.createElement('img')
    productImg.setAttribute('src', product.imageUrl)
    productImg.setAttribute('alt', product.altTxt)

    const productName = document.createElement('h3')
    productName.innerHTML = product.name

    const productDescription = document.createElement('p')
    productDescription.innerHTML = product.description

    productCard.appendChild(productImg)
    productCard.appendChild(productName)
    productCard.appendChild(productDescription)
    productLink.appendChild(productCard)

    return productLink

}
