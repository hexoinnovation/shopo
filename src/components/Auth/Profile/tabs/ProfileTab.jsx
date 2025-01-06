import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebse";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const PersonalInfo = () => {
  const [user, setUser] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: "",
  });
  const [message, setMessage] = useState("");

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
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPersonalInfo(docSnap.data());
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

  const handleUpdate = async () => {
    if (!user) {
      setMessage("Please log in to access your information.");
      return;
    }

    try {
      const docRef = doc(db, "users", user.email);
      await setDoc(docRef, personalInfo);
      setMessage("Personal information updated successfully!");
    } catch (error) {
      console.error("Error updating personal info:", error);
      setMessage("Failed to update personal information.");
    }
  };

  return (
    <div>
      <h1>Personal Info</h1>
      {!user ? (
        <p>{message || "Please log in to access your personal information."}</p>
      ) : (
        <form>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={personalInfo.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={personalInfo.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={personalInfo.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {personalInfo.image && (
              <img
                src={personalInfo.image}
                alt="Uploaded"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
          <button type="button" onClick={handleUpdate}>
            Update
          </button>
          <p>{message}</p>
        </form>
      )}
    </div>
  );
};

export default PersonalInfo;