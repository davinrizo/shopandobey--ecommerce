import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CustomButton from '../../components/custom-button/custom-button.component';
import ProductImageGallery from '../../components/product-image-gallery/product-image-gallery.component';
import { addItem } from '../../redux/cart/cart.actions';
import { selectAllCollectionsItems } from '../../redux/shop/shop.selectors';

import {
  ProductDetailContainer,
  BreadcrumbContainer,
  BreadcrumbLink,
  BreadcrumbCurrent,
  ProductContentContainer,
  ProductImageContainer,
  ProductImage,
  ProductInfoContainer,
  ProductTitle,
  ProductPrice,
  ProductDescription,
  ProductMeta,
  ProductSKU,
  ProductCategory,
  ButtonContainer,
  BackButton,
  ProductNotFound
} from './product-detail.styles';

const ProductDetail = ({ allItems, addItem }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (allItems && allItems.length > 0) {
      const foundProduct = allItems.find(item => item.id === parseInt(productId));
      setProduct(foundProduct);
    }
  }, [productId, allItems]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!product && allItems && allItems.length > 0) {
    return (
      <ProductNotFound>
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <CustomButton onClick={() => navigate('/shop')}>
          Continue Shopping
        </CustomButton>
      </ProductNotFound>
    );
  }

  if (!product) {
    return (
      <ProductDetailContainer>
        <p>Loading...</p>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <BreadcrumbContainer>
        <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
        <span> / </span>
        <BreadcrumbLink onClick={() => navigate('/shop')}>Shop</BreadcrumbLink>
        <span> / </span>
        <BreadcrumbCurrent>{product.name}</BreadcrumbCurrent>
      </BreadcrumbContainer>

      <ProductContentContainer>
        <ProductImageGallery
          images={product.images || product.imageUrl}
          productName={product.name}
        />

        <ProductInfoContainer>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductPrice>${product.price}</ProductPrice>

          <ProductDescription>
            {product.description ||
              `High-quality ${product.name.toLowerCase()} from our premium collection.
              Crafted with attention to detail and designed for comfort and style.`}
          </ProductDescription>

          <ProductMeta>
            <ProductSKU>SKU: {product.id}</ProductSKU>
            <ProductCategory>Category: {product.category || 'General'}</ProductCategory>
          </ProductMeta>

          <ButtonContainer>
            <CustomButton onClick={handleAddToCart}>
              Add to Cart
            </CustomButton>
            <BackButton onClick={handleGoBack}>
              Continue Shopping
            </BackButton>
          </ButtonContainer>
        </ProductInfoContainer>
      </ProductContentContainer>
    </ProductDetailContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  allItems: selectAllCollectionsItems
});

const mapDispatchToProps = dispatch => ({
  addItem: item => dispatch(addItem(item))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
