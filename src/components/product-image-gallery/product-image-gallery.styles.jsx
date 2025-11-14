import styled from 'styled-components';

export const GalleryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

export const MainImageContainer = styled.div`
  width: 100%;
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  cursor: zoom-in;

  @media screen and (max-width: 800px) {
    min-height: 400px;
  }
`;

export const MainImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
  transform: ${({ isZoomed }) => (isZoomed ? 'scale(1.5)' : 'scale(1)')};
`;

export const ZoomOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
`;

export const ThumbnailContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  max-width: 100%;

  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${({ isSelected }) => (isSelected ? '#000' : 'transparent')};
  transition: all 0.2s ease;
  background: #f8f8f8;

  &:hover {
    border-color: ${({ isSelected }) => (isSelected ? '#000' : '#666')};
    transform: scale(1.05);
  }
`;
