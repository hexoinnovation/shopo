import { getFirestore, doc, onSnapshot, setDoc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";

export default function Cart({ className, type }) {
  const [cartItems, setCartItems] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

 
  useEffect(() => {
    if (user) {
      const sanitizedEmail = user.email ? user.email.replace(/\ /g, "_") : "unknown_user";
  
      // Reference to the 'cart' collection for the specific user
      const cartRef = collection(db, "users", sanitizedEmail, "cart");
  
      // Debug: Log the collection path
      console.log("Listening to collection path:", `users/${sanitizedEmail}/cart`);
  
      // Listen to all documents in the 'cart' collection
      const unsubscribe = onSnapshot(
        cartRef,
        (querySnapshot) => {
          const items = [];
  
          // Debug: Log the number of documents in the snapshot
          console.log("Snapshot size:", querySnapshot.size);
  
          querySnapshot.forEach((doc) => {
            const data = doc.data();
  
            // Debug: Log the document ID and data
            console.log("Document ID:", doc.id);
            console.log("Document data:", data);
  
            if (Array.isArray(data.items)) {
              // Debug: Log the items being pushed
              console.log("Items in document:", data.items);
              items.push(...data.items);
            } else {
              // Debug: Log if the items array is missing or not an array
              console.warn(`Document ${doc.id} does not have a valid 'items' array.`);
            }
          });
  
          // Debug: Log the final collected items array
          console.log("Final items array:", items);
  
          setCartItems(items);
        },
        (error) => {
          // Debug: Log any errors with the snapshot listener
          console.error("Error fetching cart data:", error);
        }
      );
  
      // Cleanup the listener on unmount
      return () => unsubscribe();
    }
  }, [user, db]);
  
    const getImageSource = (image) => {
      if (typeof image === "string" && (image.startsWith("data:image/") || image.startsWith("http"))) {
        return image; // Return the image directly if valid
      }
      return "default-image-path.jpg"; // Default image for invalid cases
    };
    

  // Handle removing items from the cart
  const handleRemoveItem = async (itemId) => {
    if (user) {
      const sanitizedEmail = user.email ? user.email.replace(/\./g, "_") : "unknown_user";
      const cartRef = doc(db, "users", sanitizedEmail, "cart", "1"); // Replace with correct cart path
      const updatedItems = cartItems.filter((item) => item.id !== itemId);

      // Update the cart with the removed item
      await setDoc(cartRef, { items: updatedItems });
      alert("Item removed from cart.");
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
                <li key={index} className="w-full h-full flex">
                  <div className="flex space-x-[6px] justify-center items-center px-4 my-[20px]">
                    <div className="w-[65px] h-full">
                      <img
                        src={getImageSource(item.image)}
                        alt={item.title || "Product Image"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-center">
                      <p className="title mb-2 text-[13px] font-600 text-qblack leading-4 line-clamp-2 hover:text-blue-600">
                        {item.title || item.name}
                      </p>
                      <p className="price">
                        <span className="offer-price text-qred font-600 text-[15px] ml-2">
                          ${item.price}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className="mt-[20px] mr-[25px] inline-flex cursor-pointer ml-20"
                    onClick={() => handleRemoveItem(item.id)} // Remove item when clicked
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 8 8"
                      fill="none"
                      className="inline fill-current text-[#AAAAAA] hover:text-qred"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7.76 0.24C7.44 -0.08 6.96 -0.08 6.64 0.24L4 2.88L1.36 0.24C1.04 -0.08 0.56 -0.08 0.24 0.24C-0.08 0.56 -0.08 1.04 0.24 1.36L2.88 4L0.24 6.64C-0.08 6.96 -0.08 7.44 0.24 7.76C0.56 8.08 1.04 8.08 1.36 7.76L4 5.12L6.64 7.76C6.96 8.08 7.44 8.08 7.76 7.76C8.08 7.44 8.08 6.96 7.76 6.64L5.12 4L7.76 1.36C8.08 1.04 8.08 0.56 7.76 0.24Z" />
                    </svg>
                  </span>
                </li>
              ))
            ) : (
              <li className="empty-cart flex justify-center items-center h-80 bg-gray-100 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer animate-bounce">
                <img
                  src="empty.png" // Replace with your empty cart image URL
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
