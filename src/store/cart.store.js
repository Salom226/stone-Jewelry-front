

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