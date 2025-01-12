import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BreadcrumbCom from "../BreadcrumbCom";
import EmptyCardError from "../EmptyCardError";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import ProductsTable from "./ProductsTable";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default function CardPage({ cart = true, products = [] }) {
  const [subtotal, setSubtotal] = useState(0); // Set initial subtotal as 0

  const tax = 50; // Fixed tax amount
  const shippingCharge = 80; // Fixed shipping charge
  const discount = 20; // Fixed discount amount

  // Calculate grand total
  const calculateGrandTotal = () => {
    return subtotal + tax + shippingCharge - discount;
  };

  const grandTotal = calculateGrandTotal();

  useEffect(() => {
    const fetchAndStoreCartDetails = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        try {
          const sanitizedEmail = user.email.replace(/\ /g, "_"); // Replace spaces in email to prevent Firestore path issues
          const cartDocRef = doc(db, "users", sanitizedEmail, "cart", "amount");

          // Fetch the existing data
          const cartDoc = await getDoc(cartDocRef);

          if (cartDoc.exists()) {
            // If subtotal exists in Firestore, set it
            const fetchedSubtotal = cartDoc.data().subtotal;
            if (fetchedSubtotal) {
              setSubtotal(fetchedSubtotal);
            } else {
              console.log("Subtotal not found in Firestore.");
            }
          } else {
            console.log("No cart document found in Firestore.");
          }

          // Store the updated cart details in Firestore
          const cartDetails = {
            subtotal: subtotal, // Ensure to save the existing or updated subtotal
            tax,
            shippingCharge,
            discount,
            grandTotal,
          };

          await setDoc(cartDocRef, cartDetails, { merge: true }); // Merge the new details with existing ones
          console.log("Cart details updated successfully in Firestore.");
        } catch (error) {
          console.error("Error fetching or storing cart details in Firestore:", error);
        }
      } else {
        console.error("No user is logged in. Unable to fetch or store cart details.");
      }
    };

    fetchAndStoreCartDetails();
  }, [subtotal]); // Update Firestore whenever `subtotal` changes

  return (
    <Layout childrenClasses={cart ? "pt-0 pb-0" : ""}>
      {cart === false ? (
        <div className="cart-page-wrapper w-full">
          <div className="container-x mx-auto">
            <BreadcrumbCom
              paths={[{ name: "home", path: "/" }, { name: "cart", path: "/cart" }]}
            />
            <EmptyCardError />
          </div>
        </div>
      ) : (
        <div className="cart-page-wrapper w-full bg-white pb-[60px]">
          <div className="w-full">
            <PageTitle
              title="Your Cart"
              breadcrumb={[{ name: "home", path: "/" }, { name: "cart", path: "/cart" }]}
            />
          </div>
          <div className="w-full mt-[23px]">
            <div className="container-x mx-auto">
              <ProductsTable className="mb-[30px]" />
              <div className="w-full mt-[30px] flex sm:justify-end">
                <div className="sm:w-[370px] w-full border border-[#EDEDED] px-[30px] py-[26px]">
                  <div className="sub-total mb-6">
                    <div className="flex justify-between mb-6">
                      <p className="text-[15px] font-medium text-qblack">Subtotal</p>
                      <p className="text-[15px] font-medium text-qred">
                        ₹{Math.round(subtotal)} {/* Display rounded subtotal */}
                      </p>
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
