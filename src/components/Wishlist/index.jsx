import React, { useState, useEffect } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyWishlistError from "../EmptyWishlistError";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import ProductsTable from "./ProductsTable";
import { getAuth ,onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebse";

export default function Wishlist({ wishlist = true }) {
   const [wishlistItems, setWishlistItems] = useState([]);
   const[products,setProducts]=useState([]);
    const auth = getAuth();
    const currentUser = auth.currentUser;

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
 
  const handleClearWishlist = async () => {
    try {
      if (!currentUser || !currentUser.email) {
        alert("Please log in to manage your wishlist.");
        return;
      }

      const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
      const wishlistRef = collection(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "wishlist");
      const querySnapshot = await getDocs(wishlistRef);
      
      // Delete all wishlist items
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setWishlistItems([]);
      alert("All items removed from wishlist.");
    } catch (error) {
      console.error("Error clearing wishlist: ", error);
      alert("Failed to clear the wishlist.");
    }
  };
  return (
    <Layout childrenClasses={wishlist ? "pt-0 pb-0" : ""}>
      {wishlist === false ? (
        <div className="wishlist-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom
              paths={[
                { name: "home", path: "/" },
                { name: "wishlist", path: "/wishlist" },
              ]}
            />
            <EmptyWishlistError />
          </div>
        </div>
      ) : (
        <div className="wishlist-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="Wishlist"
              breadcrumb={[
                { name: "home", path: "/" },
                { name: "wishlist", path: "/wishlist" },
              ]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable className="mb-[30px]" />
              <div className="w-full mt-[30px] flex sm:justify-end justify-start">
                <div className="sm:flex sm:space-x-[30px] items-center">
                  <button type="button"  onClick={handleClearWishlist}>
                    <div className="w-full text-sm font-semibold text-qred mb-5 sm:mb-0">
                      Clean Wishlist
                    </div>
                  </button>
                  {/* <div className="w-[180px] h-[50px]">
                    <button type="button "            onClick={handleAddToCart} className="yellow-btn">
                      <div className="w-full text-sm font-semibold">
                        Add to Cart All
                      </div>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
