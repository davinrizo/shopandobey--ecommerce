import React from 'react';

import {
  VariantsContainer,
  VariantSection,
  VariantLabel,
  VariantOptions,
  VariantOption,
  ColorSwatch,
  StockBadge
} from './product-variants.styles';

const ProductVariants = ({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  stock
}) => {
  const isInStock = (variant) => {
    if (!stock) return true;
    return stock[variant] === undefined || stock[variant] > 0;
  };

  const getStockLevel = (variant) => {
    if (!stock || stock[variant] === undefined) return null;
    const stockCount = stock[variant];
    if (stockCount === 0) return 'Out of Stock';
    if (stockCount < 5) return 'Low Stock';
    return null;
  };

  return (
    <VariantsContainer>
      {sizes && sizes.length > 0 && (
        <VariantSection>
          <VariantLabel>
            Size: <strong>{selectedSize || 'Select a size'}</strong>
          </VariantLabel>
          <VariantOptions>
            {sizes.map((size) => (
              <VariantOption
                key={size}
                onClick={() => isInStock(size) && onSizeChange(size)}
                isSelected={selectedSize === size}
                isDisabled={!isInStock(size)}
              >
                {size}
                {getStockLevel(size) && (
                  <StockBadge isLow={getStockLevel(size) === 'Low Stock'}>
                    {getStockLevel(size)}
                  </StockBadge>
                )}
              </VariantOption>
            ))}
          </VariantOptions>
        </VariantSection>
      )}

      {colors && colors.length > 0 && (
        <VariantSection>
          <VariantLabel>
            Color: <strong>{selectedColor || 'Select a color'}</strong>
          </VariantLabel>
          <VariantOptions>
            {colors.map((color) => (
              <ColorSwatch
                key={color}
                onClick={() => isInStock(color) && onColorChange(color)}
                color={color}
                isSelected={selectedColor === color}
                isDisabled={!isInStock(color)}
                title={color}
              >
                {color === selectedColor && '✓'}
              </ColorSwatch>
            ))}
          </VariantOptions>
        </VariantSection>
      )}
    </VariantsContainer>
  );
};

export default ProductVariants;
