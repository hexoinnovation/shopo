import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyCardError from "../EmptyCardError";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import ProductsTable from "./ProductsTable";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function CardPage({ cart = true }) {
  const [subtotal, setSubtotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const tax = 50;
  const shippingCharge = 80;
  const discount = 20;

  useEffect(() => {
    const fetchCartDetails = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        try {
          const adminEmail = "nithya123@gmail.com";
         
          const sanitizedEmail = user.email.replace(/\ /g, "_at_");
          const cartDocRef = doc(db, "admin", adminEmail, "users", sanitizedEmail, "cart_total", "amount");

          // Fetch subtotal from Firestore
          const cartDoc = await getDoc(cartDocRef);
          if (cartDoc.exists()) {
            const fetchedSubtotal = cartDoc.data().subtotal || 0;
            setSubtotal(fetchedSubtotal);

            // Calculate Grand Total
            const calculatedGrandTotal = fetchedSubtotal + tax + shippingCharge - discount;
            setGrandTotal(calculatedGrandTotal);

            // Save Grand Total back to Firestore
            await setDoc(cartDocRef, { subtotal: fetchedSubtotal, tax, shippingCharge, discount, grandTotal: calculatedGrandTotal }, { merge: true });
          } else {
            console.log("No cart document found.");
          }
        } catch (error) {
          console.error("Error fetching cart details:", error);
        }
      }
    };

    fetchCartDetails();
  }, []);

  return (
    <Layout childrenClasses={cart ? "pt-0 pb-0" : ""}>
      {cart === false ? (
        <div className="cart-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom paths={[{ name: "home", path: "/" }, { name: "cart", path: "/cart" }]} />
            <EmptyCardError />
          </div>
        </div>
      ) : (
        <div className="cart-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle title="Your Cart" breadcrumb={[{ name: "home", path: "/" }, { name: "cart", path: "/cart" }]} />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable className="mb-[30px]" />
              <div className="w-full mt-[30px] flex sm:justify-end">
                <div className="sm:w-[370px] w-full border border-[#EDEDED] px-[30px] py-[26px]">
                  <div className="sub-total mb-6">
                    <div className="flex justify-between mb-6">
                      <p className="text-[15px] font-medium text-qblack">Subtotal</p>
                      <p className="text-[15px] font-medium text-qred">₹{Math.round(subtotal)}</p>
                    </div>
                    <div className="w-full h-[1px] bg-[#EDEDED]"></div>
                  </div>
                  <div className="shipping mb-6">
                    <div className="flex justify-between">
                      <p className="text-[15px] font-medium text-qblack">Tax</p>
                      <p className="text-[15px] font-medium text-qgraytwo">₹{tax}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[15px] font-medium text-qblack">Discount</p>
                      <p className="text-[15px] font-medium text-qred">-₹{discount}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[15px] font-medium text-qblack">Shipping</p>
                      <p className="text-[15px] font-medium text-qgraytwo">₹{shippingCharge}</p>
                    </div>
                  </div>
                  <div className="total mb-6">
                    <div className="flex justify-between">
                      <p className="text-[18px] font-medium text-qblack">Grand Total</p>
                      <p className="text-[18px] font-medium text-qred">₹{Math.round(grandTotal)}</p>
                    </div>
                  </div>
                  <Link to="/checkout">
                    <div className="w-full h-[50px] black-btn flex justify-center items-center">
                      <span className="text-sm font-semibold">Proceed to Checkout</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
