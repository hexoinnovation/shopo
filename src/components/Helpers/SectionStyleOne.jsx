import { useState } from "react";
import ProductCardStyleOne from "./Cards/ProductCardStyleOne";
import DataIteration from "./DataIteration";
import ViewMoreTitle from "./ViewMoreTitle";

export default function SectionStyleOne({
  className,
  sectionTitle,
  seeMoreUrl,
  products = [],
}) {
  // Sort products by the 'createdAt' field in descending order (newest first)
  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div data-aos="fade-up" className={`section-style-one ${className || ""}`}>
      <ViewMoreTitle categoryTitle={sectionTitle} seeMoreUrl={seeMoreUrl}>
        <div className="products-section w-full">
          <div className="grid xl:grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[20px] gap-4">
            <DataIteration
              datas={sortedProducts}
              startLength={0}
              endLength={1} // Displaying the first 3 products
            >
              {({ datas }) => (
                <div key={datas.id} className="item">
                  <ProductCardStyleOne datas={datas} />
                </div>
              )}
            </DataIteration>
          </div>
        </div>
      </ViewMoreTitle>
    </div>
  );
}
