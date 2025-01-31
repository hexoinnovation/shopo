import React, { useState, useEffect } from "react";
import InputQuantityCom from "../Helpers/InputQuantityCom";
import { doc, setDoc, getDoc, getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebse";
import { getAuth } from "firebase/auth";
import { FaTrash } from "react-icons/fa";

export default function ProductsTable() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser || !currentUser.email) {
        alert("Please log in to view your wishlist.");
        return;
      }

      try {
        const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
        const wishlistRef = collection(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "wishlist");
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
      const wishlistRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "wishlist", id);

      await deleteDoc(wishlistRef);
      setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item: ", error);
      alert("Failed to delete the item.");
    }
  };

  // Handle clearing the wishlist


  // Handle add all items to cart
 

  return (
    <div className="w-full">
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {/* Table Heading */}
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap w-[380px]">Product</td>
              <td className="py-4 whitespace-nowrap text-center">Category</td>
              <td className="py-4 whitespace-nowrap text-center">Brand</td>
              <td className="py-4 whitespace-nowrap text-center">Availability</td>
              <td className="py-4 whitespace-nowrap text-center">Total</td>
              {/* <td className="py-4 whitespace-nowrap text-center">Quantity</td> */}
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
                          src={item.image || `${import.meta.env.VITE_PUBLIC_URL}/assets/images/default-product.jpg`}
                          alt={item.title || "Product"}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <p className="font-medium text-[15px] text-qblack">
                          {item.name || "Unnamed Product"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">{item.category || "N/A"}</td>
                  <td className="text-center py-4 px-2">{item.brand || "N/A"}</td>
                  <td className="text-center py-4 px-2">
  <span
    className={`text-white px-2 py-1 rounded ${
      parseInt(item.availability) > 0 ? "bg-red-500" : "bg-green-500"
    }`}
  >
    {parseInt(item.availability) > 0 ? "Out of Stock" : "In Stock"}
  </span>
</td>

                  <td className="py-4 text-center">{item.price || 1}</td>
                  {/* <td className="text-center py-4">
                    <InputQuantityCom item={item} />
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

        {/* Clear Wishlist and Add to Cart buttons */}
        {/* <div className="flex justify-between py-4">
          <button
            onClick={handleClearWishlist}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Wishlist
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add All to Cart
          </button>
        </div> */}
      </div>
    </div>
  );
}
