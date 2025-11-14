import styled from 'styled-components';

export const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

export const BreadcrumbContainer = styled.div`
  margin-bottom: 30px;
  font-size: 14px;
  color: #666;

  span {
    margin: 0 8px;
  }
`;

export const BreadcrumbLink = styled.span`
  color: #4a4a4a;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

export const BreadcrumbCurrent = styled.span`
  color: #000;
  font-weight: 500;
`;

export const ProductContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-top: 20px;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

export const ProductImageContainer = styled.div`
  width: 100%;
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ProductInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ProductTitle = styled.h1`
  font-size: 32px;
  font-weight: 400;
  margin: 0;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ProductPrice = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #000;
  margin: 10px 0;
`;

export const ProductDescription = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #4a4a4a;
  margin: 20px 0;
`;

export const ProductMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
`;

export const ProductSKU = styled.span`
  font-size: 14px;
  color: #666;
`;

export const ProductCategory = styled.span`
  font-size: 14px;
  color: #666;
  text-transform: capitalize;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;

  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

export const BackButton = styled.button`
  min-width: 165px;
  width: auto;
  height: 50px;
  letter-spacing: 0.5px;
  line-height: 50px;
  padding: 0 35px 0 35px;
  font-size: 15px;
  background-color: white;
  color: black;
  text-transform: uppercase;
  font-family: 'Open Sans Condensed';
  font-weight: bolder;
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: black;
    color: white;
    border: none;
  }
`;

export const ProductNotFound = styled.div`
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: 40px;

  h2 {
    font-size: 32px;
    margin-bottom: 20px;
    color: #4a4a4a;
  }

  p {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
  }
`;
