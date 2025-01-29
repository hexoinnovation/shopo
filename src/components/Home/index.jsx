import datas from "../../data/products.json";
import SectionStyleOne from "../Helpers/SectionStyleOne";
import SectionStyleTwo from "../Helpers/SectionStyleTwo";
import Layout from "../Partials/Layout";
import Banner from "./Banner";
import BrandSection from "./BrandSection";
import ProductsAds from "./ProductsAds";
import ViewMoreTitle from "../Helpers/ViewMoreTitle";

export default function Home() {
  const { products } = datas;
  const brands = [];
  products.forEach((product) => {
    brands.push(product.brand);
  });

  return (
    <Layout>
      <div className="btn w-5 h-5 "></div>
      <Banner className="banner-wrapper mb-[60px]" />
      <ViewMoreTitle
        className="popular-products mb-[60px]"
        seeMoreUrl="/all-products"
        categoryTitle="All Products"
      >
        <SectionStyleTwo products={products} />
      </ViewMoreTitle>
      <ProductsAds
        ads={[
          `${import.meta.env.VITE_PUBLIC_URL}/assets/images/9.jpg`,
          `${import.meta.env.VITE_PUBLIC_URL}/assets/images/banner-2.jpg`,
        ]}
        sectionHeight="sm:h-[350px] h-full"
        className="products-ads-section mb-[60px]"
      />

      <BrandSection
        sectionTitle="Shop by Collection"
        className="brand-section-wrapper mb-[60px]"
      />

      <ProductsAds
        ads={[`${import.meta.env.VITE_PUBLIC_URL}/assets/images/17.jpg`]}
        sectionHeight="sm:h-[350px] h-full"
        className="products-ads-section mb-[60px]"
      />

      <ViewMoreTitle
        className="popular-products mb-[60px]"
        seeMoreUrl="/all-products"
        categoryTitle="All Products"
      >
        <SectionStyleTwo products={products} />
      </ViewMoreTitle>
      <ProductsAds
        ads={[
          `${import.meta.env.VITE_PUBLIC_URL}/assets/images/17.webp`,
          `${import.meta.env.VITE_PUBLIC_URL}/assets/images/16.jpg`,
        ]}
        sectionHeight="sm:h-[350px] h-full"
        className="products-ads-section mb-[60px]"
      />
    </Layout>
  );
}
