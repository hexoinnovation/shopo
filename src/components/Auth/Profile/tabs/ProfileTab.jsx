import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../../firebse";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2';
const PersonalInfo = () => {
  const [user, setUser] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    town: "",
    postcode: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const profileImgInput = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPersonalInfo(currentUser.email);
      } else {
        setUser(null);
      }
    });
  }, []);

  const fetchPersonalInfo = async (email) => {
    try {
      // Sanitize the email (remove spaces or special characters)
      const sanitizedEmail = email.replace(/\s/g, "_");
  
      // Reference to the user's document under the specific admin's collection
      const docRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "Profileinfo", "Profile");
  
      // Fetch the document from Firestore
      const docSnap = await getDoc(docRef);
  
      // If the document exists, set the personal information and the image
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPersonalInfo({
          ...data,  // Spread the existing fields
          image: data.image || ""  // Ensure to handle image field
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPersonalInfo({ ...personalInfo, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const browseProfileImg = () => {
    profileImgInput.current.click();
  };

  const handleUpdate = async () => {
    if (!user) {
      Swal.fire({
        title: 'Error',
        text: 'Please log in to access your information.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    try {
      // Sanitize the email (remove spaces or special characters)
      const sanitizedEmail = user.email.replace(/\s/g, "_");
  
      // Reference to the Firestore document under /admin/{adminEmail}/users/{sanitizedEmail}
      const docRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail);
  
      // Reference to the Profileinfo subcollection inside the user document
      const profileInfoRef = collection(docRef, "Profileinfo");
  
      // Reference to the 'Profile' document inside the Profileinfo subcollection
      const profileDocRef = doc(profileInfoRef, "Profile");
  
      // Update the personal info in Firestore
      await setDoc(profileDocRef, personalInfo);
  
      Swal.fire({
        title: 'Success',
        text: 'Personal information updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error updating personal info:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update personal information.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };
  

  return (
    <div className="flex space-x-8">
      <div className="w-[570px]">
        <div className="input-item flex space-x-2.5 mb-8">
          <div className="w-1/2 h-full">
            <label>First Name*</label>
            <input
              type="text"
              name="firstName"
              value={personalInfo.firstName}
              placeholder="Demo Name"
              onChange={handleInputChange}
              className="w-full h-[50px] border border-gray-300 px-3"
            />
          </div>
          <div className="w-1/2 h-full">
            <label>Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={personalInfo.lastName}
              placeholder="Demo Name"
              onChange={handleInputChange}
              className="w-full h-[50px] border border-gray-300 px-3"
            />
          </div>
        </div>
        <div className="input-item flex space-x-2.5 mb-8">
          <div className="w-1/2 h-full">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              placeholder="demoemail@gmail.com"
              onChange={handleInputChange}
              className="w-full h-[50px] border border-gray-300 px-3"
            />
          </div>
          <div className="w-1/2 h-full">
            <label>Phone Number*</label>
            <input
              type="text"
              name="phone"
              value={personalInfo.phone}
              placeholder="012 3 ******"
              onChange={handleInputChange}
              className="w-full h-[50px] border border-gray-300 px-3"
            />
          </div>
        </div>
        <div className="input-item mb-8">
          <label>Country*</label>
          <input
            type="text"
            name="country"
            value={personalInfo.country}
            placeholder="Country"
            onChange={handleInputChange}
            className="w-full h-[50px] border border-gray-300 px-3"
          />
        </div>
        <div className="input-item mb-8">
          <label>Address*</label>
          <input
            type="text"
            name="address"
            value={personalInfo.address}
            placeholder="Your address here"
            onChange={handleInputChange}
            className="w-full h-[50px] border border-gray-300 px-3"
          />
        </div>
        <div className="input-item flex space-x-2.5 mb-8">
          <div className="w-1/2 h-full">
            <label>City*</label>
            <input
              type="text"
              name="town"
              value={personalInfo.town}
              onChange={handleInputChange}
              className="w-full h-[50px] border border-gray-300 px-3"
            />
          </div>
          <div className="w-1/2 h-full">
            <label>Postcode / ZIP*</label>
            <input
              type="text"
              name="postcode"
              value={personalInfo.postcode}
              onChange={handleInputChange}
              className="w-full h-[50px] border border-gray-300 px-3"
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="update-logo w-full mb-9">
          <h1 className="text-xl tracking-wide font-bold text-qblack mb-2">
            Update Profile
          </h1>
          <div className="flex xl:justify-center justify-start">
            <div className="relative">
              <div className="sm:w-[198px] sm:h-[198px] w-[199px] h-[199px] rounded-full overflow-hidden relative">
                <img
                  src={
                    personalInfo.image ||
                    `${import.meta.env.VITE_PUBLIC_URL}/assets/images/edit-profileimg.jpg`
                  }
                  alt=""
                  className="object-cover w-full h-full"
                />
              </div>
              <input
                ref={profileImgInput}
                onChange={handleImageChange}
                type="file"
                className="hidden"
              />
              <button
                onClick={browseProfileImg}
                className="w-[32px] h-[32px] absolute bottom-7 right-0 bg-qblack rounded-full"
              >
                📷
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleUpdate}
          className="bg-qblack text-white px-6 py-2 rounded-md"
        >
          Save Changes
        </button>
        <p className="mt-4">{message}</p>
      </div>
    </div>
  );
};

export default PersonalInfo;
