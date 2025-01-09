import { useState, useEffect } from "react";
import InputQuantityCom from "../Helpers/InputQuantityCom";
import { getFirestore, doc, updateDoc, arrayUnion, getDocs, setDoc ,collection} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ProductsTable({ className }) {
  const [products, setProducts] = useState([]);
  const [cartEmpty, setCartEmpty] = useState(false);
  const [product, setProduct] = useState([]);
  
  const fetchCart = async () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const sanitizedEmail = user.email ? user.email.replace(/\ /g, "_") : "unknown_user";
        const cartCollectionRef = collection(db, "users", sanitizedEmail, "cart"); // Reference the cart subcollection
  
        // Fetch all documents in the "cart" subcollection
        const querySnapshot = await getDocs(cartCollectionRef);
  
        // Map all items from each document in the subcollection
        const items = querySnapshot.docs.flatMap((doc) => doc.data().items);
  
        console.log("Cart Items:", items);
  
        if (items.length > 0) {
          setProducts(items); // Update the state with fetched items
          setCartEmpty(false); // Indicate the cart is not empty
        } else {
          setProducts([]);
          setCartEmpty(true); // Indicate the cart is empty
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to fetch cart data.");
        setProducts([]); // Reset the state on error
        setCartEmpty(true); // Indicate the cart is empty
      }
    } else {
      alert("Please log in to view your cart.");
      setProducts([]);
      setCartEmpty(true); // Indicate the cart is empty if the user is not logged in
    }
  };
  
  useEffect(() => {
    fetchCart();
  }, []);
  
  

  const handleQuantityChange = (id, newQuantity) => {
    const updatedProducts = products.map((product) =>
      product.id === id
        ? {
            ...product,
            quantity: newQuantity,
            total: product.price * newQuantity,
          }
        : product
    );
    setProducts(updatedProducts);
  };

  const handleRemoveProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap min-w-[300px]">product</td>
              <td className="py-4 whitespace-nowrap text-center">category</td>
              <td className="py-4 whitespace-nowrap text-center">price</td>
              <td className="py-4 whitespace-nowrap text-center">quantity</td>
              <td className="py-4 whitespace-nowrap text-center">total</td>
              <td className="py-4 whitespace-nowrap text-right w-[114px]"></td>
            </tr>

            {cartEmpty ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-xl font-semibold text-gray-600">
                  Your cart is empty. Start shopping now!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr className="bg-white border-b hover:bg-gray-50" key={product.id}>
                  <td className="pl-10 py-4 w-[380px]">
                    <div className="flex space-x-6 items-center">
                    <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
            <img
              src={product.image || "fallback_image_url"} // Ensure you handle the base64 or URL properly
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
                      <div className="flex-1 flex flex-col">
                        <p className="font-medium text-[15px] text-qblack">{product.name}</p>
                        <p className="text-[12px] text-gray-500">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">{product.category}</td>
                  <td className="text-center py-4 px-2">${product.price}</td>
                  <td className="py-4">
                    <div className="flex justify-center items-center">
                      <InputQuantityCom
                        quantity={product.quantity || 1} // Default quantity to 1 if not available
                        onQuantityChange={(newQuantity) =>
                          handleQuantityChange(product.id, newQuantity)
                        }
                      />
                    </div>
                  </td>
                  <td className="text-center py-4">
                    <span className="text-[15px] font-normal">
                      ${product.price * (product.quantity || 1)}
                    </span>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <button onClick={() => handleRemoveProduct(product.id)}>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.7 0.3C9.3 -0.1 8.7 -0.1 8.3 0.3L5 3.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L3.6 5L0.3 8.3C-0.1 8.7 -0.1 9.3 0.3 9.7C0.7 10.1 1.3 10.1 1.7 9.7L5 6.4L8.3 9.7C8.7 10.1 9.3 10.1 9.7 9.7C10.1 9.3 10.1 8.7 9.7 8.3L6.4 5L9.7 1.7C10.1 1.3 10.1 0.7 9.7 0.3Z"
                            fill="#AAAAAA"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
