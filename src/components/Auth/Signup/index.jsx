import { useState } from "react";
import InputCom from "../../Helpers/InputCom";
import Layout from "../../Partials/Layout";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebse";
import Swal from "sweetalert2";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Signup() {
  const [checked, setValue] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isTownDropdownOpen, setIsTownDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Select Country");
  const [selectedTowns, setSelectedTowns] = useState("Select Town / City");
  const [emailForPasswordReset, setEmailForPasswordReset] = useState("");

  const countries = [
    "United States",
    "Canada",
    "India",
    "Australia",
    "Germany",
  ];
  const towns = ["Miami", "New York", "Los Angeles", "Chicago", "Houston"];

  const toggleCountryDropdown = () => {
    setIsCountryDropdownOpen((prev) => !prev);
    setIsTownDropdownOpen(false); // Close other dropdown
  };

  const toggleTownDropdown = () => {
    setIsTownDropdownOpen((prev) => !prev);
    setIsCountryDropdownOpen(false); // Close other dropdown
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };

  const selectTown = (town) => {
    setSelectedTowns(town);
    setIsTownDropdownOpen(false);
  };

  const rememberMe = () => {
    setValue(!checked);
  };

  const saveUserDetails = async () => {
    // Extract values from input fields
    const fname = document.getElementById("fname")?.value.trim();
    const lname = document.getElementById("lname")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const postcode = document.getElementById("postcode")?.value.trim();

    // Validate extracted values
    if (
      !fname ||
      !lname ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !postcode
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please fill in all fields.",
      });
      return;
    }

    const sanitizedEmail = email.replace(/\ /g, "_");

    const userDetails = {
      firstName: fname,
      lastName: lname,
      email,
      password,
      phone,
      country: selectedCountry,
      town: selectedTowns,
      address,
      postcode,
    };

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User created in Firebase Auth:", user);

      // Save additional user details in Firestore under the path: "admin/nithya123@gmail.com/users/sanitizedEmail"
      await setDoc(
        doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail),
        userDetails
      );

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "User details saved successfully!",
      });
    } catch (error) {
      console.error("Error during signup:", error);

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message || "Failed to create an account. Please try again.",
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!emailForPasswordReset) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email to reset the password.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailForPasswordReset);
      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent",
        text: "Please check your email to reset your password.",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire({
        icon: "error",
        title: "Password Reset Failed",
        text: error.message || "Failed to send reset email. Please try again.",
      });
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex justify-center items-center min-h-screen bg-purple-100">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            Create Account
          </h1>
          <div className="input-area">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="col-span-1">
                <InputCom
                  placeholder="First Name"
                  label="First Name*"
                  name="fname"
                  type="text"
                  inputClasses="h-[40px] w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div className="col-span-1">
                <InputCom
                  placeholder="Last Name"
                  label="Last Name*"
                  name="lname"
                  type="text"
                  inputClasses="h-[40px] w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div className="col-span-1">
                <InputCom
                  placeholder="your@gmail.com"
                  label="Email Address*"
                  name="email"
                  type="email"
                  inputClasses="h-[40px] w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="col-span-1">
                <InputCom
                  placeholder="******"
                  label="Password*"
                  name="password"
                  type="password"
                  inputClasses="h-[40px] w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div className="col-span-1">
                <InputCom
                  placeholder="0213 *********"
                  label="Phone*"
                  name="phone"
                  type="text"
                  inputClasses="h-[40px] w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div className="col-span-1">
                <InputCom
                  placeholder="Your address Here"
                  label="Address*"
                  name="address"
                  type="text"
                  inputClasses="h-[40px] w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">
              {/* Country Dropdown */}
              <div className="col-span-1">
                <h6 className="input-label text-black capitalize text-[13px] font-normal block mb-5">
                  Country*
                </h6>
                <div
                  className="w-full h-[40px] border border-[#EDEDED] px-4 flex justify-between items-center mb-2 cursor-pointer"
                  onClick={toggleCountryDropdown}
                >
                  <span className="text-[13px] text-black">
                    {selectedCountry}
                  </span>
                  <span>
                    <svg
                      width="11"
                      height="7"
                      viewBox="0 0 11 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
                        fill="#222222"
                      />
                    </svg>
                  </span>
                </div>
                {isCountryDropdownOpen && (
                  <ul className="border border-[#EDEDED] bg-white mt-1 max-h-40 overflow-y-auto">
                    {countries.map((country, index) => (
                      <li
                        key={index}
                        className="px-5 py-2 text-[13px] text-black hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectCountry(country)}
                      >
                        {country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Town / City Dropdown */}
              <div className="col-span-1">
                <h6 className="input-label text-black capitalize text-[13px] font-normal block mb-5">
                  Town / City*
                </h6>
                <div
                  className="w-full h-[40px] border border-[#EDEDED] px-4 flex justify-between items-center mb-2 cursor-pointer"
                  onClick={toggleTownDropdown}
                >
                  <span className="text-[13px] text-black">
                    {selectedTowns}
                  </span>
                  <span>
                    <svg
                      width="11"
                      height="7"
                      viewBox="0 0 11 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
                        fill="#222222"
                      />
                    </svg>
                  </span>
                </div>
                {isTownDropdownOpen && (
                  <ul className="border border-[#EDEDED] bg-white mt-1 max-h-40 overflow-y-auto">
                    {towns.map((town, index) => (
                      <li
                        key={index}
                        className="px-5 py-2 text-[13px] text-black hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectTown(town)}
                      >
                        {town}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Postcode Field */}
              <div className="col-span-1">
                <InputCom
                  placeholder="00000"
                  label="Postcode / ZIP*"
                  inputClasses="h-[10px] w-full border border-gray-300 rounded-lg p-5 text-sm"
                  type="text"
                  name="postcode"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password-area mb-5 flex justify-end">
              <Link
                to="#"
                onClick={() => handleForgotPassword()}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="forgot-password-area mb-7">
              <div className="remember-checkbox flex items-center space-x-2.5">
                <button
                  onClick={rememberMe}
                  type="button"
                  className="w-5 h-5 text-black flex justify-center items-center border border-light-gray"
                >
                  {checked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <span onClick={rememberMe} className="text-base text-black">
                  I agree to the
                  <span className="text-black"> terms and conditions</span> in
                  HEXO.
                </span>
              </div>
            </div>

            <div className="signin-area mb-3">
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={saveUserDetails}
                  className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold"
                >
                  Create Account
                </button>
              </div>
            </div>

            <div className="signup-area flex justify-center">
              <p className="text-base text-black">
                Already have an account?
                <Link to="/login" className="ml-2 text-black hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
