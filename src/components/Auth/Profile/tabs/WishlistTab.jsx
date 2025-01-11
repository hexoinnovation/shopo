import React, { useState,useEffect } from "react";
import InputQuantityCom from "../../../Helpers/InputQuantityCom";
import { doc, setDoc ,getDoc, getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebse";
import { getAuth } from "firebase/auth";
import { FaTrash } from "react-icons/fa";

export default function WishlistTab({ className }) {


  const [wishlistItems, setWishlistItems] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
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
  }, [currentUser]);

  // Handle delete wishlist item
  const handleDelete = async (id) => {
    try {
      if (!currentUser || !currentUser.email) {
        alert("Please log in to manage your wishlist.");
        return;
      }

      const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
      const wishlistRef = doc(db, "users", sanitizedEmail, "wishlist", id);

      await deleteDoc(wishlistRef);
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item: ", error);
      alert("Failed to delete the item.");
    }
  };



  return (
    <>
      <div className={`w-full ${className || ""}`}>
        <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
           <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <tbody>
                      {/* Table Heading */}
                      <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
                        <td className="py-4 pl-10 block whitespace-nowrap w-[380px]">Product</td>
                        <td className="py-4 whitespace-nowrap text-center">Review</td>
                        <td className="py-4 whitespace-nowrap text-center">Color</td>
                        <td className="py-4 whitespace-nowrap text-center">Size</td>
                        <td className="py-4 whitespace-nowrap text-center">Total</td>
                        <td className="py-4 whitespace-nowrap text-center">Quantity</td>
                        <td className="py-4 whitespace-nowrap text-right w-[114px] block"></td>
                      </tr>
          
                      {/* Table Data */}
                      {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => (
                          <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="pl-10 py-4">
                              <div className="flex space-x-6 items-center">
                                <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                                  <img
                                    src={item.imageUrl || `${import.meta.env.VITE_PUBLIC_URL}/assets/images/default-product.jpg`}
                                    alt={item.title || "Product"}
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
                            <td className="text-center py-4 px-2 ">{item.review || "N/A"}</td>
                            <td className="text-center py-4 px-2">
                              <div className="flex justify-center items-center">
                                <span
                                  className="w-[20px] h-[20px] block rounded-full"
                                  style={{ backgroundColor: item.color || "#E4BC87" }}
                                ></span>
                              </div>
                            </td>
                            <td className="text-center py-4 px-2">{item.size || "N/A"}</td>
                            <td className="text-center py-4 px-2">${item.offer_price || "0.00"}</td>
                            <td className="py-4 text-center">{item.quantity || 1}</td>
                            {/* <td className="text-center py-4">
                              ${item.total || item.price || "0.00"}
                            </td> */}
                            <td className="text-right py-4">
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-gray-400 hover:text-red-500 mr-12 "
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-4 text-gray-500 font-medium"
                          >
                            No items in wishlist.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
        </div>
      </div>
      <div className="w-full mt-[30px] flex sm:justify-end justify-start">
        <div className="sm:flex sm:space-x-[30px] items-center">
          <button type="button">
            <div className="w-full text-sm font-semibold text-qred mb-5 sm:mb-0">
              Clean Wishlist
            </div>
          </button>
          <div className="w-[180px] h-[50px]">
            <button type="button" className="yellow-btn">
              <div className="w-full text-sm font-semibold">
                Add to Cart All
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
