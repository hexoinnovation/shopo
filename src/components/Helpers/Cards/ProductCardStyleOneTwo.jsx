import React, { useState,useEffect } from "react";
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import ThinLove from "../icons/ThinLove";
import { Link } from "react-router-dom";
import { doc, setDoc , getDoc,deleteDoc } from "firebase/firestore";
import { db } from "../../firebse";
import { getAuth } from "firebase/auth";

export default function ProductCardStyleOneTwo({ datas }) {
   const [isPink, setIsPink] = useState(false);
  
    useEffect(() => {
      const fetchWishlistStatus = async () => {
        if (!datas || !datas.id) return;
  
        const auth = getAuth();
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
          const wishlistRef = doc(db, "users", sanitizedEmail, "wishlist", datas.id);
  
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
        const wishlistRef = doc(db, "users", sanitizedEmail, "wishlist", datas.id);
  
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
  
  return (
    <div
      className="product-card-style-one-two w-full h-full bg-white relative group overflow-hidden"
      style={{ boxShadow: "0px 15px 64px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div
        className="product-card-img w-full h-[322px] mt-4"
        style={{
          background: `url(${import.meta.env.VITE_PUBLIC_URL}/assets/images/${
            datas.image
          }) no-repeat center`,
        }}
      ></div>
      <div className="product-card-details flex justify-center h-[102px] items-center  relative">
        {/* add to card button */}
        <div className="absolute w-[204px] h-[54px] left-[80px] -bottom-20 group-hover:bottom-[65px] transition-all duration-300 ease-in-out">
          <button type="button" className="yellow-btn">
            <div>
              <span>Add To Cart</span>
            </div>
          </button>
        </div>
        <div>
          <Link to="/single-product">
            <p className="title mb-2.5 text-[20px] font-600 text-center text-qblack leading-[24px] line-clamp-2 hover:text-blue-600">
              {datas.title}
            </p>
          </Link>
          <div className="flex justify-center ">
            <div className="price">
              <span className="offer-price text-center text-qred font-600 text-[18px] mr-1 inline-block">
                {datas.offer_price}
              </span>
              <span className="main-price text-qgray line-through font-600 text-center text-[18px]">
                {datas.price}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* quick-access-btns */}
      <div className="quick-access-btns flex flex-col space-y-2 absolute group-hover:right-[50px] -right-[50px] top-20  transition-all duration-300 ease-in-out">
        <a href="#">
          <span className="w-10 h-10 flex justify-center items-center bg-[#CCECEB] rounded">
            <QuickViewIco />
          </span>
        </a>

       <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishlistClick();
                    }}
                  >
                    <span
                      className={`w-10 h-10 flex justify-center items-center ${
                        isPink ? "bg-pink-500" : "bg-primarygray"
                      } rounded`}
                    >
                      <ThinLove />
                    </span>
                  </a>

        <a href="#">
          <span className="w-10 h-10 flex justify-center items-center bg-[#CCECEB] rounded">
            <Compair />
          </span>
        </a>
      </div>
    </div>
  );
}
