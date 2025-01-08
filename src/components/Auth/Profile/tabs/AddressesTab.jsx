import React, { useState,useEffect } from "react";
import { doc, setDoc ,getDoc, getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebse";
import { getAuth } from "firebase/auth";
import Swal from 'sweetalert2'; // Import SweetAlert2
import Draggable from "react-draggable";

export default function AddressesTab() {
const auth = getAuth();
const currentUser = auth.currentUser;
const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address:"",
    country: "",
    state: "",
    city: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    const docRef = doc(db, "users", sanitizedEmail, "Deliveryaddress", formData.email.replace(/\s/g, "_"));
  
    try {
      await setDoc(docRef, { 
        ...formData, 
        userId: currentUser.uid, // Add current user UID
        timestamp: new Date(),  // Optional: Add a timestamp
      });
      alert("Address added successfully!");
      setShowPopup(false); // Close the popup after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        address:"",
        country: "",
        state: "",
        city: "",
      });
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address. Please try again.");
    }
  };

  const [addresses, setAddresses] = useState([]); // State to hold fetched addresses
  const [loading, setLoading] = useState(true);  // State to handle loading

  const fetchAddresses = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("No user is currently logged in.");
      return;
    }

    const sanitizedEmail = currentUser.email.replace(/\s/g, "_");
    const db = getFirestore();
    const collectionRef = collection(db, "users", sanitizedEmail, "Deliveryaddress");

    try {
      const querySnapshot = await getDocs(collectionRef);
      const fetchedAddresses = querySnapshot.docs.map(doc => ({
        id: doc.id, // Include document ID
        ...doc.data(),
      }));
      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alert("Failed to fetch addresses. Please try again.");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    fetchAddresses(); // Fetch addresses when the component loads
  }, []);

  const deleteAddress = async (addressId) => {
    try {
      // Show confirmation dialog before deleting the address
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete this address?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });
  
      if (result.isConfirmed) {
        // Reference to the address document in Firestore
        const addressDoc = doc(db, 'addresses', addressId);
        
        // Delete the document from Firestore
        await deleteDoc(addressDoc);
        
        // Show success notification
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Address has been deleted.',
          confirmButtonText: 'OK',
        });
  
        // Update state to remove the deleted address
        setAddresses(addresses.filter((a) => a.id !== addressId));
      }
  
    } catch (error) {
      // Show error notification if there's an issue
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `There was an error deleting the address: ${error.message}`,
        confirmButtonText: 'Try Again',
      });
      
      console.error('Error deleting address:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-[30px]">
      {loading ? (
    <p>Loading addresses...</p>
  ) : addresses.length > 0 ? (
    addresses.map((address, index) => (
      <div
        key={address.id}
        className="w-full bg-primarygray p-5 border"
      >
        <div className="flex justify-between items-center">
          <p className="title text-[22px] font-semibold">
            {`Address : ${index + 1}`}  {/* Display Address 1, Address 2, etc. */}
          </p>
          <button
  type="button"
  className="border border-qgray w-[34px] h-[34px] rounded-full flex justify-center items-center"
  onClick={() => {
    deleteAddress(address.id); // Call the delete function with the address ID
  }}
>
  <svg
    width="17"
    height="19"
    viewBox="0 0 17 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.7768 5.95215C15.6991 6.9104 15.6242 7.84603 15.5471 8.78237C15.3691 10.9285 15.1917 13.0747 15.0108 15.2209C14.9493 15.9473 14.9097 16.6773 14.8065 17.3988C14.6963 18.1726 14.0716 18.7161 13.2929 18.7196C10.3842 18.7323 7.47624 18.7337 4.56757 18.7189C3.70473 18.7146 3.08639 18.0794 3.00795 17.155C2.78181 14.493 2.57052 11.8302 2.35145 9.16821C2.2716 8.19442 2.1875 7.22133 2.10623 6.24824C2.09846 6.15638 2.09563 6.06451 2.08998 5.95286C6.65579 5.95215 11.2061 5.95215 15.7768 5.95215ZM5.25375 8.05803C5.25234 8.05803 5.25163 8.05803 5.25022 8.05803C5.27566 8.4573 5.3011 8.85657 5.32583 9.25584C5.46717 11.5228 5.60709 13.7891 5.75125 16.0561C5.77245 16.3897 5.99081 16.6038 6.28196 16.6024C6.58724 16.601 6.80066 16.3636 6.8056 16.0159C6.80702 15.9339 6.80136 15.8512 6.79571 15.7692C6.65367 13.4789 6.51304 11.1886 6.36888 8.89826C6.33849 8.41702 6.31164 7.93507 6.26146 7.45524C6.22966 7.1549 6.0318 6.99732 5.73076 6.99802C5.44526 6.99873 5.24033 7.2185 5.23043 7.52873C5.22619 7.7054 5.24598 7.88207 5.25375 8.05803ZM12.6102 8.05521C12.6088 8.05521 12.6074 8.05521 12.606 8.05521C12.6152 7.89055 12.6321 7.7259 12.6307 7.56195C12.6286 7.24465 12.4399 7.02417 12.1622 6.99873C11.888 6.97329 11.6484 7.16268 11.5961 7.46443C11.5665 7.63756 11.5615 7.81494 11.5502 7.9909C11.4626 9.38799 11.3749 10.7851 11.2887 12.1822C11.2103 13.4499 11.1276 14.7184 11.0576 15.9869C11.0379 16.3431 11.2463 16.5819 11.5495 16.6003C11.8562 16.6194 12.088 16.4017 12.1099 16.0505C12.2788 13.3856 12.4441 10.7208 12.6102 8.05521ZM9.45916 11.814C9.45916 10.4727 9.45986 9.13147 9.45916 7.79091C9.45916 7.25101 9.28603 6.99449 8.92845 6.99661C8.56805 6.99802 8.40198 7.24819 8.40198 7.79586C8.40127 10.4664 8.40127 13.1369 8.40268 15.8074C8.40268 15.948 8.37088 16.1289 8.44296 16.2194C8.56946 16.3763 8.76591 16.5748 8.93198 16.5741C9.09805 16.5734 9.29309 16.3727 9.41746 16.2151C9.48955 16.124 9.45704 15.9431 9.45704 15.8032C9.46057 14.4725 9.45916 13.1432 9.45916 11.814Z"
      fill="#EB5757"
    />

  </svg>
</button>

        </div>
        <div className="mt-5">
          <p>
            <strong>Name:</strong> {address.name}
          </p>
          <p>
            <strong>Email:</strong> {address.email}
          </p>
          <p>
            <strong>Phone:</strong> {address.phone}
          </p>
          <p>
            <strong>Address:</strong> {address.address}
          </p>
          <p>
            <strong>Country:</strong> {address.country}
          </p>
          <p>
            <strong>State:</strong> {address.state}
          </p>
          <p>
            <strong>City:</strong> {address.city}
          </p>
        </div>
      </div>
    ))
  ) : (
    <p>No addresses found.</p>
  )}
</div>
      <div className="w-[180px] h-[50px] mt-4">
         {/* Button to Show Popup */}
      <button
        type="button"
        className="yellow-btn"
        onClick={() => setShowPopup(true)}
      >
        <div className="w-full text-sm font-semibold">Add New Address</div>
      </button>

{/* Popup Form */}
{showPopup && (
  <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg h-auto max-h-[100%] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Add New Address</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* Country */}
        <div className="mb-4">
          <label className="block text-gray-700">Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* State */}
        <div className="mb-4">
          <label className="block text-gray-700">State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* City */}
        <div className="mb-4">
          <label className="block text-gray-700">City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => setShowPopup(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      </div>
    </>
  );
}
