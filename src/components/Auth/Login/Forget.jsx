import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { db, app } from "../../firebse"; // Ensure the path is correct
import { Link } from "react-router-dom";
import Navbar from "../../Partials/Headers/HeaderOne/Navbar";
import Middlebar from "../../Partials/Headers/HeaderOne/Middlebar";
import TopBar from "../../Partials/Headers/HeaderOne/TopBar";
import Footer from "../../Partials/Footers/Footer";
import Swal from "sweetalert2";
import { LockClosedIcon } from '@heroicons/react/solid';
// Correct imports for Firebase v9+


import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth"; // Import necessary functions


export default function ResetPassword({ email }) {
  const [emailInput, setEmailInput] = useState(""); // State for email input
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app); // Initialize Firebase Auth
  const currentUser = auth.currentUser;

//   const handlePasswordReset = async () => {
//     if (!emailInput) {
//       Swal.fire({
//         icon: "warning",
//         title: "Missing Email",
//         text: "Please enter your email address.",
//       });
//       return;
//     }

//     if (!newPassword || !confirmPassword) {
//       Swal.fire({
//         icon: "warning",
//         title: "Missing Information",
//         text: "Please enter both new password and confirm password.",
//       });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Passwords Do Not Match",
//         text: "The new password and confirm password fields must match.",
//       });
//       return;
//     }

//     setLoading(true); // Set loading state to true while processing

//     try {
//       // If the user is already authenticated, update their password directly
//       if (currentUser) {
//         await updatePassword(currentUser, newPassword); // Update the password of the logged-in user
//         Swal.fire({
//           icon: "success",
//           title: "Password Updated",
//           text: "Your password has been successfully updated.",
//         });
//       } else {
//         // If the user is not logged in, send a password reset email
//         await sendPasswordResetEmail(auth, emailInput);
//         Swal.fire({
//           icon: "info",
//           title: "Password Reset Email Sent",
//           text: "Please check your email for the password reset link.",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating password:", error);

//       if (error.code === "auth/user-not-found") {
//         Swal.fire({
//           icon: "warning",
//           title: "User Not Found",
//           text: "The email you entered is not registered. Please check and try again.",
//         });
//       } else if (error.code === "auth/invalid-credential") {
//         Swal.fire({
//           icon: "error",
//           title: "Invalid Credentials",
//           text: "There was an error with your credentials. Please check and try again.",
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Update Failed",
//           text: "There was an error updating the password. Please try again.",
//         });
//       }
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

  return (
    <div>
      <TopBar />
      <Middlebar />
      <Navbar />

      <div className="flex justify-center items-center min-h-screen bg-purple-200">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800 flex items-center justify-center">
        <LockClosedIcon className="h-6 w-6 text-gray-600 mr-2" /> Reset Password
      </h1>

          <div className="mb-5">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter Email"
              className="h-[50px] w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>



          <div className="mb-5">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
              className="h-[50px] w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-5">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="h-[50px] w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="text-center mb-8">
            <button
              // onClick={handlePasswordReset}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-all"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save New Password"}
            </button>
          </div>

          <div className="text-center mb-5">
            <p className="text-sm text-gray-700">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="signup-area flex justify-center">
            <p className="text-base text-black">
              Already have an account?{" "}
              <Link to="/login" className="ml-2 text-black hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
