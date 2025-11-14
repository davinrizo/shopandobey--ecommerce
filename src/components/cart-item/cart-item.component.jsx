import React from 'react';

import {
  CartItemContainer,
  ItemDetailsContainer,
  CartItemImage
} from './cart-item.styles';

const CartItem = ({ item: { imageUrl, price, name, quantity, selectedSize, selectedColor } }) => (
  <CartItemContainer>
    <CartItemImage src={imageUrl} alt='item' />
    <ItemDetailsContainer>
      <span>{name}</span>
      {(selectedSize || selectedColor) && (
        <span style={{ fontSize: '12px', color: '#666' }}>
          {selectedSize && `Size: ${selectedSize}`}
          {selectedSize && selectedColor && ' | '}
          {selectedColor && `Color: ${selectedColor}`}
        </span>
      )}
      <span>
        {quantity} x ${price}
      </span>
    </ItemDetailsContainer>
  </CartItemContainer>
);

export default React.memo(CartItem);
