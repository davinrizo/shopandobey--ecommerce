import React, { useState } from 'react';

import {
  GalleryContainer,
  MainImageContainer,
  MainImage,
  ThumbnailContainer,
  Thumbnail,
  ZoomOverlay
} from './product-image-gallery.styles';

const ProductImageGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // If only one image provided (current format), create array
  const imageArray = Array.isArray(images) ? images : [images];

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <GalleryContainer>
      <MainImageContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <MainImage
          src={imageArray[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          isZoomed={isZoomed}
        />
        {isZoomed && <ZoomOverlay>Hover to zoom</ZoomOverlay>}
      </MainImageContainer>

      {imageArray.length > 1 && (
        <ThumbnailContainer>
          {imageArray.map((image, index) => (
            <Thumbnail
              key={index}
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              isSelected={selectedImage === index}
            />
          ))}
        </ThumbnailContainer>
      )}
    </GalleryContainer>
  );
};

export default ProductImageGallery;
