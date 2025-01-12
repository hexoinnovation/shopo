import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Payment() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const auth = getAuth();
  const db = getFirestore();

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const savePaymentDetails = async (details, type) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const sanitizedEmail = user.email.replace(/\ /g, "_");
        const paymentRef = doc(db, "users", sanitizedEmail, "payment", type);
        
        await setDoc(paymentRef, details);
        console.log(`${type} details saved to Firestore`);

        // Reset the form after saving
        type === "card" ? setCardDetails({ cardNumber: "", expiryDate: "", cvv: "", cardHolder: "" }) : setBankDetails({ bankName: "", accountNumber: "", ifscCode: "" });
        type === "card" ? setShowAddCard(false) : setShowAddBank(false);
      } catch (error) {
        console.error("Error saving payment details:", error);
      }
    }
  };

  return (
    <div className="items-wrapper-bank-payment w-full">
      <ul className="items">
        {/* Display saved payment methods */}
        {[...Array(4)].map((_, index) => (
          <li key={index} className="sm:flex justify-between items-center w-full py-[30px] border-b border-light-purple">
            <div className="flex space-x-5 items-center mb-3 sm:mb-0">
              <div className="sm:w-[120px] sm:h-[120px] flex items-center justify-center rounded-full sm:bg-[#F2F2F2]">
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/card-${index + 1}.svg`}
                  alt="payment"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="sm:text-xl text-lg tracking-wide text-qblack font-bold">
                  Datch Bangla Bank Ltd
                </p>
                <p className="text-thin-light-gray sm:text-18 text-sm tracking-wide">
                  Bank **********5535
                </p>
                <p className="sm:text-18 text-sm tracking-wide text-green-500">
                  Verified
                </p>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="w-[116px] sm:h-[46px] h-[40px]  bg-qyellow text-qblack font-medium sm:text-18 text-sm tracking-wide"
              >
                <span>Manage</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add Card / Bank Section */}
      <div className="flex space-x-4 ">
        <button
          onClick={() => setShowAddCard(true)}
          type="button"
          className="text-white bg-qblack w-[126px] h-[50px] text-sm font-semibold"
        >
          Add Card
        </button>
        <button
          onClick={() => setShowAddBank(true)}
          type="button"
          className="text-qblack  w-[126px] h-[50px] text-sm font-semibold border border-qblack"
        >
          Add Bank
        </button>
      </div>

      {/* Card Form */}
      {showAddCard && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <button
              onClick={() => setShowAddCard(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              X
            </button>
            <h3 className="text-xl mb-4">Add Card</h3>
            <div>
              <input
                type="text"
                name="cardHolder"
                placeholder="Cardholder Name"
                value={cardDetails.cardHolder}
                onChange={handleCardInputChange}
                className="w-full p-2 border mb-3"
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                className="w-full p-2 border mb-3"
              />
              <input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date"
                value={cardDetails.expiryDate}
                onChange={handleCardInputChange}
                className="w-full p-2 border mb-3"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={handleCardInputChange}
                className="w-full p-2 border mb-3"
              />
              <button
                onClick={() => savePaymentDetails(cardDetails, "card")}
                className="w-full bg-qblack text-white p-2 mt-4"
              >
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Form */}
      {showAddBank && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <button
              onClick={() => setShowAddBank(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              X
            </button>
            <h3 className="text-xl mb-4">Add Bank</h3>
            <div>
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={bankDetails.bankName}
                onChange={handleBankInputChange}
                className="w-full p-2 border mb-3"
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={bankDetails.accountNumber}
                onChange={handleBankInputChange}
                className="w-full p-2 border mb-3"
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={bankDetails.ifscCode}
                onChange={handleBankInputChange}
                className="w-full p-2 border mb-3"
              />
              <button
                onClick={() => savePaymentDetails(bankDetails, "bank")}
                className="w-full bg-qblack text-white p-2 mt-4"
              >
                Save Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
