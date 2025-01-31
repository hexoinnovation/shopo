import { useState,useEffect  } from "react";
import Star from "../Helpers/icons/Star";
import Selectbox from "../Helpers/Selectbox";
import { getFirestore, doc, updateDoc, arrayUnion,getDoc,setDoc,deleteDoc ,getDocs,collection } from "firebase/firestore";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../firebse";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate,useParams, } from "react-router-dom";
import TopBar from "../Partials/Headers/HeaderOne/TopBar";
import Middlebar from "../Partials/Headers/HeaderOne/Middlebar";
import Navbar from "../Partials/Headers/HeaderOne/Navbar";
import Footer from "../Partials/Footers/Footer";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ProductView({ className }) {
  const[products,setProducts]=useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  // const [src, setSrc] = useState(products[0].src);
  const [selectedColor, setSelectedColor] = useState(""); // Initialize with an empty string or default color
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
const [selectedSize, setSelectedSize] = useState("");
const [quantity, setQuantity] = useState(1);
//const [isFavorite, setIsFavorite] = useState(false);
const changeImgHandler = (color) => setSelectedColor(color);
const selectSizeHandler = (size) => setSelectedSize(size);
const increment = () => setQuantity((prev) => prev + 1);
const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
const [isInWishlist, setIsInWishlist] = useState(false); // Track if product is in the wishlist
const [message, setMessage] = useState(""); // Message to show user
const [isLoading, setIsLoading] = useState(false);
const handleAddToCart = async () => {
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

  if (!products || !products.id) {
    alert("Product ID is missing. Cannot add to cart.");
    return;
  }

  const sanitizedEmail = user.email.replace(/\ /g, "_").replace(/ /g, "_at_");
  console.log("Sanitized Email:", sanitizedEmail);

  if (!sanitizedEmail) {
    console.error("Invalid sanitized email.");
    return;
  }

  const cartRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart", products.id);
  console.log("Firestore Reference Path:", cartRef.path);

  const cartData = {
    name: products.name,
    price: products.price,
    category: products.category,
    brand: products.brand,
    image: products.image,
    availability: products.availability,
    rating: products.rating,
    quantity: quantity,
  };

  // Check for any missing or undefined values in cartData
  for (const key in cartData) {
    if (cartData[key] === undefined || cartData[key] === null) {
      console.error(`Missing value for ${key}`);
      return;
    }
  }

  try {
    await setDoc(cartRef, cartData);
    alert("Product added to cart!");
  } catch (error) {
    console.error("Error adding product to cart: ", error);
  }
};


const fetchProduct = async (id) => {
  try {
    const docRef = doc(db, "admin", "nithya123@gmail.com", "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const productData = docSnap.data();
      setProducts({
        ...productData,
        id: docSnap.id,  // Make sure to add the product ID here
      });
      setRating(productData.rating || 0);
      setTotalReviews(productData.totalReviews || 0);
      setLoading(false);
    } else {
      console.error("No product found!");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

  
  useEffect(() => {
  if (id) {
    setLoading(true);
    fetchProduct(id);
  }
}, [id]);


  //  useEffect(() => {
  //   if (id) {
  //     setLoading(true); // Set loading to true when fetching starts
  //     fetchProduct(id); // Call fetchProduct with the correct 'id'
  //   }
  // }, [id]); 

  const navigate = useNavigate();


  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToWishlist = async () => {
    const auth = getAuth();
    const db = getFirestore();

    // Check if the user is logged in
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add products to your wishlist.");
      return;
    }

    const sanitizedEmail = user.email.replace(/\ /g, "_").replace(/ /g, "_at_");
    const wishlistRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "wishlist", products.id);

    setIsLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await deleteDoc(wishlistRef);
        setMessage("Product removed from wishlist.");
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        const wishlistData = {
          name: products.name,
          price: products.price,
          category: products.category,
          brand: products.brand,
          image: products.image,
          availability: products.availability,
          rating: products.rating,
        };
        await setDoc(wishlistRef, wishlistData);
        setMessage("Product added to wishlist!");
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
      alert("An error occurred, please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const checkWishlist = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const sanitizedEmail = user.email.replace(/\ /g, "_").replace(/ /g, "_at_");
        const wishlistRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "wishlist", products.id);

        // Get the product from the wishlist
        const docSnap = await getDoc(wishlistRef);

        // If the product is found in the wishlist, set `isInWishlist` to true
        if (docSnap.exists()) {
          setIsInWishlist(true);
        }
      }
    };

    checkWishlist();
  }, [products.id]);

 
  return (
    <div>
      <TopBar/>
              <Middlebar/>
              <Navbar/>
        
              <div className={`product-view w-full lg:flex justify-between px-10 py-10 bg-white shadow-md rounded-lg`}> 
      {/* Product Image Section */}
      <div data-aos="fade-right" className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px] flex justify-center">
        <img
          src={products.image || "https://via.placeholder.com/150"}
          alt={products.name}
          className="w-full max-w-md object-cover rounded-lg shadow-lg ml-40"
        />
      </div>

      {/* Product Details Section */}
      <div className="flex-1 ">
        <div className="product-details w-full mt-10 lg:mt-0 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{products.name}</h2>
          <span className="text-lg font-medium text-gray-600 uppercase tracking-wide">{products.category}</span>
          
          {/* Brand */}
          <p className="text-gray-600 mt-2"><strong>Brand:</strong> {products.brand}</p>
          
          {/* Availability */}
          <p className={`mt-2 ${products.availability === "In Stock" ? "text-green-500" : "text-red-500"}`}>
            <strong>Availability:</strong> {products.availability}
          </p>

          {/* Rating */}
          <div className="flex items-center mt-4">
            {[...Array(5)].map((_, index) => (
              <span key={index}>
                {index < products.rating ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-gray-400" />}
              </span>
            ))}
          </div>
          
          {/* Price */}
          <div className="flex items-center mt-4 text-2xl font-bold text-red-500">
            ₹ {products.price}
            {products.discountPrice && (
              <span className="text-xl font-medium text-gray-500 line-through ml-2">₹ {products.discountPrice}</span>
            )}
          </div>
          
          {/* Quantity Selector */}
          <div className="flex items-center mt-6">
            <button onClick={decrement} className="px-4 py-2 text-xl font-bold text-gray-700 border border-gray-300 rounded-l-md">-</button>
            <span className="px-6 py-2 text-xl font-semibold text-gray-800 border-t border-b border-gray-300">{quantity}</span>
            <button onClick={increment} className="px-4 py-2 text-xl font-bold text-gray-700 border border-gray-300 rounded-r-md">+</button>
          </div>
          
          {/* Wishlist & Add to Cart Buttons */}
          <div className="flex items-center mt-6 space-x-4">
          <button
          onClick={handleAddToWishlist}
          disabled={isLoading}
          className={`text-lg ${isInWishlist ? "text-red-500" : "text-gray-500"}`}
        >
          {isInWishlist ? "❤️" : "🤍"} {/* Filled heart if in wishlist, otherwise empty heart */}
        </button>
       
            <button onClick={handleAddToCart} className="px-6 py-3 text-lg font-semibold text-white bg-black rounded-md shadow-md hover:bg-gray-800 transition duration-300">
              ADD TO CART
            </button>
          
          </div>
          {message && <p className="wishlist-message">{message}</p>}
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
