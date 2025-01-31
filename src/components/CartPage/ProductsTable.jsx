import { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  deleteDoc,
  getDocs,
  collection,
  setDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ElegantProductsTable({ className }) {
  const [products, setProducts] = useState([]);
  const [cartEmpty, setCartEmpty] = useState(false);
  
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user || ! user.email) {
      alert("Please log in to view your Cart.");
      return;
    } 
    const sanitizedEmail = user.email.replace(/\ /g, "_at_");
    const cartRef = collection(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart");

    try {
      const cartSnapshot = await getDocs(cartRef);
      const cartData = cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(cartData);
      setCartEmpty(cartData.length === 0);
    } catch (error) {
      console.error("Error fetching cart items: ", error);
    }
  };

  const handleRemoveProduct = async (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);

    if (user) {
      const sanitizedEmail = user.email.replace(/\ /g, "_at_");
      const cartDocRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "add_to_cart", id);

      try {
        await deleteDoc(cartDocRef);
        fetchCartItems();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product from cart.");
      }
    }
  };

  const saveSubtotalToFirestore = async (subtotal) => {
    if (user) {
      try {
        const sanitizedEmail = user.email.replace(/\ /g, "_at_");
        const cartDocRef = doc(db, "admin", "nithya123@gmail.com", "users", sanitizedEmail, "cart_total","amount");

        await setDoc(cartDocRef, { subtotal }, { merge: true });

        console.log("Subtotal saved to Firestore:", subtotal);
      } catch (error) {
        console.error("Error saving subtotal:", error);
      }
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    const subtotal = products.reduce((total, product) => {
      const price = parseFloat(product.price.replace("₹", "").trim());
      const quantity = parseInt(product.quantity, 10);
      return !isNaN(price) && !isNaN(quantity) ? total + price * quantity : total;
    }, 0);

    saveSubtotalToFirestore(subtotal);
    return subtotal;
  };


  return (
    <div className={`w-full bg-white shadow-lg rounded-lg p-2 mb-40 ${className || ""}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart</h2>
      <div className="relative w-full overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="text-md font-semibold text-white bg-purple-800 uppercase">
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price (₹)</th>
              <th className="py-4 px-6">Quantity</th>
              <th className="py-4 px-6">Total (₹)</th>
              <th className="py-4 px-6 text-right">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartEmpty ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-lg text-gray-500">Your cart is empty</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                  <td className="py-4 px-6 flex items-center">
                    <img src={product.image || "fallback_image_url"} alt={product.name} className="w-12 h-12 rounded-md mr-4" />
                    <span className="font-medium">{product.name}</span>
                  </td>
                  <td className="py-4 px-6 text-center">{product.category}</td>
                  <td className="py-4 px-6 text-center">{product.price}</td>
                  <td className="py-4 px-6 text-center">{product.quantity}</td>
                  <td className="py-4 px-6 text-center">₹{(parseFloat(product.price.replace("₹", "").trim()) * parseInt(product.quantity, 10)) || 0}</td>
                  <td className="py-4 px-6 text-right">
  <button onClick={() => handleRemoveProduct(product.id)} className="text-red-800 hover:text-red-700 transition font-bold text-xl">
    &times;
  </button>
</td>

                </tr>
              ))
            )}
            <tr>
              <td colSpan="4" className="py-4 text-right font-semibold text-lg">
                Total:
              </td>
              <td colSpan="2" className="py-4 text-center font-semibold text-lg">
                ₹{Math.round(calculateTotal())}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
