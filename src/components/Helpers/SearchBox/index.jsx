export default function SearchBox({ className, type }) {
  return (
    <div
      className={`w-full h-full flex items-center border border-qgray-border bg-white ${
        className || ""
      }`}
    >
      {/* Search Input */}
      <div className="flex-1 bg-red-500 h-full">
        <form action="#" className="h-full">
          <input
            type="text"
            className="search-input w-full h-full px-4 text-sm border-none focus:outline-none"
            placeholder="Search Product..."
          />
        </form>
      </div>
      
      {/* Divider */}
      <div className="w-[1px] h-[22px] bg-qgray-border"></div>
      
      {/* Search Button */}
      <button
        className={`w-[93px] h-full text-sm font-bold ${
          type === 3 ? "bg-qh3-blue text-white" : "search-btn"
        }`}
        type="button"
      >
        Search
      </button>
    </div>
  );
}
