import { Link } from "react-router-dom";
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import Star from "../icons/Star";
import ThinLove from "../icons/ThinLove";
import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebse";
import { getAuth } from "firebase/auth";

export default function ProductCardRowStyleTwo({ className, datas, type }) {
  const [isPink, setIsPink] = useState(false);

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

  return (
    <div
      data-aos="fade-left"
      className={`product-row-card-style-one w-full h-[250px] bg-white group relative overflow-hidden ${
        className || ""
      }`}
    >
      <div className="flex space-x-5 items-center w-full h-full lg:p-[30px] sm:p-5 p-2">
        <div className="lg:w-1/2 w-1/3 h-full">
          <img
            src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/${
              datas.image
            }`}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center h-full">
          <div>
            {/* reviews */}
            <div className="flex space-x-1 mb-3">
              {Array.from(Array(datas.review), () => (
                <span key={datas.review + Math.random()}>
                  <Star />
                </span>
              ))}
            </div>
            <Link to="/single-product">
              <p className="title mb-2 sm:text-[15px] text-[13px] font-600 text-qblack leading-[24px] line-clamp-2 hover:text-blue-600">
                {datas.title}
              </p>
            </Link>
            <p className="price mb-[26px]">
              <span className="main-price text-qgray line-through font-600 sm:text-[18px] text-base">
                {datas.price}
              </span>
              <span className="offer-price text-qred font-600 sm:text-[18px] text-base ml-2">
                {datas.offer_price}
              </span>
            </p>
            <button type="button" className="w-[110px] h-[30px]">
              <span className={type === 3 ? "blue-btn" : "yellow-btn"}>
                {" "}
                Add To Cart
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* quick-access-btns */}
      <div className="quick-access-btns flex flex-col space-y-2 absolute group-hover:right-4 -right-10 top-[30px]  transition-all duration-300 ease-in-out">
        <a href="#">
          <span className="w-10 h-10 flex justify-center items-center bg-primarygray rounded">
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
          <span className="w-10 h-10 flex justify-center items-center bg-primarygray rounded">
            <Compair />
          </span>
        </a>
      </div>
    </div>
  );
}
