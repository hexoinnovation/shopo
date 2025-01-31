import { getFirestore, doc, onSnapshot, setDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export default function Cart({ className, type }) {
  const [cartItems, setCartItems] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    const sanitizedEmail = user.email.replace(/\ /g, "_at_");
    const cartRef = collection(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart");
    
    try {
      const cartSnapshot = await getDocs(cartRef);
      const cartData = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCartItems(cartData);
    } catch (error) {
      console.error("Error fetching cart items: ", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!user) return;
    const sanitizedEmail = user.email.replace(/\ /g, "_at_");
    const itemRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart", itemId);
    
    try {
      await deleteDoc(itemRef);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item from cart: ", error);
    }
  };

  return (
<div
  style={{ boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }}
  className={`w-[300px] bg-white border-t-[3px] ${type === 3 ? "border-qh3-blue" : "cart-wrapper"} ${className || ""}`}
>
  <div className="w-full h-full">
    <div className="product-items h-[310px] overflow-y-scroll">
      <ul>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <li key={index} className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              
              {/* Product Image */}
              <div className="w-[65px] h-[65px] flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title || "Product Image"}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0 px-3">
                <p className="text-[13px] font-semibold text-qblack leading-4 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title || item.name}
                </p>
                <p className="text-[12px] text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.category}
                </p>
                <p className="text-[14px] font-semibold text-qred mt-1">₹{item.price}</p>
              </div>

              {/* Remove Icon */}
              <button
                className="p-1 rounded-full hover:bg-gray-200 transition-all"
                onClick={() => handleRemoveItem(item.id)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 8 8"
                  fill="none"
                  className="fill-current text-[#AAAAAA] hover:text-qred"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.76 0.24C7.44 -0.08 6.96 -0.08 6.64 0.24L4 2.88L1.36 0.24C1.04 -0.08 0.56 -0.08 0.24 0.24C-0.08 0.56 -0.08 1.04 0.24 1.36L2.88 4L0.24 6.64C-0.08 6.96 -0.08 7.44 0.24 7.76C0.56 8.08 1.04 8.08 1.36 7.76L4 5.12L6.64 7.76C6.96 8.08 7.44 8.08 7.76 7.76C8.08 7.44 8.08 6.96 7.76 6.64L5.12 4L7.76 1.36C8.08 1.04 8.08 0.56 7.76 0.24Z" />
                </svg>
              </button>
            </li>
          ))
        ) : (
          <li className="empty-cart flex justify-center items-center h-80 bg-gray-100 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer animate-bounce">
            <img
              src="empty.png"
              alt="Empty Cart"
              className="empty-cart-image max-w-xs max-h-full object-contain transition-all duration-300 ease-in-out hover:scale-110"
            />
          </li>
        )}
      </ul>
    </div>
  </div>
</div>

  );
}
