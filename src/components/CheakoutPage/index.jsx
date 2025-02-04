import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { doc, setDoc ,getDoc, getFirestore, collection, getDocs, deleteDoc,addDoc } from "firebase/firestore";
import { db } from "../firebse";
import React, { useState,useEffect } from "react";

export default function CheakoutPage() {
  const [products, setProducts] = useState([]);
  const [cartempty, setCartEmpty] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city:"",
    postcode: "",
    createAccount: false,
    shipToSameAddress: false,
  });
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      alert("No user is currently logged in.");
      return;
    }
  
    const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
  
    // Updated path to include "admin", "nithya123@gmail.com", and "users"
    const docRef = doc(
      db,
      "admin",
      "nithya123@gmail.com",
      "users",
      sanitizedEmail,
      "Deliveryaddress",
      formData.email.replace(/\s/g, "_") // Unique address ID
    );
  
    try {
      // Ensure all fields are sent to Firebase
      await setDoc(docRef, {
        ...formData,
        userId: currentUser.uid, // Add current user UID
        timestamp: new Date().toISOString(), // Use ISO format for Firebase
      });
  
      alert("Address added successfully!");
  
      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        state: "",
        city: "",
        postcode: "",
        createAccount: false,
        shipToSameAddress: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address. Please try again.");
    }
  };
  

  const [addresses, setAddresses] = useState([]); // Store fetched addresses
  const [loading, setLoading] = useState(true);  // For loading status
  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        alert("No user is currently logged in.");
        return;
      }
  
      const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
  
      // Updated collection path with "admin" and "nithya123@gmail.com"
      const collectionRef = collection(
        db,
        "admin", // "admin" collection
        "nithya123@gmail.com", // The admin email
        "users", // "users" subcollection
        sanitizedEmail, // Current user's sanitized email
        "Deliveryaddress" // The specific subcollection where delivery addresses are stored
      );
  
      try {
        // Fetch all documents from the "Deliveryaddress" collection
        const querySnapshot = await getDocs(collectionRef);
  
        if (!querySnapshot.empty) {
          // Get all documents and pick a random one
          const randomDoc = querySnapshot.docs[
            Math.floor(Math.random() * querySnapshot.size)
          ];
  
          // Update formData with the data of the random document
          setFormData(randomDoc.data());
        } else {
          alert("No documents found in this collection!");
        }
      } catch (error) {
        console.error("Error fetching documents: ", error);
        alert("Error fetching document.");
      }
    };
  
    fetchData();
  }, []);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const tax = 50;
  const shippingCharge = 80;
  const discount = 20;
  const [grandTotal, setGrandTotal] = useState(0);

  

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
  }, [tax, shippingCharge, discount]);

  // Handle radio button selection
  const handleRadioChange = (e) => {
    setSelectedPaymentMethod(e.target.id);
  };




  const handlePlaceOrderClick = async () => {
    const currentUser = auth.currentUser;
    if (selectedPaymentMethod === "delivery") {
      const orderNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit order ID
  
      const orderDetails = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.postcode}, ${formData.country}`,
        cartItems: products.map((item) => ({
          name: item.name,
          image: item.image,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shippingCharge,
        discount,
        grandTotal,
        paymentMethod: selectedPaymentMethod,
        timestamp: new Date(),
        orderId: orderNumber, // Store order number inside Firestore
      };
  
      // Sanitize email for Firestore
      const sanitizedEmail = currentUser.email.replace(/[ ]/g, "_");
  
      try {
        // Create a document reference with the random order number as the document ID
        const orderDocRef = doc(
          db,
          "admin",
          "nithya123@gmail.com",
          "users",
          sanitizedEmail,
          "order",
          orderNumber.toString() // Use random number as document ID
        );
  
        // Add order details to Firestore
        await setDoc(orderDocRef, orderDetails);
        console.log("Order saved successfully with Order ID:", orderNumber);
  
        // Construct the order details message for WhatsApp
        const orderMessage = encodeURIComponent(`
          Order Summary:
          - Order ID: ${orderNumber}
          - Name: ${orderDetails.name}
          - Email: ${orderDetails.email}
          - Phone: ${orderDetails.phone}
          - Address: ${orderDetails.address}
          - Cart Items: ${products.length}
          ${products
            .map(
              (item, index) =>
                `\n${index + 1}. ${item.name} (Category: ${item.category}) (Qty: ${item.quantity}) - ₹${item.price}`
            )
            .join("")}
          - Subtotal: ₹${orderDetails.subtotal}
          - Shipping: ₹${orderDetails.shippingCharge}
          - Discount: ₹${orderDetails.discount}
          - Grand Total: ₹${orderDetails.grandTotal}
        `);
  
        // Redirect to WhatsApp with prefilled order details
        window.location.href = `https://wa.me/7358937529?text=${orderMessage}`;
      } catch (error) {
        console.error("Error saving order:", error);
      }
    } else {
      console.log("Proceeding to online payment...");
    }
  };
  
  
  



