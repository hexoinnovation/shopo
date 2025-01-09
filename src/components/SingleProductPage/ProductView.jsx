import { useState } from "react";
import Star from "../Helpers/icons/Star";
import Selectbox from "../Helpers/Selectbox";
import { getFirestore, doc, updateDoc, arrayUnion,getDoc,setDoc, } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const handleAddToCart = async (product) => {
  if (!product.id || !product.name || !product.src || !product.title || !product.category || !product.description || !product.price) {
    console.error("Missing product fields", product);
    alert("Failed to add item to cart. Some product details are missing.");
    return;
  }

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (user) {
    try {
      const sanitizedEmail = user.email ? user.email.replace(/\ /g, "_") : "unknown_user"; // Ensure email is a string

      const cartRef = doc(db, "users", sanitizedEmail, "cart", String(product.id));  // Convert product.id to a string

      // Check if the document exists
      const docSnap = await getDoc(cartRef);
      
      if (!docSnap.exists()) {
        // If document doesn't exist, create it
        await setDoc(cartRef, {
          items: [{
            id: String(product.id),  // Ensure product.id is a string
            name: product.name,
            image: product.src,  // Ensure to use correct image field (src in your case)
            title: product.title,
            category: product.category,
            description: product.description,
            price: product.price,
          }],
        });
        alert("Item added to cart (new document created)!");
      } else {
        // Document exists, update the items field
        await updateDoc(cartRef, {
          items: arrayUnion({
            id: String(product.id),
            name: product.name,
            image: product.src,
            title: product.title,
            category: product.category,
            description: product.description,
            price: product.price,
          }),
        });
        alert("Item added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  } else {
    alert("Please log in to add items to your cart.");
  }
};

export default function ProductView({ className, reportHandler }) {
  const products = [
    {
      id: 1,
      src: "product-details-1.png",
      color: "#FFBC63",
      name: "Samsung Galaxy Z Fold3",
      price: "$6.99",
      title: "3 colors in 512GB",
      category: "Mobile Phones",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page.",
    },
    {
      id: 2,
      src: "product-details-2.png",
      color: "#649EFF",
      name: "iPhone 12",
      price: "$5.99",
      title: "64GB Storage",
      category: "Mobile Phones",
      description: "The quick brown fox jumps over the lazy dog.",
    },
    // Add more products as needed
  ];

  const [src, setSrc] = useState(products[0].src);
  const changeImgHandler = (current) => {
    setSrc(current);
  };

  const [quantity, setQuantity] = useState(1);
  const increment = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className={`product-view w-full lg:flex justify-between ${className || ""}`}>
      <div data-aos="fade-right" className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px]">
        <div className="w-full">
          <div className="w-full h-[600px] border border-qgray-border flex justify-center items-center overflow-hidden relative mb-3">
            <img
              src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/${src}`}
              alt=""
              className="object-contain"
            />
            <div className="w-[80px] h-[80px] rounded-full bg-qyellow text-qblack flex justify-center items-center text-xl font-medium absolute left-[30px] top-[30px]">
              <span>-50%</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {products.map((img) => (
              <div
                onClick={() => changeImgHandler(img.src)}
                key={img.id}
                className="w-[110px] h-[110px] p-[15px] border border-qgray-border cursor-pointer"
              >
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/${img.src}`}
                  alt=""
                  className={`w-full h-full object-contain ${src !== img.src ? "opacity-50" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="product-details w-full mt-10 lg:mt-0">
          <span data-aos="fade-up" className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block">
            {products[0].category}
          </span>
          <p data-aos="fade-up" className="text-xl font-medium text-qblack mb-4">
            {products[0].name} {products[0].title}
          </p>

          <div data-aos="fade-up" className="flex space-x-[10px] items-center mb-6">
            <div className="flex">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
            <span className="text-[13px] font-normal text-qblack">6 Reviews</span>
          </div>

          <div data-aos="fade-up" className="flex space-x-2 items-center mb-7">
            <span className="text-sm font-500 text-qgray line-through mt-2">$9.99</span>
            <span className="text-2xl font-500 text-qred">{products[0].price}</span>
          </div>

          <p data-aos="fade-up" className="text-qgray text-sm text-normal mb-[30px] leading-7">
            {products[0].description}
          </p>

          <div data-aos="fade-up" className="colors mb-[30px]">
            <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">COLOR</span>
            <div className="flex space-x-4 items-center">
              {products.map((img) => (
                <div key={img.id}>
                  {img.color && img.color !== "" && (
                    <button
                      onClick={() => changeImgHandler(img.src)}
                      type="button"
                      style={{ "--tw-ring-color": `${img.color}` }}
                      className="w-[20px] h-[20px] rounded-full focus:ring-2 ring-offset-2 flex justify-center items-center"
                    >
                      <span style={{ background: `${img.color}` }} className="w-[20px] h-[20px] block rounded-full border"></span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div data-aos="fade-up" className="product-size mb-[30px]">
            <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">SIZE</span>
            <div className="w-full">
              <div className="border border-qgray-border h-[50px] flex justify-between items-center px-6 cursor-pointer">
                <Selectbox className="w-full" datas={["Small", "Medium", "Large", "Extra Large"]}>
                  {({ item }) => (
                    <>
                      <div>
                        <span className="text-[13px] text-qblack">{item}</span>
                      </div>
                      <div className="flex space-x-10 items-center">
                        <span className="text-[13px] text-qblack">3”W x 3”D x 7”H</span>
                        <span>
                          <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z" fill="#222222" />
                          </svg>
                        </span>
                      </div>
                    </>
                  )}
                </Selectbox>
              </div>
            </div>
          </div>

          <div data-aos="fade-up" className="quantity-card-wrapper w-full flex items-center h-[50px] space-x-[10px] mb-[30px]">
            <div className="w-[120px] h-full px-[26px] flex items-center border border-qgray-border">
              <div className="flex justify-between items-center w-full">
                <button onClick={decrement} type="button" className="text-base text-qgray">-</button>
                <span className="text-qblack">{quantity}</span>
                <button onClick={increment} type="button" className="text-base text-qgray">+</button>
              </div>
            </div>
            <div className="w-[60px] h-full flex justify-center items-center border border-qgray-border">
              <button type="button" onClick={() => handleAddToCart(products[0])}>
                <span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17 1C14.9 1 13 2.9 13 5C13 5.9 13.5 6.7 14.3 7.2L12.1 9.3C10.5 9.9 9 11.7 9 13.4V18C9 18.6 9.4 19 10 19H12C12.6 19 13 18.6 13 18V14C13 13.4 13.4 13 14 13H17C17.6 13 18 13.4 18 14V17C18 17.6 17.6 18 17 18H14C13.4 18 13 18.4 13 19C13 19.6 13.4 20 14 20H17C18.1 20 19 19.1 19 18V14C19 12.9 18.1 12 17 12C16.5 12 16 11.5 16 11C16 10.4 16.4 10 17 10C17.6 10 18 9.6 18 9C18 8.4 17.6 8 17 8H14C13.4 8 13 7.6 13 7C13 6.4 13.4 6 14 6C15.1 6 16 5.1 16 4C16 2.9 15.1 2 14 2C13.4 2 13 2.4 13 3C13 3.6 13.4 4 14 4C14.6 4 15 4.4 15 5C15 5.6 14.6 6 14 6H13C12.4 6 12 5.6 12 5C12 4.4 12.4 4 13 4H15C16.1 4 17 4.9 17 5.9C17.4 6.5 17 7.5 17 7C17.6 8.8 17 9.4 17 10"
                      fill="#A2A7AE"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
