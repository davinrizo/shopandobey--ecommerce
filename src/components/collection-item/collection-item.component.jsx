import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { addItem } from '../../redux/cart/cart.actions';

import {
  CollectionItemContainer,
  CollectionFooterContainer,
  AddButton,
  BackgroundImage,
  NameContainer,
  PriceContainer
} from './collection-item.styles';

export const CollectionItem = ({ item, addItem }) => {
  const { id, name, price, imageUrl } = item;
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(item);
  };

  return (
    <CollectionItemContainer>
      <BackgroundImage
        className='image'
        imageUrl={imageUrl}
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
      />
      <CollectionFooterContainer onClick={handleImageClick} style={{ cursor: 'pointer' }}>
        <NameContainer>{name}</NameContainer>
        <PriceContainer>${price}</PriceContainer>
      </CollectionFooterContainer>
      <AddButton onClick={handleAddToCart} inverted>
        Add to cart
      </AddButton>
    </CollectionItemContainer>
  );
};

const mapDispatchToProps = dispatch => ({
  addItem: item => dispatch(addItem(item))
});

export default connect(
  null,
  mapDispatchToProps
)(CollectionItem);
