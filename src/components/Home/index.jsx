import { useEffect, useState } from "react";
import { db } from "../firebse";
import { collection, doc, getDoc } from "firebase/firestore";
import datas from "../../data/products.json";
import SectionStyleTwo from "../Helpers/SectionStyleTwo";
import Layout from "../Partials/Layout";
import Banner from "./Banner";
import BrandSection from "./BrandSection";
import ProductsAds from "./ProductsAds";
import ViewMoreTitle from "../Helpers/ViewMoreTitle";

export default function Home() {
  const { products } = datas;
  const brands = products.map((product) => product.brand);

  const [imageUrls, setImageUrls] = useState({ images8: "", images2: "" ,images9: "",images11: "",images10: ""});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const imagesRef = collection(
          db,
          "admin",
          "nithya123@gmail.com",
          "webimages"
        );

        const docIds = ["images8", "images2","images9","images11","images10"];
        let fetchedImages = {};

        for (const docId of docIds) {
          const docRef = doc(imagesRef, docId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            fetchedImages[docId] = docSnap.data().image; // Assuming `image` field contains the URL
          }
        }

        setImageUrls(fetchedImages);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <Layout>
      <Banner className="banner-wrapper mb-[60px]" />
      
      <ViewMoreTitle
        className="popular-products mb-[60px]"
        seeMoreUrl="/all-products"
        categoryTitle="All Products"
      >
        <SectionStyleTwo products={products} />
      </ViewMoreTitle>

      {!loading ? (
        <ProductsAds
          ads={[imageUrls.images8, imageUrls.images2]}
          sectionHeight="sm:h-[350px] h-full"
          className="products-ads-section mb-[60px]"
        />
      ) : (
        <p className="text-center">Loading images...</p>
      )}

      <BrandSection
        sectionTitle="Shop by Collection"
        className="brand-section-wrapper mb-[60px]"
      />

{!loading ? (
        <ProductsAds
          ads={[imageUrls.images9]}
          sectionHeight="sm:h-[350px] h-full"
          className="products-ads-section mb-[60px]"
        />
      ) : (
        <p className="text-center">Loading images...</p>
      )}


      <ViewMoreTitle
        className="popular-products mb-[60px]"
        seeMoreUrl="/all-products"
        categoryTitle="All Products"
      >
        <SectionStyleTwo products={products} />
      </ViewMoreTitle>

      {!loading ? (
        <ProductsAds
          ads={[imageUrls.images11, imageUrls.images10]}
          sectionHeight="sm:h-[350px] h-full"
          className="products-ads-section mb-[60px]"
        />
      ) : (
        <p className="text-center">Loading images...</p>
      )}

    </Layout>
  );
}
