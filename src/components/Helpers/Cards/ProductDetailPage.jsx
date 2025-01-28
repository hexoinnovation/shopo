// ProductDetailPage.js
import React from 'react';
import { useNavigate} from 'react-router-dom';
import ProductCardStyleOne from './ProductCardStyleOne';
import ProductView from '../../SingleProductPage/ProductView';

const ProductDetailPage = () => {
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };
  return (
   
    <div className="sm:mt-20 mt-10">
    <Routes>
      <Route path="/" element={<ProductCardStyleOne />} />
      <Route path="/product/:id" element={<ProductView />} />
    </Routes>
  </div>
  );
};

export default ProductDetailPage;
