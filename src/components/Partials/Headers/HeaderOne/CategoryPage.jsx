import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../../firebse"; 
import Navbar from "./Navbar";
import Middlebar from "./Middlebar";
import TopBar from "./TopBar";
import Footer from "../../Footers/Footer";
const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) {
          console.error("No user signed in.");
          return;
        }

        const userEmail = currentUser.email;
        const productsCollectionRef = collection(
          db,
          "admin",
          "nithya123@gmail.com",
          "products"
        );

        const productSnapshot = await getDocs(productsCollectionRef);
        const allProducts = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ Fix: Decode category name from URL before filtering
        const decodedCategory = decodeURIComponent(categoryName);
        const filteredProducts = allProducts.filter(
          (product) => product.category === decodedCategory
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryName]); 

  return (
    <div>
        <TopBar/>
        <Middlebar/>
        <Navbar/>
  
      <h2 className="text-2xl font-bold mt-4">Products in {decodeURIComponent(categoryName)}</h2>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="p-4 border rounded-md shadow-md">
              <img src={product.image} alt={product.name} className="w-1/2 h-60 object-cover"/>
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand}</p>
              <p className="text-lg font-bold text-blue-500">₹{product.price}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found in this category.</p>
        )}
      </div>
    
    <Footer/>
    </div>
  );
};

export default CategoryPage;
