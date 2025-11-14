import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CustomButton from '../../components/custom-button/custom-button.component';
import ProductImageGallery from '../../components/product-image-gallery/product-image-gallery.component';
import ProductVariants from '../../components/product-variants/product-variants.component';
import { addItem } from '../../redux/cart/cart.actions';
import { selectAllCollectionsItems } from '../../redux/shop/shop.selectors';

import {
  ProductDetailContainer,
  BreadcrumbContainer,
  BreadcrumbLink,
  BreadcrumbCurrent,
  ProductContentContainer,
  ProductInfoContainer,
  ProductTitle,
  ProductPrice,
  ProductDescription,
  ProductMeta,
  ProductSKU,
  ProductCategory,
  ButtonContainer,
  BackButton,
  ProductNotFound,
  VariantError
} from './product-detail.styles';

const ProductDetail = ({ allItems, addItem }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [variantError, setVariantError] = useState('');

  useEffect(() => {
    if (allItems && allItems.length > 0) {
      const foundProduct = allItems.find(item => item.id === parseInt(productId));
      setProduct(foundProduct);

      // Reset variant selections when product changes
      setSelectedSize(null);
      setSelectedColor(null);
      setVariantError('');
    }
  }, [productId, allItems]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setVariantError('');
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setVariantError('');
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Check if variants are required and selected
    const hasVariants = (product.sizes && product.sizes.length > 0) ||
                       (product.colors && product.colors.length > 0);

    if (hasVariants) {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setVariantError('Please select a size');
        return;
      }
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setVariantError('Please select a color');
        return;
      }
    }

    // Add product with variant info
    const productWithVariants = {
      ...product,
      selectedSize,
      selectedColor,
      variantId: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`
    };

    addItem(productWithVariants);
    setVariantError('');
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

          {(product.sizes || product.colors) && (
            <ProductVariants
              sizes={product.sizes}
              colors={product.colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={handleSizeChange}
              onColorChange={handleColorChange}
              stock={product.stock}
            />
          )}

          {variantError && <VariantError>{variantError}</VariantError>}

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
