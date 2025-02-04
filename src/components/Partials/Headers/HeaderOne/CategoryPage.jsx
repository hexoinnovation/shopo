
import { useEffect, useState } from "react";
import { getDocs, collection , getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth ,onAuthStateChanged} from "firebase/auth";
import { db } from "../../../firebse";
import Navbar from "./Navbar";
import Middlebar from "./Middlebar";
import TopBar from "./TopBar";
import Footer from "../../Footers/Footer";
import { FaTh, FaList } from "react-icons/fa";
import { useParams, useNavigate,Link } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [priceFilter, setPriceFilter] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) {
          console.error("No user signed in.");
          return;
        }

        const productsCollectionRef = collection(db, "admin", "nithya123@gmail.com", "products");
        const productSnapshot = await getDocs(productsCollectionRef);
        const allProducts = productSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const decodedCategory = decodeURIComponent(categoryName);
        let filteredProducts = allProducts.filter((product) => product.category === decodedCategory);

        // Apply price filter
        filteredProducts = filteredProducts.filter(getPriceRangeFilter(priceFilter));

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryName, priceFilter]); // Added priceFilter dependency

  const getPriceRangeFilter = (range) => {
    return (product) => {
      const price = parseFloat(product.price);
      if (isNaN(price)) return false;

      switch (range) {
        case "under50":
          return price < 50;
        case "50to100":
          return price >= 50 && price <= 100;
        case "100to200":
          return price > 100 && price <= 200;
        case "over200":
          return price > 200;
        default:
          return true; // Show all products if no filter selected
      }
    };
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
  
    const filteredProducts = products.filter(getPriceRangeFilter(priceFilter));
  return (
    <div>
      <TopBar />
      <Middlebar />
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Products in {decodeURIComponent(categoryName)}</h2>

        {/* Price Filter & View Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
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

          {/* <div className="flex space-x-3">
            <button className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setViewMode("grid")}>
              <FaTh size={20} />
            </button>
            <button className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setViewMode("list")}>
              <FaList size={20} />
            </button>
          </div> */}
        </div>

        {/* Product Display */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" : "space-y-6"}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={`border p-2 ${viewMode === "list" ? "flex items-center space-x-6" : "flex flex-col"}`}>
                <div className={viewMode === "list" ? "w-28 h-32 flex-none" : "w-full flex justify-center"}>
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                    className="w-full object-cover rounded-md"
                    style={{ height: viewMode === "list" ? "120px" : "250px", width: viewMode === "list" ? "200px" : "300px" }}
                    onClick={() => handleProductClick(product.id)}
                  />
                </div>
                <div className="flex flex-col flex-grow h-[140px]">
                  <h3 className="text-lg font-semibold ">{product.name}</h3>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  <p className="text-sm text-gray-500">Brand: {product.brand}</p>
                  <p className="text-xl font-semibold text-black">₹{product.price}</p>
                </div>
                <div className="flex space-x-10 mb-0 w-full justify-start ">
                  <button onClick={() => handleAddToCart(product)} className="py-1 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600  ">Add to Cart</button>
                  <button onClick={() => handleProductClick(product.id)} className="py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600">Buy Now</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No products available.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;