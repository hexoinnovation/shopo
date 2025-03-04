import { useState } from "react";
import productDatas from "../../data/products.json";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/Layout";
import ProductsFilter from "./ProductsFilter";

export default function AllProductPage() {
  const [filters, setFilter] = useState({
    // ... other filter states
  });

  const checkboxHandler = (e) => {
    const { name } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const [volume, setVolume] = useState({ min: 200, max: 500 });
  const [storage, setStorage] = useState(null);
  const filterStorage = (value) => {
    setStorage(value);
  };

  const [filterToggle, setToggle] = useState(false);
  const [isGridView, setIsGridView] = useState(true); // State to toggle between grid and list view

  const { products } = productDatas;

  // Remove duplicates by ensuring unique products
  const uniqueProducts = Array.from(
    new Map(products.map((item) => [item.id, item])).values()
  );

  // Slice the uniqueProducts for different display sections
  const firstSet = uniqueProducts.slice(0, 6); // First 6 products
  const secondSet = uniqueProducts.slice(6, 15); // Next 9 products

  return (
    <Layout>
      <div className="products-page-wrapper w-full">
        <div className="container-x mx-auto">
          {/* <BreadcrumbCom /> */}
          <div className="w-full lg:flex lg:space-x-[30px]">
            {/* <div className="lg:w-[270px]"> */}
              {/* <ProductsFilter
                
              /> */}
              {/* Ads */}
              {/* <div className="w-full hidden lg:block h-[295px]">
                <img
                  src={`${
                    import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/bannera-5.png`}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div> */}
            {/* </div> */}

            <div className="flex-1">
              {/* <div className="products-sorting w-full bg-white md:h-[70px] flex md:flex-row flex-col md:space-y-0 space-y-5 md:justify-between md:items-center p-[30px] mb-[40px]">
                <div>
                  <p className="font-400 text-[13px]">
                    <span className="text-qgray"> Showing</span> 1–16 of 66
                    results
                  </p>
                </div>
                <div className="flex space-x-3 items-center">
                  <span className="font-400 text-[13px]">Sort by:</span>
                  <div className="flex space-x-3 items-center border-b border-b-qgray">
                    <span className="font-400 text-[13px] text-qgray">
                      Default
                    </span>
                    <span>
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1 1L5 5L9 1" stroke="#9A9A9A" />
                      </svg>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setToggle(!filterToggle)}
                  type="button"
                  className="w-10 lg:hidden h-10 rounded flex justify-center items-center border border-qyellow text-qyellow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>
                {/* View Toggle Buttons */}
                {/* <div className="flex space-x-3 items-center"></div> */}
              {/* </div> */} 

              {/* First Set of Products */}
              <div
                className={`${
                  isGridView
                    ? "flex flex-wrap gap-5 mb-[100px] w-full"
                    : "w-full mb-[100px]"
                }`}
              >
                <DataIteration datas={firstSet} startLength={0} endLength={1}>
                  {({ datas }) => (
                    <div data-aos="fade-up" key={datas.id} className="w-full">
                      <ProductCardStyleOne datas={datas} />
                    </div>
                  )}
                </DataIteration>
              </div>

              <div className="w-full h-[164px] overflow-hidden mb-[40px]">
                <img
                  src={`${
                    import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/bannera-6.png`}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Second Set of Products */}
              <div
                className={`${
                  isGridView
                    ? "grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5 mb-[40px]"
                    : "w-full mb-[40px]"
                }`}
              >
                <DataIteration datas={secondSet} startLength={6} endLength={15}>
                  {({ datas }) => (
                    <div data-aos="fade-up" key={datas.id}>
                      <ProductCardStyleOne datas={datas} />
                    </div>
                  )}
                </DataIteration>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
