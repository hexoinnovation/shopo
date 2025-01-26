// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Compair from "../icons/Compair";
// import QuickViewIco from "../icons/QuickViewIco";
// import Star from "../icons/Star";
// import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebse";
// import { getAuth } from "firebase/auth";
// import ThinLove from "../icons/ThinLove";

// export default function ProductCardStyleOne({ datas, type, product }) {

//   const [isPink, setIsPink] = useState(false);

//   useEffect(() => {
//     const fetchWishlistStatus = async () => {
//       if (!datas || !datas.id) return;

//       const auth = getAuth();
//       const currentUser = auth.currentUser;

//       if (currentUser) {
//         const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
//         const wishlistRef = doc(db, "users", sanitizedEmail, "wishlist", datas.id);

//         try {
//           const docSnap = await getDoc(wishlistRef);
//           if (docSnap.exists()) {
//             setIsPink(true); // Product is already in the wishlist
//           } else {
//             setIsPink(false); // Product is not in the wishlist
//           }
//         } catch (error) {
//           console.error("Error checking wishlist status: ", error);
//         }
//       }
//     };

//     fetchWishlistStatus();
//   }, [datas]);

//   const handleWishlistClick = async () => {
//     if (!datas || !datas.id) {
//       alert("Invalid product data.");
//       return;
//     }

//     const auth = getAuth();
//     const currentUser = auth.currentUser;

//     if (currentUser) {
//       const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
//       const wishlistRef = doc(db, "users", sanitizedEmail, "wishlist", datas.id);

//       try {
//         if (isPink) {
//           // Remove from wishlist
//           await deleteDoc(wishlistRef);
//           console.log("Product removed from wishlist.");
//           setIsPink(false);
//         } else {
//           // Add to wishlist
//           await setDoc(wishlistRef, datas);
//           console.log("Product added to wishlist.");
//           setIsPink(true);
//         }
//       } catch (error) {
//         console.error("Error updating wishlist: ", error);
//         alert("An error occurred. Please try again.");
//       }
//     } else {
//       alert("Please log in to manage your wishlist.");
//     }
//   };

//   const [products, setProducts] = useState([]);

//   const fetchProducts = async () => {
//     try {
//       const collectionRef = collection(db, "Products");
//       const querySnapshot = await getDocs(collectionRef);

//       const fetchedProducts = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       // Remove duplicates based on 'id'
//       const uniqueProducts = Array.from(
//         new Map(fetchedProducts.map((item) => [item.id, item])).values()
//       );

//       setProducts(uniqueProducts);
//       console.log("Fetched Products:", uniqueProducts); // Log unique products
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       alert("Failed to fetch products. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []); // Empty dependency array ensures this runs only once on initial render

//   return (
   
//       <div>
//         <h2>Product List</h2>
//         <div className="product-grid">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <div key={product.id} className="product-card">
//                 <h3>{product.name}</h3>
//                 <p><strong>Price:</strong> ${product.price}</p>
//                 <p><strong>Description:</strong> {product.description}</p>
//                 <p><strong>Stock:</strong> {product.stock}</p>
//                 <p><strong>Category:</strong> {product.category}</p>
//                 <p><strong>SKU:</strong> {product.sku}</p>
//                 <p><strong>Discount Price:</strong> ${product.discountPrice || "N/A"}</p>
//                 <p><strong>Tags:</strong> {product.tags?.join(", ")}</p>
//                 <p><strong>Brand:</strong> {product.brand}</p>
//                 <p><strong>Dimensions:</strong> {product.dimensions}</p>
//                 <p><strong>Additional Notes:</strong> {product.additionalNotes}</p>
//                 <p><strong>Shipping Weight:</strong> {product.shippingWeight}</p>
//                 <p><strong>Shipping Class:</strong> {product.shippingClass}</p>
//                 <p><strong>Tax Class:</strong> {product.taxClass}</p>
//                 <p><strong>Product URL:</strong> <a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a></p>
//                 <p><strong>Availability:</strong> {product.availability}</p>
//               </div>
//             ))
//           ) : (
//             <p>No products available.</p>
//           )}
//         </div>
//       </div>
    
//   );
// }








import React, { useState, useEffect } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth,db } from "../../firebse";
import { collection, getDocs } from "firebase/firestore";
import { getFirestore, doc, setDoc,deleteDoc,query,where } from "firebase/firestore";
const ProductCardStyleOne = () => {
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(8); // Default to 8
  const navigate = useNavigate();
  
  const [loginPrompt, setLoginPrompt] = useState(false); 
  const [error, setError] = useState('');  // Add state for error message
  const [successMessage, setSuccessMessage] = useState(''); // Success message
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);



