import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebse";

export default function CrackerBrandSection({ className, sectionTitle }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        
        // Array of image document IDs to fetch
        const imageDocs = ['images4', 'images5', 'images6', 'images12', 'images15', 'images16', 'images17', 'images18', 'images19'];
        let fetchedBrands = [];
        
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
            fetchedBrands.push({
              id: docId,
              name: data.name || `Brand ${fetchedBrands.length + 1}`,
              imageUrl: data.image,
              isBase64: data.image?.startsWith("data:image")
            });
          }
        }

        // If we have no images, return empty
        if (fetchedBrands.length === 0) {
          setBrands([]);
          return;
        }

        // Fill remaining slots with random duplicates from fetched images
        const displayBrands = [...fetchedBrands];
        while (displayBrands.length < 12) {
          const randomIndex = Math.floor(Math.random() * fetchedBrands.length);
          displayBrands.push({...fetchedBrands[randomIndex], id: `${fetchedBrands[randomIndex].id}-dup-${displayBrands.length}`});
        }

        setBrands(displayBrands);
      } catch (err) {
        console.error("Error fetching brand images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Predefined gradients matching your original design
  const gradients = [
    "from-purple-400 via-pink-500 to-purple-600",
    "from-yellow-400 via-orange-500 to-red-600",
    "from-indigo-500 via-purple-600 to-pink-700",
    "from-green-400 via-blue-500 to-purple-600",
    "from-pink-500 via-purple-500 to-blue-500",
    "from-yellow-500 via-red-500 to-orange-600",
    "from-teal-400 via-cyan-500 to-indigo-600",
    "from-red-400 via-orange-400 to-yellow-500",
    "from-blue-400 via-purple-500 to-indigo-600",
    "from-green-500 via-teal-500 to-blue-600",
    "from-indigo-500 via-blue-600 to-purple-700",
    "from-teal-400 via-cyan-500 to-indigo-600"
  ];

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        Loading brands...
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        No brands available
      </div>
    );
  }

  return (
    <div  className={`w-full ${className || ""}`}>
      <div className="container-x mx-auto">
        <div className="section-title flex justify-center items-center mb-10">
          <div className="text-center">
            <h1 className="sm:text-4xl text-2xl font-bold text-purple-700">
              {sectionTitle}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover top cracker brands to light up your celebration!
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-6">
          {brands.map((brand, index) => (
            <div key={brand.id} className="item">
              <div 
                className={`w-full h-[150px] bg-gradient-to-r ${gradients[index]} border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                {brand.imageUrl ? (
                  <img
                    src={brand.imageUrl}
                    alt={brand.name}
                    className="w-3/4 object-contain"
                  />
                ) : (
                  <span className="text-white font-bold text-center p-2">{brand.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}