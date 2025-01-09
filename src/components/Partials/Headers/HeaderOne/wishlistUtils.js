import { db } from "../../../firebse"; // Import db (Firestore instance)
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Function to add or remove products from the wishlist
export const updateWishlist = async (userEmail, productId, action) => {
  try {
    const wishlistRef = doc(db, 'wishlists', userEmail); // Access the user's wishlist by email
    const wishlistDoc = await getDoc(wishlistRef);
    
    let wishlistData = wishlistDoc.exists() ? wishlistDoc.data().wishlist : [];
    
    if (action === "add") {
      if (!wishlistData.includes(productId)) {
        wishlistData.push(productId);
      }
    } else if (action === "remove") {
      wishlistData = wishlistData.filter((id) => id !== productId);
    }
    
    // Update the user's wishlist document in Firestore
    await setDoc(wishlistRef, { wishlist: wishlistData });
    console.log(`Wishlist updated for ${userEmail}`);
  } catch (error) {
    console.error("Error updating wishlist: ", error);
  }
};

// Function to get the number of items in the wishlist
export const getWishlistCount = async (userEmail) => {
  try {
    const wishlistRef = doc(db, 'wishlists', userEmail); // Access the user's wishlist by email
    const wishlistDoc = await getDoc(wishlistRef);

    return wishlistDoc.exists() ? wishlistDoc.data().wishlist.length : 0;
  } catch (error) {
    console.error("Error fetching wishlist count: ", error);
    return 0;
  }
};
