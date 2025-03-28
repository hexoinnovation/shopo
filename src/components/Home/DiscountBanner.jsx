import { useState, useEffect } from "react";
import { db } from "../firebse";
import { collection, getDoc ,doc,setDoc} from "firebase/firestore";

export default function DiscountBanner({ className, type }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const imageDocs = ["images7"]; // Add more IDs if needed
        let fetchedBanners = [];

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
              uploadedAt: data.uploadedAt || new Date().toISOString(),
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
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const activeBanner = banners[activeImage];
  
  return (
    <div
    className={`discount-banner w-full h-[300px] bg-cover flex justify-center items-center ${
      className || ""
    }`}
    style={{
      backgroundImage: activeBanner
        ? `url(${activeBanner.url})`
        : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
      {type === 3 ? (
        <div className="container-x mx-auto">
          <div className="best-services w-full flex flex-col space-y-10 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center lg:h-[110px] px-10 lg:py-0 py-10">
            <div className="item flex items-center space-x-5">
              <div className="cracked-icon">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1H5.63636V24.1818H35"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-[15px] font-700 tracking-wide mb-1">
                  Free Shipping
                </p>
                <p className="text-sm text-qgray">On orders over $100</p>
              </div>
            </div>
            <div className="item flex items-center space-x-5">
              <div className="cracked-icon">
                <svg
                  width="32"
                  height="34"
                  viewBox="0 0 32 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M30.7 2L29.5 10.85L20.5 9.65"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-[15px] font-700 tracking-wide mb-1">
                  Free Return
                </p>
                <p className="text-sm text-qgray">Return within 30 days</p>
              </div>
            </div>
            <div className="item flex items-center space-x-5">
              <div className="cracked-icon">
                <svg
                  width="32"
                  height="38"
                  viewBox="0 0 32 38"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
                    stroke="#FBBF24"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-[15px] font-700 tracking-wide mb-1">
                  Secure Payment
                </p>
                <p className="text-sm text-qgray">100% Secure Online Payment</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div data-aos="fade-up">
            <h1 className="sm:text-3xl text-xl font-700 text-white mb-2">
              Get <span className="mx-1 text-qyellow">20%</span> Off Discount
              Coupon
            </h1>
            <p className="text-center sm:text-[18px] text-sm font-400 text-white">
              Subscribe to our Newsletter
            </p>
          </div>
          <div
            data-aos="fade-right"
            className="sm:w-[543px] w-[300px] h-[54px] flex mt-8 mx-auto"
          >
            <div className="flex-1 bg-white pl-4 flex space-x-2 items-center h-full focus-within:text-qyellow text-qblack">
              <span>
                <svg
                  width="17"
                  height="15"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 14H2C1.4 14 1 13.6 1 13V2C1 1.4 1.4 1 2 1H15C15.6 1 16 1.4 16 2V13C16 13.6 15.6 14 15 14Z"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 4L8.5 8.5L14 4"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                className="w-full h-full focus:outline-none text-sm placeholder:text-xs placeholder:text-qblack text-qblack font-400 tracking-wider"
                placeholder="EMAIL ADDRESS"
              />
            </div>
            <button
              type="button"
              className="sm:w-[158px] w-[80px] h-full bg-qyellow text-sm font-600"
            >
              Get the Coupon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
