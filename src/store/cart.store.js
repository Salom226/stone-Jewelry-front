

export function addToCart(productId)
{
    let cart = localStorage.getItem("cart");
    if (!cart){
        cart={};
    } else {
        cart = JSON.parse(cart);
    }
    if (cart[productId]){
        cart[productId]++;
    } else {
        cart[productId] = 1;
    }
    const cartStr = JSON.stringify(cart);
    localStorage.setItem("cart",cartStr);


}

export function removeFromCart(productId) {
    let cart = localStorage.getItem("cart");
    if (!cart) {
        console.error("Panier vide ou inexistant.");
        return;
    }

    // Convertir le panier en objet JS
    cart = JSON.parse(cart);

    // Vérifier si le produit est dans le panier
    if (cart[productId]) {
        if (cart[productId] > 1) {
            // Si la quantité est supérieure à 1, décrémenter
            cart[productId]--;
        } else {
            // Sinon, supprimer complètement le produit
            delete cart[productId];
        }

        // Mettre à jour le panier dans le localStorage
        const cartStr = JSON.stringify(cart);
        localStorage.setItem("cart", cartStr);
    } else {
        console.error("Le produit n'existe pas dans le panier.");
    }
}
export function clearCart() {
    // Supprimer le panier du localStorage
    localStorage.removeItem("cart");
    console.log("Le panier a été vidé.");
}
// Récupérer le contenu du panier
export function getCart() {
    let cart = localStorage.getItem("cart");
    if (!cart) {
        return {};
    }
    return JSON.parse(cart);
}

// Calculer le total des articles du panier
export function getCartTotal(productsList) {
    let cart = getCart();
    let total = 0;

    Object.keys(cart).forEach(productId => {
        const product = productsList.find(p => p.id === productId);
        if (product) {
            total += product.price * cart[productId]; // Prix * quantité
        }
    });

    return total;
}

// Récupérer la quantité totale d'articles dans le panier
export function getCartItemCount() {
    let cart = getCart();
    let itemCount = 0;

    Object.values(cart).forEach(quantity => {
        itemCount += quantity;
    });

    return itemCount;
}