const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false); // Initially set to false   
  

  // Adjust productsPerPage based on screen size
  const adjustProductsPerPage = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1024) {
      setProductsPerPage(8); // 8 for larger screens
    } else {
      setProductsPerPage(4); // 4 for smaller screens
    }
  };

  useEffect(() => {
    fetchProducts();
    adjustProductsPerPage(); // Set initial productsPerPage
    window.addEventListener("resize", adjustProductsPerPage); // Listen to resize events
    return () => window.removeEventListener("resize", adjustProductsPerPage);
  }, []);

  // const handleSubcategorySelect = (subcategory) => {
  //   setSelectedSubcategory(subcategory);
  //   setCurrentPage(1);
  // };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = (selectedSubcategory || "")
  ? products.filter((product) => {
      const subcategory = product.subcategory || "";
      return subcategory.trim().toLowerCase() === selectedSubcategory.trim().toLowerCase();
    })
  : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1); // Assuming `setCartCount` is a state setter
  };
  
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      setLoginPrompt(true);
    } else {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
  
      if (user) {
        // Check if the product is already in the cart
        const productInCart = cartItems.find((item) => item.id === product.id);
        if (productInCart) {
          // Optionally, update the quantity if the product is already in the cart
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity } // Increment quantity by the selected quantity
                : item
            )
          );
        } else {
          const productToAdd = { ...product, quantity };  // Ensure you are using the quantity state correctly
          setCartItems((prevItems) => [...prevItems, productToAdd]); // Update local cart state
        }
  
        try {
          const userCartRef = collection(db, "users", user.email, "AddToCart");
          await setDoc(doc(userCartRef, product.id.toString()), { ...product, quantity });  // Save with the quantity
          setSuccessMessage("Your product has been added to the cart successfully!");
          incrementCartCount();
         // navigate("/cart");
        } catch (error) {
          console.error("Error adding product to Firestore:", error);
          setErrorMessage("Failed to add product to the cart.");
        }
      }
    }
  };
  
  // Toggle modal visibility
const handleModalToggle = () => {
  handleDropdownClick()
  setShowModal(!showModal); // Toggle modal visibility
};
const handleSubcategorySelect = (subcategory) => {
  console.log("Selected Subcategory:", subcategory); // Debugging
  setSelectedSubcategory(subcategory);
};


const handleCategoryClick = (category) => {
  setSelectedSubcategory(category);
}; 

// Fetch products from Firestore
const fetchProducts = async () => {
  try {
    const collectionRef = collection( db, "admin","nithya123@gmail.com",
      "products");
    const snapshot = await getDocs(collectionRef);

    // Map the data
    const productsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setProducts(productsList);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

useEffect(() => {
  fetchProducts();
}, []);


  return (

    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Product List</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6">
      {products.map((product) => (
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
          <p className="text-lg font-bold text-gray-800">${product.price}</p>
          <p
            className={`text-sm mt-2 ${
              product.availability === "In Stock"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.availability}
          </p>
        </div>
      ))}


 {/* Success or Error Message */}
 {successMessage && (
  <div className="flex items-center bg-white-500 text-yellow-800 p-3 rounded-lg shadow-lg mb-4 animate-slideIn">
  <FaShoppingCart className="mr-3 text-7xl animate-bounce" />
  <div className="flex flex-col">
    <p className="text-center text-lg font-bold">{successMessage}</p>
  </div>
</div>
)}



      
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  currentPage === index + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
 
   
  );
};
export default ProductCardStyleOne;