import { Link } from "react-router-dom";
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import Star from "../icons/Star";
import ThinLove from "../icons/ThinLove";
import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebse";
import { getAuth } from "firebase/auth";

export default function ProductCardRowStyleTwo({ className, datas, type }) {
  const [isPink, setIsPink] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!datas || !datas.id) return;

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
        const wishlistRef = doc(
          db,
          "users",
          sanitizedEmail,
          "wishlist",
          datas.id
        );

        try {
          const docSnap = await getDoc(wishlistRef);
          if (docSnap.exists()) {
            setIsPink(true); // Product is already in the wishlist
          } else {
            setIsPink(false); // Product is not in the wishlist
          }
        } catch (error) {
          console.error("Error checking wishlist status: ", error);
        }
      }
    };

    fetchWishlistStatus();
  }, [datas]);

  const handleWishlistClick = async () => {
    if (!datas || !datas.id) {
      alert("Invalid product data.");
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
      const wishlistRef = doc(
        db,
        "users",
        sanitizedEmail,
        "wishlist",
        datas.id
      );

      try {
        if (isPink) {
          // Remove from wishlist
          await deleteDoc(wishlistRef);
          console.log("Product removed from wishlist.");
          setIsPink(false);
        } else {
          // Add to wishlist
          await setDoc(wishlistRef, datas);
          console.log("Product added to wishlist.");
          setIsPink(true);
        }
      } catch (error) {
        console.error("Error updating wishlist: ", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please log in to manage your wishlist.");
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const collectionRef = collection(
        db,
        "admin",
        "nithya123@gmail.com",
        "products"
      );
      const snapshot = await getDocs(collectionRef);

      const productsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Remove duplicates based on 'id'
      const uniqueProducts = Array.from(
        new Map(productsList.map((item) => [item.id, item])).values()
      );

      setProducts(uniqueProducts); // Set products state with unique products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full p-20 gap-80 justify-items-center">
      {products.slice(0, 4).map((product) => (
        <div
          key={product.id}
          data-aos=""
          className={`w-[250px] h-[400px] bg-purple-200 justify-center items-center gap-20 p-7 ${
            className || ""
          } flex flex-col justify-between p-5 shadow-lg rounded-lg`}
        >
          
          <div className="w-full h-1/3 flex justify-center items-center">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name || "Product Image"}
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex flex-col items-center mt-4">
            <Link to="/single-product">
              <p className="text-lg font-semibold text-qblack hover:text-blue-600 text-center">
                {product.name}
              </p>
            </Link>
            <p className="text-sm text-gray-600">{product.brand}</p>

            <div className="flex items-center space-x-2 mt-2 justify-center">
              <span className="text-qgray line-through font-semibold sm:text-[18px] text-base">
                ₹{product.price}
              </span>
              <span className="text-qred font-semibold sm:text-[18px] text-base">
                {product.category}
              </span>
            </div>

            <button
              type="button"
              className="mt-3 w-[110px] h-[30px] bg-yellow-500 text-white font-semibold rounded-md"
            >
              Add To Cart
            </button>
          </div>

          {/* Quick Access Buttons */}
          <div className="quick-access-btns flex flex-col space-y-2 absolute group-hover:right-4 -right-10 top-[30px] transition-all duration-300 ease-in-out">
            <a href="#">
              <span className="w-10 h-10 flex justify-center items-center bg-primarygray rounded">
                <QuickViewIco />
              </span>
            </a>

            <a href="#" onClick={(e) => e.preventDefault()}>
              <span className="w-10 h-10 flex justify-center items-center bg-primarygray rounded">
                <ThinLove />
              </span>
            </a>

            <a href="#">
              <span className="w-10 h-10 flex justify-center items-center bg-primarygray rounded">
                <Compair />
              </span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
