import styled from 'styled-components';

export const VariantsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 25px 0;
  padding: 25px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
`;

export const VariantSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const VariantLabel = styled.div`
  font-size: 14px;
  color: #4a4a4a;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  strong {
    color: #000;
    font-weight: 600;
  }
`;

export const VariantOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const VariantOption = styled.button`
  min-width: 60px;
  height: 40px;
  padding: 0 16px;
  border: 2px solid ${({ isSelected, isDisabled }) =>
    isDisabled ? '#e0e0e0' : isSelected ? '#000' : '#ccc'};
  background: ${({ isSelected, isDisabled }) =>
    isDisabled ? '#f5f5f5' : isSelected ? '#000' : '#fff'};
  color: ${({ isSelected, isDisabled }) =>
    isDisabled ? '#999' : isSelected ? '#fff' : '#000'};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover {
    border-color: ${({ isDisabled }) => (isDisabled ? '#e0e0e0' : '#000')};
    background: ${({ isDisabled, isSelected }) =>
      isDisabled ? '#f5f5f5' : isSelected ? '#000' : '#f8f8f8'};
  }

  &:active {
    transform: ${({ isDisabled }) => (isDisabled ? 'none' : 'scale(0.95)')};
  }
`;

export const ColorSwatch = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${({ isSelected, isDisabled }) =>
    isDisabled ? '#e0e0e0' : isSelected ? '#000' : '#ccc'};
  background: ${({ color, isDisabled }) => (isDisabled ? '#f5f5f5' : color.toLowerCase())};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  position: relative;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.4 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => {
    const darkColors = ['black', 'navy', 'brown', 'gray', 'grey', 'charcoal'];
    return darkColors.some(dark => color.toLowerCase().includes(dark)) ? '#fff' : '#000';
  }};
  font-size: 18px;
  font-weight: bold;

  &:hover {
    transform: ${({ isDisabled }) => (isDisabled ? 'none' : 'scale(1.1)')};
    box-shadow: ${({ isDisabled }) =>
      isDisabled ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
  }

  &:active {
    transform: ${({ isDisabled }) => (isDisabled ? 'none' : 'scale(0.95)')};
  }
`;

export const StockBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${({ isLow }) => (isLow ? '#ff6b00' : '#ff0000')};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;
