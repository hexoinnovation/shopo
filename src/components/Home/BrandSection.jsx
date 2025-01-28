export default function CrackerBrandSection({ className, sectionTitle }) {
  return (
    <div data-aos="fade-up" className={`w-full ${className || ""}`}>
      <div className="container-x mx-auto">
        <div className="section-title flex justify-center items-center mb-10">
          <div className="text-center">
            <h1 className="sm:text-4xl text-2xl font-bold text-purple-700">
              {sectionTitle}
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover top cracker brands to light up your celebration!
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-6">
          {/* Cracker Brand 1 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/7.jpg`}
                alt="Cracker Brand 1"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 2 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/5.webp`}
                alt="Cracker Brand 2"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 3 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-700 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/6.jpg`}
                alt="Cracker Brand 3"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 4 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/4.webp`}
                alt="Cracker Brand 4"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 5 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/4.webp`}
                alt="Cracker Brand 5"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 6 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-yellow-500 via-red-500 to-orange-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/5.webp`}
                alt="Cracker Brand 6"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 7 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/7.jpg`}
                alt="Cracker Brand 7"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 8 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-red-400 via-orange-400 to-yellow-500 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/6.jpg`}
                alt="Cracker Brand 8"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 9 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/4.webp`}
                alt="Cracker Brand 9"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 10 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/7.jpg`}
                alt="Cracker Brand 10"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 11 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-indigo-500 via-blue-600 to-purple-700 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/5.webp`}
                alt="Cracker Brand 11"
                className="w-3/4 object-contain"
              />
            </div>
          </div>

          {/* Cracker Brand 12 */}
          <div className="item">
            <div className="w-full h-[150px] bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-600 border-4 border-white flex justify-center items-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/assets/images/6.jpg`}
                alt="Cracker Brand 12"
                className="w-3/4 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
