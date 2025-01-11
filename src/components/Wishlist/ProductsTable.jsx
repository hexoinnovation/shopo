import React, { useState,useEffect } from "react";
import InputQuantityCom from "../Helpers/InputQuantityCom";
import { doc, setDoc ,getDoc, getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebse";
import { getAuth } from "firebase/auth";
import { FaTrash } from "react-icons/fa";

export default function ProductsTable({   }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  
  useEffect(() => {
    const fetchWishlist = async () => {
      console.log("Current User: ", currentUser); // Log the current user
  
      if (!currentUser || !currentUser.email) {
        console.error("User is not logged in");
        return;
      }
  
      try {
        const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
        const wishlistRef = collection(db, "users", sanitizedEmail, "wishlist");
        const querySnapshot = await getDocs(wishlistRef);
  
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist: ", error);
      }
    };
  
    fetchWishlist();
  }, [currentUser]); // Fetch wishlist whenever `currentUser` changes
  
  const handleDelete = async (id) => {
    try {
      const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
      const wishlistRef = doc(db, "users", sanitizedEmail, "wishlist", id);
  
      await deleteDoc(wishlistRef);
      alert("Item deleted successfully!");
      // Optionally, refresh or update your state to reflect changes in the UI
    } catch (error) {
      console.error("Error deleting item: ", error);
      alert("Failed to delete the item.");
    }
  };

  return (
    <div className={`w-full`}>
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {/* Table Heading */}
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap w-[380px]">
                Product
              </td>
              <td className="py-4 whitespace-nowrap text-center">Color</td>
              <td className="py-4 whitespace-nowrap text-center">Size</td>
              <td className="py-4 whitespace-nowrap text-center">Offer Price</td>
              <td className="py-4 whitespace-nowrap text-center">Quantity</td>
              <td className="py-4 whitespace-nowrap text-center">Total</td>
              <td className="py-4 whitespace-nowrap text-right w-[114px] block"></td>
            </tr>

            {/* Table Data */}
            {wishlistItems.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="pl-10 py-4">
                  <div className="flex space-x-6 items-center">
                    <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                      <img
                        src={item.imageUrl || `${import.meta.env.VITE_PUBLIC_URL}/assets/images/default-product.jpg`}
                        alt={item.name || "Product"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <p className="font-medium text-[15px] text-qblack">
                        {item.title || "Unnamed Product"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-center py-4 px-2">
                  <div className="flex justify-center items-center">
                    <span
                      className="w-[20px] h-[20px] block rounded-full"
                      style={{ backgroundColor: item.color || "#E4BC87" }}
                    ></span>
                  </div>
                </td>
                <td className="text-center py-4 px-2">
                  <div className="flex space-x-1 items-center justify-center">
                    <span className="text-[15px] font-normal">
                      {item.size || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="text-center py-4 px-2">
                  <div className="flex space-x-1 items-center justify-center">
                    <span className="text-[15px] font-normal">
                      ${item.offer_price || "0.00"}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex justify-center items-center">
                    <InputQuantityCom quantity={item.quantity || 1} />
                  </div>
                </td>
                <td className="text-right py-4">
                  <div className="flex space-x-1 items-center justify-center">
                    <span className="text-[15px] font-normal">
                      ${item.total || item.price || "0.00"}
                    </span>
                  </div>
                </td>
                <td className="text-right py-4">
                  <div className="flex space-x-1 items-center justify-center">
                  <span
  onClick={() => handleDelete(datas.id)}
  className="cursor-pointer"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className="w-5 h-5 text-gray-400 hover:text-red-500"
    viewBox="0 0 20 20"
  >
    <path d="M6 2a1 1 0 011-1h6a1 1 0 011 1v1h5a1 1 0 010 2h-1v13a2 2 0 01-2 2H4a2 2 0 01-2-2V5H1a1 1 0 110-2h5V2zm2 1v1h4V3H8zm6 6a1 1 0 10-2 0v5a1 1 0 102 0V9zm-4 0a1 1 0 10-2 0v5a1 1 0 102 0V9z" />
  </svg>
</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

