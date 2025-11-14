export const addItemToCart = (cartItems, cartItemToAdd) => {
  // Use variantId if available, otherwise fall back to id
  // This allows products with different sizes/colors to be separate cart items
  const itemIdentifier = cartItemToAdd.variantId || cartItemToAdd.id;

  const existingCartItem = cartItems.find(
    cartItem => (cartItem.variantId || cartItem.id) === itemIdentifier
  );

  if (existingCartItem) {
    return cartItems.map(cartItem =>
      (cartItem.variantId || cartItem.id) === itemIdentifier
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...cartItemToAdd, quantity: 1 }];
};

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  const itemIdentifier = cartItemToRemove.variantId || cartItemToRemove.id;

  const existingCartItem = cartItems.find(
    cartItem => (cartItem.variantId || cartItem.id) === itemIdentifier
  );

  if (existingCartItem.quantity === 1) {
    return cartItems.filter(cartItem =>
      (cartItem.variantId || cartItem.id) !== itemIdentifier
    );
  }

  return cartItems.map(cartItem =>
    (cartItem.variantId || cartItem.id) === itemIdentifier
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};
