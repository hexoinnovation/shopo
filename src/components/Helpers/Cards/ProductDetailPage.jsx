// ProductDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductCardStyleOne from './ProductCardStyleOne';

const ProductDetailPage = () => {
  const { productId } = useParams(); // Get productId from URL

  return (
    <div className="product-detail-page">
      <ProductCardStyleOne productId={productId} />
    </div>
  );
};

export default ProductDetailPage;
