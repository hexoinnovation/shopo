import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Arrow from "../../../Helpers/icons/Arrow";
import { auth, onAuthStateChanged } from "../../../firebse"; // Adjust the path accordingly
import { doc, getDoc } from "firebase/firestore";
import { db, app } from "../../../firebse";

export default function Navbar({ className, type }) {
  const [categoryToggle, setToggle] = useState(false);
  const [elementsSize, setSize] = useState("0px");

  const handler = () => {
    setToggle(!categoryToggle);
  };

  useEffect(() => {
    if (categoryToggle) {
      const getItems = document.querySelectorAll(`.categories-list li`).length;
      if (categoryToggle && getItems > 0) {
        setSize(`${42 * getItems}px`);
      }
    } else {
      setSize(`0px`);
    }
  }, [categoryToggle]);

  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPersonalInfo(currentUser.email); // Fetch additional user data
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const fetchPersonalInfo = async (email) => {
    try {
      const sanitizedEmail = email.replace(/\ /g, "_");
      const userDoc = await getDoc(doc(db, "users", sanitizedEmail));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserDetails(userData); // Save user details in state
      } else {
        console.log("No such user data found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div
      className={`nav-widget-wrapper w-full h-[60px] relative z-30 ${
        type === 3 ? "bg-purple-700" : "bg-purple-800"
      } ${className || ""}`}
    >
      <div className="container-x mx-auto h-full">
        <div className="w-full h-full relative">
          <div className="w-full h-full flex justify-between items-center">
            <div className="category-and-nav flex xl:space-x-7 space-x-3 items-center">
              {/* Category Dropdown */}
              <div className="category w-[270px] h-[53px] bg-yellow-400 px-5 rounded-t-md mt-[6px] relative">
                <button
                  onClick={handler}
                  type="button"
                  className="w-full h-full flex justify-between items-center"
                >
                  <div className="flex space-x-3 items-center">
                    <span>
                      <svg
                        className="fill-current"
                        width="14"
                        height="9"
                        viewBox="0 0 14 9"
                      >
                        <rect width="14" height="1" />
                        <rect y="8" width="14" height="1" />
                        <rect y="4" width="10" height="1" />
                      </svg>
                    </span>
                    <span className="text-sm font-600 text-qblacktext">
                      All Categories
                    </span>
                  </div>
                  <div>
                    <Arrow
                      width="5.78538"
                      height="1.28564"
                      className="fill-current text-qblacktext"
                    />
                  </div>
                </button>
                {categoryToggle && (
                  <div
                    className="fixed top-0 left-0 w-full h-full -z-10"
                    onClick={handler}
                  ></div>
                )}
                <div
                  className="category-dropdown w-full absolute left-0 top-[53px] overflow-hidden"
                  style={{ height: `${elementsSize}` }}
                >
                  <ul className="categories-list">
                    <li className="category-item">
                      <Link to="/all-products">
                        <div className="flex justify-between items-center px-5 h-10 bg-yellow-200 transition-all duration-300 ease-in-out cursor-pointer text-qblack">
                          <span className="text-xs font-400">All Products</span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Main Navigation Menu */}
              <div className="nav-links flex space-x-7 items-center">
                <Link
                  to="/"
                  className="text-sm font-600 text-white hover:text-qblue"
                >
                  Home
                </Link>
                <Link
                  to="/all-products"
                  className="text-sm font-600 text-white hover:text-qblue"
                >
                  Shop
                </Link>

                <Link
                  to="/contact"
                  className="text-sm font-600 text-white hover:text-qblue"
                >
                  Contact
                </Link>
                <Link
                  to="/about-us"
                  className="text-sm font-600 text-white hover:text-qblue"
                >
                  About Us
                </Link>
              </div>
            </div>
            <div className="become-seller-btn">
              {userDetails ? (
                <div className="black-btn ml-12 w-[161px] h-[40px] flex justify-center items-center cursor-pointer">
                  <div className="flex space-x-2 items-center">
                    <span className="text-sm font-600">
                      Welcome, {userDetails.firstName}
                    </span>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <div className="yellow-btn ml-8 w-[200px] h-[90px] flex justify-center items-center cursor-pointer">
                    <div className="flex space-x-2 items-center">
                      <span className="text-lg font-600">Login</span>
                      <span>
                        <svg
                          className="fill-current"
                          width="6"
                          height="10"
                          viewBox="0 0 6 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1.08984"
                            width="6.94106"
                            height="1.54246"
                            transform="rotate(45 1.08984 0)"
                            fill="white"
                          />
                          <rect
                            x="6"
                            y="4.9082"
                            width="6.94106"
                            height="1.54246"
                            transform="rotate(135 6 4.9082)"
                            fill="white"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div className="become-seller-btn">
              <Link to="/become-seller">
                <div className="yellow-btn ml-8 w-[200px] h-[90px] flex justify-center items-center cursor-pointer">
                  <div className="flex space-x-2 items-center">
                    <span className="text-lg font-600">Become a Seller</span>
                    <span>
                      <svg
                        className="fill-current"
                        width="6"
                        height="10"
                        viewBox="0 0 6 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="1.08984"
                          width="6.94106"
                          height="1.54246"
                          transform="rotate(45 1.08984 0)"
                          fill="white"
                        />
                        <rect
                          x="6"
                          y="4.9082"
                          width="6.94106"
                          height="1.54246"
                          transform="rotate(135 6 4.9082)"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
