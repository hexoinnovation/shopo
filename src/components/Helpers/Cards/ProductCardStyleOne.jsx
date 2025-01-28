import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaTh, FaList } from "react-icons/fa"; // Importing the icons
import { auth, db } from "../../firebse.js";
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom"; 
const ProductCardStyleOne = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // State for toggling view mode
  const [priceFilter, setPriceFilter] = useState(""); // Dropdown value for price filter
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const collectionRef = collection(
        db,
        "admin",
        "nithya123@gmail.com",
        "products"
      );
      const snapshot = await getDocs(collectionRef);

      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Remove duplicates based on 'id'
      const uniqueProducts = Array.from(
        new Map(productsList.map((item) => [item.id, item])).values()
      );

      setProducts(uniqueProducts); // Set products state with unique products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (product) => {
    if (!auth.currentUser) {
      setErrorMessage("Please log in to add products to the cart.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const productInCart = cartItems.find((item) => item.id === product.id);
      if (productInCart) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setCartItems((prevItems) => [...prevItems, { ...product, quantity }]);
      }

      try {
        const userCartRef = collection(db, "users", user.email, "AddToCart");
        await setDoc(doc(userCartRef, product.id.toString()), {
          ...product,
          quantity,
        });
        setSuccessMessage("Product added to cart successfully!");
        setCartCount(cartCount + 1); // Update cart count
      } catch (error) {
        setErrorMessage("Failed to add product to cart.");
      }
    }
  };

  const handleBuyNow = (product) => {
    alert(`Buy Now functionality for ${product.name}`);
  };

  // Filter products based on the selected price range
  const getPriceRangeFilter = (range) => {
    switch (range) {
      case "under50":
        return (product) => product.price < 50;
      case "50to100":
        return (product) => product.price >= 50 && product.price <= 100;
      case "100to200":
        return (product) => product.price > 100 && product.price <= 200;
      case "over200":
        return (product) => product.price > 200;
      default:
        return () => true; // No filter if no range is selected
    }
  };

  // Apply price filter
  const filteredProducts = products.filter(getPriceRangeFilter(priceFilter));
  
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  return (
    <div className="p-2">
      {/* Success or Error Message */}
      {successMessage && (
        <div className="flex items-center bg-green-500 text-white p-3 rounded-lg shadow-lg mb-2">
          <FaShoppingCart className="mr-3 text-7xl animate-bounce" />
          <div className="flex flex-col">
            <p className="text-lg font-bold">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center bg-red-500 text-white p-3 rounded-lg shadow-lg mb-4">
          <FaShoppingCart className="mr-3 text-7xl animate-bounce" />
          <div className="flex flex-col">
            <p className="text-lg font-bold">{errorMessage}</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">Product List</h1>

      {/* Controls for Price Filter, Grid/List View */}
      <div className="flex justify-between mb-4 items-center">
        {/* Price Filter Dropdown */}
        <div className="flex items-center">
          <label htmlFor="priceFilter" className="mr-2">
            Filter by Price:
          </label>
          <select
            id="priceFilter"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Prices</option>
            <option value="under50">Under $50</option>
            <option value="50to100">$50 - $100</option>
            <option value="100to200">$100 - $200</option>
            <option value="over200">Over $200</option>
          </select>
        </div>

        {/* View Mode Icons */}
        <div className="flex space-x-3">
          <button
            className={`${
              viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 rounded-lg`}
            onClick={() => setViewMode("grid")}
          >
            <FaTh size={20} />
          </button>
          <button
            className={`${
              viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
            } p-2 rounded-lg`}
            onClick={() => setViewMode("list")}
          >
            <FaList size={20} />
          </button>
        </div>
      </div>

      <div
  className={`${
    viewMode === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      : "space-y-6"
  }`}
>
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <div
        key={product.id}
        className={`${
          viewMode === "list"
            ? "flex items-center space-x-6 border p-4"
            : "border p-4 flex flex-col"
        }`}
      >
        {/* Image Container */}
        <div
          className={`${
            viewMode === "list"
              ? "w-28 h-32 flex-none mb-10" // for list view
              : "w-full flex justify-center" // for grid view
          }`}
        >
          
       
          <img
  src={product.image || "https://via.placeholder.com/150"}
  alt={product.name || "Product Image"}
  className="object-cover rounded-md"
  onClick={() => handleProductClick(product?.id)} // Ensure product.id is accessed safely
  style={{
    height: viewMode === "list" ? "150px" : "250px", // Different height for list and grid
    width: viewMode === "list" ? "150px" : "340px", // Different width for list and grid
  }}
/>

 
        </div>
        {/* Product Details */}
        <div className="flex flex-col flex-grow">
          {/* SKU, Brand, and Price - Grid View */}
          {viewMode === "grid" && (
            <div className="flex flex-col mt-2">
              <h3 className="text-lg font-semibold ">{product.name}</h3>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              <p className="text-sm text-gray-500">Brand: {product.brand}</p>
              <p className="text-xl font-semibold text-black">${product.price}</p>
            </div>
          )}

          {/* SKU, Brand, and Price - List View */}
          {viewMode === "list" && (
            <div className="grid grid-cols-6 gap-24 mt-4">
              <h3 className="text-lg font-bold ">{product.name}</h3>
              <p className="text-sm text-gray-900">SKU: {product.sku}</p>
              <p className="text-sm text-gray-900">Brand: {product.brand}</p>
              <p className="text-1xl font-semibold text-black">${product.price}</p>
              <p
                className={`text-sm ${
                  product.availability === "In Stock"
                    ? "text-green-600"
                    : "text-red-900"
                }`}
              >
                {product.availability}
              </p>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="flex space-x-8 mt-4 w-full justify-start ">
          <button
            onClick={() => handleAddToCart(product)}
            className="py-1 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600  "
          >
            Add to Cart
          </button>
          <button
            onClick={() => handleBuyNow(product)}
            className="py-1 px-3 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 "
          >
            Buy Now
          </button>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center text-gray-500">No products available.</div>
  )}
</div>
</div>
  );
};

export default ProductCardStyleOne;
