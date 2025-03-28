import Cart from "../../../Cart";
import Compair from "../../../Helpers/icons/Compair";
import ThinBag from "../../../Helpers/icons/ThinBag";
import ThinLove from "../../../Helpers/icons/ThinLove";
import ThinPeople from "../../../Helpers/icons/ThinPeople";
import SearchBox from "../../../Helpers/SearchBox";
import { Link } from "react-router-dom";
import { getFirestore, doc, onSnapshot,collection, getDocs,getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
// import { db } from "../../../firebse";  // Firebase import


export default function Middlebar({ className, type }) {
  const [cartCount, setCartCount] = useState(0);
  const [User, setUser] = useState(0);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
const[product, setProduct] = useState(0);
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);
  }, []);
  
  
    const fetchCartCount = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
    
      if (!user) {
        setCartCount(0); // Reset count when no user is logged in
        return;
      }
    
      const sanitizedEmail = user.email.replace(/\ /g, "_").replace(/ /g, "_at_");
      const cartRef = collection(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart");
    
      try {
        const cartSnapshot = await getDocs(cartRef);
        setCartCount(cartSnapshot.size); // Set count based on the number of cart items
      } catch (error) {
        console.error("Error fetching cart count: ", error);
      }
    };
    useEffect(() => {
      fetchCartCount();
    }, []);
    
  
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
          const wishlistCollectionRef = collection(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "wishlist");
          const snapshot = await getDocs(wishlistCollectionRef);
          setWishlistCount(snapshot.size); // Count of documents in the wishlist
        } catch (error) {
          console.error("Error fetching wishlist count: ", error);
        }
      }
    };

    fetchWishlistCount();
  }, []); 

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleWishlistClick = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setShowLoginPopup(true);
    }
  };
   
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return; // Ensure db is available

    const fetchLogo = async () => {
      try {
        setLoading(true);
        console.log("Fetching image from Firestore...");
    
        const docRef = doc(db, "admin", "nithya123@gmail.com", "webimages", "images13");
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Firestore Document Data:", data);
    
          if (data.image) {
            setLogoUrl(data.image);
            console.log("Image URL Set:", data.image);
          } else {
            console.warn("Document exists but no 'image' field found!");
          }
        } else {
          console.error("No image found in Firestore!");
        }
      } catch (err) {
        console.error("Error fetching logo image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [db]);


  return (
    <div className={`w-full h-[86px] bg-white ${className}`}>
      <div className="container-x mx-auto h-full">
        <div className="relative h-full">
          <div className="flex justify-between items-center h-full">
          <div>
          {type === 3 ? (
  <Link to="/">
    {!loading && logoUrl ? (
      <img width="152" height="36" src={logoUrl} alt="logo" />
    ) : (
      <p>Loading logo...</p>
    )}
  </Link>
) : null}
    </div>
            <div className="w-[517px] h-[44px]">
              <SearchBox type={type} className="search-com" />
            </div>
            <div className="flex space-x-6 items-center">
              {/* <div className="compaire relative">
                <Link to="/products-compaire">
                  <span>
                    <Compair />
                  </span>
                </Link>
                <span
                  className={`w-[18px] h-[18px] rounded-full absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] ${
                    type === 3 ? "bg-qh3-blue text-white" : "bg-qyellow"
                  }`}
                >
                  2
                </span>
              </div> */}
              <div className="favorite relative group relative py-4">
              <div className="favorite relative cursor-pointer">
      <Link to="/wishlist">
        <span>
          <ThinLove /> {/* Add the ThinLove component or your heart icon */}
        </span>
      </Link>
      <span
      className={`w-[18px] h-[18px] rounded-full absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] ${
       type === 3 ? "bg-qh3-blue text-white" : "bg-qyellow"
      }`}
    >
      {wishlistCount}
    </span>
    </div>
    </div>
    
              <div className="cart-wrapper group relative py-4">
                <div className="cart relative cursor-pointer">
                  <Link to="/cart">
                    <span>
                      <ThinBag />
                    </span>
                  </Link>
                  <span
                    className={`w-[18px] h-[18px] rounded-full absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px] ${
                      type === 3 ? "bg-qh3-blue text-white" : "bg-qyellow"
                    }`}
                  >
                    {cartCount}
                  </span>
                </div>
                <Cart
                  type={type}
                  className="absolute -right-[45px] top-11 z-50 hidden group-hover:block"
                />
              </div>
              <div>
                <Link to="/profile">
                  <span>
                    <ThinPeople />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
