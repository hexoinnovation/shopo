import ProductCardRowStyleOne from "./Cards/ProductCardRowStyleOne";
import DataIteration from "./DataIteration";

export default function SectionStyleTwo({ className, products, type }) {
  return (
    <div
      className={`section-content w-full grid sm:grid-cols-2 grid-cols-2 grid-row-2  xl:gap-[30px] gap-5 ${
        className || ""
      }`}
    >

      
      <DataIteration datas={products} startLength={0} endLength={1}>
        {({ datas }) => (
          <div key={datas.id} className="item w-full">
            <ProductCardRowStyleOne type={type} datas={datas} />
          </div>
        )}
      </DataIteration>
    </div>
  );
}
