import { useState, useEffect } from "react";
import { getFirestore, doc, deleteDoc, getDocs, collection,updateDoc ,setDoc} from "firebase/firestore";
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
      const sanitizedEmail = user.email ? user.email.replace(/\ /g, ".") : "unknown_user";
      const cartCollectionRef = collection(db, "users", sanitizedEmail, "cart");

      const querySnapshot = await getDocs(cartCollectionRef);
      const items = querySnapshot.docs.flatMap((doc) => {
        const data = doc.data();
        if (data && Array.isArray(data.items)) {
          return data.items;
        }
        return []; // Return an empty array if 'items' is undefined or not an array
      });

      // Ensure every product has an image
      const productsWithImages = items.map((product) => ({
        ...product,
        image: product.image || "fallback_image_url" // Ensure image exists
      }));

      setProducts(productsWithImages);
      setCartEmpty(items.length === 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Failed to fetch cart data.");
      setProducts([]);
      setCartEmpty(true);
    }
  } else {
    alert("Please log in to view your cart.");
    setProducts([]);
    setCartEmpty(true);
  }
};

  
  useEffect(() => {
    fetchCart();
  }, []);
  
  // Handle product removal
  const handleRemoveProduct = async (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    if (user) {
      const sanitizedEmail = user.email ? user.email.replace(/\ /g, "_") : "unknown_user";
      const cartDocRef = doc(db, "users", sanitizedEmail, "cart", id);

      try {
        await deleteDoc(cartDocRef); // Delete only the selected product
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product from cart.");
      }
    }
  };

  // Handle quantity update
  
  const saveSubtotalToFirestore = async (subtotal) => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const sanitizedEmail = user.email.replace(/\ /g, "_"); // Replace dots in email to prevent Firestore path issues
        const cartDocRef = doc(db, "users", sanitizedEmail, "cart", "amount");
  
        // Use setDoc to ensure the document is created if it doesn't exist
        await setDoc(cartDocRef, { subtotal }, { merge: true });
  
        console.log("Subtotal saved to Firestore:", subtotal);
      } catch (error) {
        console.error("Error saving subtotal:", error);
      }
    } else {
      console.error("No user is logged in. Unable to save subtotal.");
    }
  };
  const calculateTotal = () => {
    const subtotal = products.reduce((total, product) => {
      const price = Number(product.price.replace("₹", "").trim());
      const quantity = Number(product.quantity);
      if (!isNaN(price) && !isNaN(quantity)) {
        return total + price * quantity;
      }
      return total;
    }, 0);

    // Save subtotal to Firestore
    saveSubtotalToFirestore(subtotal);

    return subtotal;
  };
  
  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead>
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap min-w-[300px]">Product</td>
              <td className="py-4 whitespace-nowrap text-center">Category</td>
              <td className="py-4 whitespace-nowrap text-center">Price (₹)</td>
              <td className="py-4 whitespace-nowrap text-center">Quantity</td>
              <td className="py-4 whitespace-nowrap text-center">Total (₹)</td>
              <td className="py-4 whitespace-nowrap text-right w-[114px]"></td>
            </tr>
          </thead>
          <tbody>
            {cartEmpty ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-xl font-semibold text-gray-600">
                  Your cart is empty. Start shopping now!
                </td>
              </tr>
            ) : (
              products.map((product) => {
                // Ensure the product has an image before rendering
                //const productImage = product.image || "fallback_image_url";  // Provide a fallback image
                return (
                  <tr key={product.id}>
                    <td className="pl-10 py-4 w-[380px]">
                      <div className="flex space-x-6 items-center">
                        <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                        <img
  src={product.image || "fallback_image_url"}  // Provide a fallback image URL if the product image is missing
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
<td className="text-center py-4 px-2">{product.price}</td>
<td className="text-center py-4 px-2">{product.quantity}</td>
<td className="text-center py-4">
                  ₹{(isNaN(Number(product.price.replace("₹", "").trim())) || isNaN(Number(product.quantity)) || Number(product.price.replace("₹", "").trim()) <= 0 || Number(product.quantity) <= 0)
                    ? "0"
                    : Math.round(Number(product.price.replace("₹", "").trim()) * Number(product.quantity))}
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
                );
              })
            )}
            <tr>
              <td colSpan="4" className="py-4 text-right font-semibold text-lg">Total:</td>
              <td colSpan="2" className="py-4 text-center font-semibold text-lg"> ₹{Math.round(calculateTotal())}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
