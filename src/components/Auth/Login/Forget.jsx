import React, { useState, useRef } from "react";
import { auth, db } from "../../firebse"; // Make sure to import your Firebase instance
import { doc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import Swal from "sweetalert2";
import Navbar from "../../Partials/Headers/HeaderOne/Navbar";
import TopBar from "../../Partials/Headers/HeaderOne/TopBar";
import Middlebar from "../../Partials/Headers/HeaderOne/Middlebar";
import Footer from "../../Partials/Footers/Footer";

export default function Forget() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const formRef = useRef();

  const sanitizeEmail = (email) => email.replace(/\ /g, "_");

  const handleCancel = () => {
    formRef.current.reset();
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const updatePasswordForUser = async () => {
    if (!email || !password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please fill in all fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
        text: "Please make sure the new password and confirm password are the same.",
      });
      return;
    }

    try {
      // Sign in the user with the provided email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update password in Firebase Authentication
      await updatePassword(user, password);

      // Update password in Firestore
      const sanitizedEmail = sanitizeEmail(email);
      const userDocRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail); // Firestore document path

      // Update the password field in Firestore
      await updateDoc(userDocRef, { password });

      Swal.fire({
        icon: "success",
        title: "Password Updated Successfully",
        text: "Your password has been updated in Firebase Authentication and Firestore.",
      });
      handleCancel();
    } catch (error) {
      console.error("Error updating password:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "An error occurred while updating the password.",
      });
    }
  };

  return (
    <div>
      <TopBar />
      <Middlebar />
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 mb-20">
        <form ref={formRef} className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Change Password</h2>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="email">
              Email*
            </label>
            <input
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="password">
              New Password*
            </label>
            <input
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-2" htmlFor="confirm_password">
              Confirm Password*
            </label>
            <input
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="confirm_password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
              onClick={updatePasswordForUser}
            >
              Update Password
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