const [user, setUser] = useState(null);
const [cartItem, setCartItem] = useState(null);
const [error, setError] = useState(null);
const [cartItems, setCartItems] = useState([]);
const auth = getAuth();
const db = getFirestore();

// Monitor authentication state
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, [auth]);

const fetchCartItems = async () => {
  if (!user || ! user.email) {
    alert("Please log in to view your Cart.");
    return;
  } 
  const sanitizedEmail = user.email.replace(/\ /g, "_at_");
  const cartRef = collection(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart");

  try {
    const cartSnapshot = await getDocs(cartRef);
    const cartData = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(cartData);
    setCartEmpty(cartData.length === 0);
  } catch (error) {
    console.error("Error fetching cart items: ", error);
  }
};
useEffect(() => {
  if (user) {
    fetchCartItems();
  }
}, [user]);


  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="checkout-page-wrapper w-full bg-white pb-[60px]">
        <div className="w-full mb-5">
          <PageTitle
            title="Checkout"
            breadcrumb={[
              { name: "home", path: "/" },
              { name: "checkout", path: "/checkout" },
            ]}
          />
        </div>
        <div className="checkout-main-content w-full">
          <div className="container-x mx-auto">
            <div className="w-full sm:mb-10 mb-5">
              <div className="sm:flex sm:space-x-[18px] s">
              <div className="sm:w-1/2 w-full mb-5 h-[70px]">
  <a href="login">
    <div className="w-full h-full bg-[#F6F6F6] text-qblack flex justify-center items-center hover:bg-[#E5E5E5] hover:text-black transition duration-300">
      <span className="text-[15px] font-medium">
        Log into your Account
      </span>
    </div>
  </a>
</div>
                <div className="flex-1 h-[70px]">
                  <a href="#">
                    <div className="w-full h-full bg-[#F6F6F6] text-qblack flex justify-center items-center hover:bg-[#E5E5E5] hover:text-black transition duration-300">
                      <span className="text-[15px] font-medium">
                        Enter Coupon Code
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full lg:flex lg:space-x-[30px]">
              <div className="lg:w-1/2 w-full">
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
                  Billing Details
                </h1>
                <div className="form-area">
                <form onSubmit={handleSubmit}>
      <div className="sm:flex sm:space-x-5 items-center mb-6">
        <div className="sm:w-1/2 mb-5 sm:mb-0">
          <label className="block mb-2 text-sm font-medium">First Name*</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Demo Name"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">Last Name*</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Demo Name"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
      </div>

      <div className="flex space-x-5 items-center mb-6">
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium">Email Address*</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">Phone Number*</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="012 3 *******"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
      </div>

      <div className="flex space-x-5 items-center mb-6">
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium">Country*</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Enter your Country"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">Address*</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your Address"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
      </div>

      <div className="flex space-x-5 items-center mb-6">
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium">State*</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="Enter your State"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">City*</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter your City"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
      </div>

      <div className="flex space-x-5 items-center mb-6">
        <div className="w-1/2">
          <label className="block mb-2 text-sm font-medium">Postcode*</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            placeholder="Enter your Postcode"
            className="w-full border border-gray-300 p-2 rounded h-[50px]"
            required
          />
        </div>
      </div>

      <div className="flex space-x-2 items-center mb-10">
        <input
          type="checkbox"
          id="create"
          name="createAccount"
          checked={formData.createAccount}
          onChange={handleInputChange}
        />
        <label htmlFor="create" className="text-qblack text-[15px] select-none">
          Create an account?
        </label>
      </div>

      <div>
        <h1 className="text-2xl text-qblack font-medium mb-3">
          Billing Details
        </h1>
        <div className="flex space-x-2 items-center mb-10">
          <input
            type="checkbox"
            id="address"
            name="shipToSameAddress"
            checked={formData.shipToSameAddress}
            onChange={handleInputChange}
          />
          <label htmlFor="address" className="text-qblack text-[15px] select-none">
            Ship to the same address
          </label>
        </div>
      </div>

      <button type="submit" className="w-full h-[50px] bg-qblack text-white text-center">
        Save Billing Details
      </button>
    </form>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
                  Order Summary
                </h1>

                <div className="w-full px-10 py-[30px] border border-[#EDEDED]">
                <div className="sub-total mb-6">
        <div className="flex justify-between mb-5">
          <p className="text-[13px] font-medium text-qblack uppercase">
            Product
          </p>
          <p className="text-[13px] font-medium text-qblack uppercase">
            Total
          </p>
        </div>
        <div className="w-full h-[1px] bg-[#EDEDED]"></div>
      </div>


      <h2>Cart Items : {products.length}</h2>

{products.length > 0 ? (
  <div className="product-list w-full mb-[40px]">
    <ul className="flex flex-col space-y-5 mt-6">
      {products.map((item, index) => (
        <li key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={item.image || "fallback_image_url"} 
              alt={item.name} 
              className="w-12 h-12 rounded-md"
            />
            <h4 className="text-[15px] text-qblack mb-2.5 truncate max-w-[150px]">
              {item.name || "Unknown Product"}  ({item.quantity || "1"})
            </h4>
          </div>
      
          <div>
            <span className="text-[15px] text-qblack font-medium">
            ₹{item.price || "0.00"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
) : (
  <p>No cart items found.</p>
)}

<div className="cart-summary">
      <div className="w-full h-[1px] bg-[#EDEDED]"></div>

      <div className="mt-[30px]">
        <div className="flex justify-between mb-5">
          <p className="text-[13px] font-medium text-qblack uppercase">SUBTOTAL</p>
          <p className="text-[15px] font-medium text-qblack uppercase">₹{subtotal}</p>
        </div>
      </div>

      <div className="w-full mt-[30px]">
        <div className="sub-total mb-6">
          <div className="flex justify-between mb-5">
            <div>
              <span className="text-xs text-qgraytwo mb-3 block">SHIPPING</span>
              <p className="text-base font-medium text-qblack">Free Shipping</p>
            </div>
            <p className="text-[15px] font-medium text-qblack">+{shippingCharge}</p>
            
          </div>
          <div className="flex justify-between mb-5">
            <div>
              <span className="text-xs text-qgraytwo mb-3 block">Overall Discount</span>
              <p className="text-base font-medium text-qblack">Discount</p>
            </div>
            <p className="text-[15px] font-medium text-qblack">+{discount}</p>
            
          </div>
          <div className="w-full h-[1px] bg-[#EDEDED]"></div>
        </div>
      </div>

      <div className="mt-[30px]">
        <div className="flex justify-between mb-5">
          <p className="text-2xl font-medium text-qblack">Total</p>
          <p className="text-2xl font-medium text-qred">₹{grandTotal}</p>
        </div>
      </div>
    </div>

                  <div className="shipping mt-[30px]">
      <ul className="flex flex-col space-y-1">
        <li className="mb-5">
          <div className="flex space-x-2.5 items-center mb-4">
            <div className="input-radio">
              <input
                type="radio"
                name="price"
                className="accent-pink-500"
                id="transfer"
                onChange={handleRadioChange}
              />
            </div>
            <label htmlFor="transfer" className="text-[18px] text-normal text-qblack">
              Direct Bank Transfer
            </label>
          </div>
          <p className="text-qgraytwo text-[15px] ml-6">
            Make your payment directly into our bank account. Please use your Order ID as the payment reference.
          </p>
        </li>
        <li>
          <div className="flex space-x-2.5 items-center mb-5">
            <div className="input-radio">
              <input
                type="radio"
                name="price"
                className="accent-pink-500"
                id="delivery"
                onChange={handleRadioChange}
              />
            </div>
            <label htmlFor="delivery" className="text-[18px] text-normal text-qblack">
              Cash on Delivery
            </label>
          </div>
        </li>
        <li>
          <div className="flex space-x-2.5 items-center mb-5">
            <div className="input-radio">
              <input
                type="radio"
                name="price"
                className="accent-pink-500"
                id="bank"
                onChange={handleRadioChange}
              />
            </div>
            <label htmlFor="bank" className="text-[18px] text-normal text-qblack">
              Credit/Debit Cards or Paypal
            </label>
          </div>
        </li>
      </ul>

                  </div>
                  <a href="#" onClick={handlePlaceOrderClick}>
        <div className="w-full h-[50px] black-btn flex justify-center items-center">
          <span className="text-sm font-semibold">Place Order Now</span>
        </div>
      </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
