import { useState } from "react";
import InputCom from "../../Helpers/InputCom";
import Layout from "../../Partials/Layout";
import Thumbnail from "./Thumbnail";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db,auth } from "../../firebse";
import Swal from 'sweetalert2';
import { createUserWithEmailAndPassword } from "firebase/auth";
export default function Signup() {
  const [checked, setValue] = useState(false);

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isTownDropdownOpen, setIsTownDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Select Country");
  const [selectedTowns, setSelectedTowns] = useState("Select Town / City");
  
  const countries = ["United States", "Canada", "India", "Australia", "Germany"];
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
    if (!fname || !lname || !email || !password || !phone || !address || !postcode) {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("User created in Firebase Auth:", user);
  
      
      // Save additional user details in Firestore under the path: "admin/nithya123@gmail.com/users/sanitizedEmail"
      await setDoc(doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail), userDetails);
  
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
  
  
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full lg:h-[783px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              <div className="w-full">
                <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                  <h1 className="text-[34px] font-bold leading-[74px] text-qblack">
                    Create Account
                  </h1>
                  <div className="shape -mt-6">
                    <svg
                      width="354"
                      height="30"
                      viewBox="0 0 354 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 28.8027C17.6508 20.3626 63.9476 8.17089 113.509 17.8802C166.729 28.3062 341.329 42.704 353 1"
                        stroke="#FFBB38"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="input-area">
                  <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                    <InputCom
                      placeholder="Demo Name"
                      label="Frist Name*"
                      name="fname"
                      type="text"
                      inputClasses="h-[50px]"
                    />

                    <InputCom
                      placeholder="Demo Name"
                      label="Last Name*"
                      name="lname"
                      type="text"
                      inputClasses="h-[50px]"
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 mb-5">
                    <InputCom
                      placeholder="Demo@gmail.com"
                      label="Email Address*"
                      name="email"
                      type="email"
                      inputClasses="h-[50px]"
                    />
                     <InputCom
                      placeholder="......."
                      label="Password*"
                      name="password"
                      type="password"
                      inputClasses="h-[50px]"
                    />

                    <InputCom
                      placeholder="0213 *********"
                      label="Phone*"
                      name="phone"
                      type="text"
                      inputClasses="h-[50px]"
                    />
                  </div>

                  <div className="flex flex-wrap sm:space-x-5 space-y-5 sm:space-y-0 mb-5">
  {/* Country Dropdown */}
  <div className="w-full sm:w-1/2">
    <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2">
      Country*
    </h6>
    <div
      className="w-full h-[50px] border border-[#EDEDED] px-5 flex justify-between items-center mb-2 cursor-pointer"
      onClick={toggleCountryDropdown}
    >
      <span className="text-[13px] text-qgraytwo">{selectedCountry}</span>
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
            className="px-5 py-2 text-[13px] text-qgray hover:bg-gray-100 cursor-pointer"
            onClick={() => selectCountry(country)}
          >
            {country}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Town / City Dropdown */}
  <div className="w-full sm:w-1/2">
    <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2">
      Town / City*
    </h6>
    <div
      className="w-full h-[50px] border border-[#EDEDED] px-5 flex justify-between items-center mb-2 cursor-pointer"
      onClick={toggleTownDropdown}
    >
      <span className="text-[13px] text-qgraytwo">{selectedTowns}</span>
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
            className="px-5 py-2 text-[13px] text-qgray hover:bg-gray-100 cursor-pointer"
            onClick={() => selectTown(town)}
          >
            {town}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


                  <div className="input-item mb-5">
                    <InputCom
                      placeholder="Your address Here"
                      label="Address*"
                      name="address"
                      type="text"
                      inputClasses="h-[50px]"
                    />
                  </div>
                 
                    <div className="flex-1">
                      <div className="w-full h-[50px] mb-5 sm:mb-0">
                        <InputCom
                          label="Postcode / ZIP*"
                          inputClasses="w-full h-full"
                          type="text"
                           name="postcode"
                          placeholder="00000"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="forgot-password-area mb-7">
                    <div className="remember-checkbox flex items-center space-x-2.5">
                      <button
                        onClick={rememberMe}
                        type="button"
                        className="w-5 h-5 text-qblack flex justify-center items-center border border-light-gray"
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
                      <span
                        onClick={rememberMe}
                        className="text-base text-black"
                      >
                        I agree all
                        <span className="text-qblack">tarm and condition</span>
                        in BigShop.
                      </span>
                    </div>
                  </div>
                  <div className="signin-area mb-3">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={saveUserDetails}
                        className="black-btn text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
                      >
                        <span>Create Account</span>
                      </button>
                    </div>
                  </div>

                  <div className="signup-area flex justify-center">
                    <p className="text-base text-qgraytwo font-normal">
                      Alrady have an Account?
                      <Link to="/login" className="ml-2 text-qblack">
                        Log In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 lg:flex hidden transform scale-60 xl:scale-100   xl:justify-center">
              <div
                className="absolute xl:-right-20 -right-[138px]"
                style={{ top: "calc(50% - 248px)" }}
              >
                <Thumbnail />
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}
