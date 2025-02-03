
import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaTh, FaList } from "react-icons/fa"; // Importing the icons
import { auth, db } from "../../firebse.js";
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useParams, useNavigate,Link } from 'react-router-dom';
import { getAuth,onAuthStateChanged } from "firebase/auth";
const ProductCardStyleOne = () => {
  const [products, setProducts] = useState([]);
  const [productss, selectedProduct] = useState([]);
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
    const auth = getAuth();
    const db = getFirestore();
  
    // Ensure Firebase is fully initialized and auth state is checked
    await new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve();
        } else {
          alert("Please log in to add products to your cart.");
          return;
        }
      });
    });
  
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to add products to your cart.");
      return;
    }
  
    // Ensure product has an ID
    if (!product || !product.id) {
      alert("Product ID is missing. Cannot add to cart.");
      return;
    }
  
    const sanitizedEmail = user.email.replace(/\ /g, "_");
    console.log("Sanitized Email:", sanitizedEmail);
  
    if (!sanitizedEmail) {
      console.error("Invalid sanitized email.");
      return;
    }
  
    const cartRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart", product.id);
    console.log("Firestore Reference Path:", cartRef.path);
  
    const cartData = {
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      image: product.image,
      availability: product.availability,
      rating: product.rating,
      quantity: 1, // Default quantity
    };
  
    try {
      await setDoc(cartRef, cartData);
      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart: ", error);
    }
  };
  

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  // const handleBuyNow = (product) => {
  //   alert(`Buy Now functionality for ${product.name}`);
  // };

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

  return (
    <div className="p-2 w-[300]">
      

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

      {/* Render Products Based on View Mode */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
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
             <div
  className={`${
    viewMode === "list"
      ? "w-28 h-32 flex-none"
      : "w-full flex justify-center"
  }`}
>
  <img
    src={product.image || "https://via.placeholder.csom/150"}
    alt={product.name}
    className="w-full object-cover rounded-md"
    style={{
      height: viewMode === "list" ? "120px" : "250px",
      width: viewMode === "list" ? "200px" : "300px"
    }} onClick={() => handleProductClick(product.id)}
  />
  
  
</div>

{/* <div
                className={${
                  viewMode === "list"
                    ? "w-24 h-32 flex-none"
                    : "w-full flex justify-center"
                }}
              >
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-28 object-cover rounded-md"
                />
              </div>  */}

              {/* Product Details */}
              <div className="flex flex-col flex-grow h-[140px]">
                {/* SKU, Brand, and Price - Grid View */}
                {viewMode === "grid" && (
                  <div className="flex flex-col mt-2">
                    <h3 className="text-lg font-semibold ">{product.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    <p className="text-sm text-gray-500">
                      Brand: {product.brand}
                    </p>
                    <p className="text-xl font-semibold text-black">
                      ${product.price}
                    </p>
                  </div>
                )}

                {/* SKU, Brand, and Price - List View */}
                {viewMode === "list" && (
  <div className="grid grid-cols-6 gap-6 ">
    {/* Product Name Moved to the Top */}
    <h3 className="text-lg font-semibold whitespace-nowrap col-span-6 ml-4">
      {product.name}
    </h3>

    <p className="text-1xl text-gray-900 ml-4 mt-2">{product.sku}</p>
    <p className="text-1xl text-gray-900 ml-2 mt-2"> {product.brand}</p>
    <p className="text-1xl font-semibold text-black ml-10 mt-2">${product.price}</p>
    <p
      className={`text-sm ml-12 ${
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
              <div className="flex space-x-8 mt-4 w-full justify-start">
                <button  onClick={() => handleAddToCart(product)}    className="py-1 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Add to Cart
                </button>
               
             
  <button  onClick={() => handleProductClick(product.id)} className="py-1 px-3 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
    Buy Now
  </button>



              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No products available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCardStyleOne;