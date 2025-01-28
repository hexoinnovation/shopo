import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebse";
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const ProductCardStyleOne = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      // Check if the product is already in the cart
      const productInCart = cartItems.find((item) => item.id === product.id);
      if (productInCart) {
        // Optionally, update the quantity if the product is already in the cart
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

  return (
    <div className="container mx-auto p-4">
      {/* Success or Error Message */}
      {successMessage && (
        <div className="flex items-center bg-green-500 text-white p-3 rounded-lg shadow-lg mb-4">
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

      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {/* Product List */}
      <div className="grid grid-rows-1 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 p-4 rounded-lg shadow-md"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              <p className="text-sm text-gray-500">Brand: {product.brand}</p>
              <p className="text-lg font-bold text-gray-800">
                ${product.price}
              </p>
              <p
                className={`text-sm mt-2 ${
                  product.availability === "In Stock"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.availability}
              </p>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 py-2 px-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductCardStyleOne;
