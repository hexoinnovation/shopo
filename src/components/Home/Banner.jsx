import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { collection, getDoc ,doc,setDoc} from "firebase/firestore";
import { db } from "../firebse";

export default function Banner({ className }) {
  const [banners, setBanners] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        
        // Array of image document IDs to fetch
        const imageDocs = ['images3', 'images2' , 'images1']; // Add more as needed
        let fetchedBanners = [];
        
        // Fetch each image document
        for (const docId of imageDocs) {
          const imagesRef = collection(
            db, 
            "admin", 
            "nithya123@gmail.com", 
            "webimages"
          );
          
          const docRef = doc(imagesRef, docId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            fetchedBanners.push({
              id: docId,
              name: data.name || `Banner ${fetchedBanners.length + 1}`,
              url: data.image,
              isBase64: data.image?.startsWith("data:image"),
              uploadedAt: data.uploadedAt || new Date().toISOString()
            });
          }
        }
        
        // Sort by upload date (newest first)
        fetchedBanners.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        
        setBanners(fetchedBanners);
        setActiveImage(0);
      } catch (err) {
        console.error("Error fetching banner images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleImageChange = (index) => {
    setActiveImage(index);
  };

  if (loading) {
    return <div className="w-full h-[500px] flex items-center justify-center">Loading...</div>;
  }

  if (banners.length === 0) {
    return <div className="w-full h-[500px] flex items-center justify-center">No banners found</div>;
  }

  // Get up to 3 banners
  const displayBanners = banners.slice(0, 3);

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="container-x mx-auto">
        <div className="main-wrapper w-full">
        <div className="banner-card xl:flex xl:space-x-[30px] xl:h-[500px] mb-[40px]">
  {/* Main Banner - Always shows first image (image1) */}
  <div
    data-aos="fade-right"
    className="xl:w-[70%] w-full h-full transition-transform duration-500 hover:scale-105"
  >
    <Link to="">
      {displayBanners[0] && (
        <img
          src={displayBanners[0].url}
          alt={displayBanners[0].name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      )}
    </Link>
  </div>

  {/* Thumbnails - Shows image2 and image3 */}
  <div className="flex-1 flex xl:flex-col xl:space-y-[20px] h-full">
    {displayBanners[1] && (
      <div
        className="w-full h-[50%] cursor-pointer"
        onClick={() => handleImageChange(1)} // Still allows changing active image
      >
        <Link to="">
          <img
            src={displayBanners[1].url}
            alt={displayBanners[1].name}
            className="w-full h-full object-cover rounded-lg shadow-md transition-all hover:opacity-90 hover:scale-105"
          />
        </Link>
      </div>
    )}
    {displayBanners[2] && (
      <div
        className="w-full h-[50%] cursor-pointer"
        onClick={() => handleImageChange(2)} // Still allows changing active image
      >
        <Link to="">
          <img
            src={displayBanners[2].url}
            alt={displayBanners[2].name}
            className="w-full h-full object-cover rounded-lg shadow-md transition-all hover:opacity-90 hover:scale-105"
          />
        </Link>
      </div>
    )}
  </div>
</div>
          

          {/* Services Section */}
          {/* ... (keep your existing services section) ... */}
        </div>
      </div>
    </div>
  );
}