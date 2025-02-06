import { useState } from "react";
import InputCom from "../../Helpers/InputCom";
import Layout from "../../Partials/Layout";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc,getDoc } from "firebase/firestore";
import { db, app } from "../../firebse";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [checked, setValue] = useState(false);
  const rememberMe = () => {
    setValue(!checked);
  };
  const auth = getAuth(app);
  const navigate = useNavigate();

  const loginUser = async () => {
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter both email and password.",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const sanitizedEmail = email.replace(/\ /g, "_");
      const docRef = doc(
        db,
        "admin",
        "nithya123@gmail.com",
        "users",
        sanitizedEmail
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${docSnap.data().firstName || "User"}!`,
        }).then(() => {
          navigate("/"); // Redirect to the Home page after clicking OK
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Account Not Found",
          text: "No additional details found for this account.",
        }).then(() => {
          navigate("/"); // Redirect to the Home page after clicking OK
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="flex justify-center items-center min-h-screen bg-purple-200">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Log In
          </h1>
          <div className="mb-5">
            <InputCom
              placeholder="example@quomodosoft.com"
              label="Email Address*"
              name="email"
              type="email"
              inputClasses="h-[50px] w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-5">
            <InputCom
              placeholder="● ● ● ● ● ●"
              label="Password*"
              name="password"
              type="password"
              inputClasses="h-[50px] w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center space-x-2">
              <button
                onClick={rememberMe}
                type="button"
                className="w-5 h-5 text-gray-700 flex justify-center items-center border border-gray-400 rounded"
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
              <span onClick={rememberMe} className="text-base text-gray-700">
                Remember Me
              </span>
            </div>
            
          </div>
          <div className="mb-5">
            <button
              type="button"
              onClick={loginUser}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold"
            >
              Log In
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-700">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
