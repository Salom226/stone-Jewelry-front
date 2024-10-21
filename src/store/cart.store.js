export function addToCart(productId) {
  let cart = localStorage.getItem("cart");
  if (!cart) {
    cart = {};
  } else {
    cart = JSON.parse(cart);
  }
  if (cart[productId]) {
    cart[productId]++;
  } else {
    cart[productId] = 1;
  }
  const cartStr = JSON.stringify(cart);
  localStorage.setItem("cart", cartStr);
}

export function removeFromCart(productId) {
  let cart = localStorage.getItem("cart");
  if (!cart) {
    console.error("Panier vide ou inexistant.");
    return;
  }

  cart = JSON.parse(cart);

  if (cart[productId]) {
    if (cart[productId] > 1) {
      cart[productId]--;
    } else {
      delete cart[productId];
    }

    const cartStr = JSON.stringify(cart);
    localStorage.setItem("cart", cartStr);
  } else {
    console.error("Le produit n'existe pas dans le panier.");
  }
}
export function clearCart() {
  localStorage.removeItem("cart");
  console.log("Le panier a été vidé.");
}
export function getCart() {
  let cart = localStorage.getItem("cart");
  if (!cart) {
    return {};
  }
  return JSON.parse(cart);
}

export function getCartTotal(productsList) {
  let cart = getCart();
  let total = 0;

  Object.keys(cart).forEach((productId) => {
    const product = productsList.find((p) => p.id === productId);
    if (product) {
      total += product.price * cart[productId]; 
    }
  });

  return total;
}

export function getCartItemCount() {
  let cart = getCart();
  let itemCount = 0;

  Object.values(cart).forEach((quantity) => {
    itemCount += quantity;
  });

  return itemCount;
}
