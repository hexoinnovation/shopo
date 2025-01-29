import { Link } from "react-router-dom";
import CountDown from "../Helpers/CountDown";

export default function CrackerCampaignCountDown({
  className,
  lastDate,
  counterbg,
  appscreen,
}) {
  const { showDate, showHour, showMinute, showSecound } = CountDown(lastDate);

  return (
    <div>
      <div className={`w-full lg:h-[460px] ${className || ""}`}>
        <div className="container-x mx-auto h-full">
          <div className="lg:flex xl:space-x-[30px] lg:space-x-5 items-center h-full">
            <div
              data-aos="fade-right"
              className="campaign-countdown lg:w-1/2 h-full w-full mb-5 lg:mb-0"
              style={{
                background: `url(${
                  import.meta.env.VITE_PUBLIC_URL
                }/assets/images/cracker-sale-countdown.jpg) no-repeat`,
                backgroundSize: "cover",
              }}
            >
              <Link to="/cracker-sale">
                <div className="w-full xl:p-12 p-5">
                  <div className="countdown-wrapper w-full flex lg:justify-between justify-evenly mb-10">
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-purple-700 flex justify-center items-center">
                        <span className="font-700 sm:text-[30px] text-[14px] text-white">
                          {showDate}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8 text-black">
                        Days
                      </p>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-purple-500 flex justify-center items-center">
                        <span className="font-700 sm:text-[30px] text-[14px] text-white">
                          {showHour}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8 text-black">
                        Hours
                      </p>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-purple-400 flex justify-center items-center">
                        <span className="font-700 sm:text-[30px] text-[14px] text-white">
                          {showMinute}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8 text-black">
                        Minutes
                      </p>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-purple-300 flex justify-center items-center">
                        <span className="font-700 sm:text-[30px] text-[14px] text-white">
                          {showSecound}
                        </span>
                      </div>
                      <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8 text-black">
                        Seconds
                      </p>
                    </div>
                  </div>
                  <div className="countdown-title mb-4">
                    <h1 className="text-[44px] text-black font-600">
                      Cracker Sale - Blast off with Deals!
                    </h1>
                  </div>
                  <div className="inline-flex space-x-2 items-center border-b border-purple-500">
                    <span className="text-sm font-600 tracking-wide leading-7 text-black">
                      Shop Now and Save Big!
                    </span>
                    <span>
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2.08984"
                          y="0.636719"
                          width="6.94219"
                          height="1.54271"
                          transform="rotate(45 2.08984 0.636719)"
                          fill="#6A0DAD"
                        />
                        <rect
                          x="7"
                          y="5.54492"
                          width="6.94219"
                          height="1.54271"
                          transform="rotate(135 7 5.54492)"
                          fill="#6A0DAD"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            <div
              data-aos="fade-left"
              className="cracker-showcase flex-1 lg:h-full h-[430px] xl:p-12 p-5"
              style={{
                background: `url(${
                  counterbg ||
                  `${
                    import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/cracker-showcase.png`
                }) no-repeat`,
                backgroundSize: "cover",
              }}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="showcase-info">
                  <p className="text-[13px] font-600 text-black mb-3">
                    FEATURED CRACKERS
                  </p>
                  <h1 className="text-[30px] font-600 text-black leading-10 mb-8">
                    Explore Our Best Crackers
                    <br />
                    <span className="text-purple-400 border-b-2 border-purple-400 mx-2">
                      Unleash the Spark!
                    </span>
                  </h1>
                  <div className="flex space-x-5 items-center">
                    <div className="cracker-item">
                      <img
                        width="100"
                        height="100"
                        src={`${
                          import.meta.env.VITE_PUBLIC_URL
                        }/assets/images/4.webp`}
                        alt="Cracker 1"
                        className="rounded-lg shadow-md"
                      />
                      <p className="text-center text-black">Rocket Fireworks</p>
                    </div>
                    <div className="cracker-item">
                      <img
                        width="100"
                        height="100"
                        src={`${
                          import.meta.env.VITE_PUBLIC_URL
                        }/assets/images/5.webp`}
                        alt="Cracker 2"
                        className="rounded-lg shadow-md"
                      />
                      <p className="text-center text-black">
                        Colorful Sparklers
                      </p>
                    </div>
                    <div className="cracker-item">
                      <img
                        width="100"
                        height="100"
                        src={`${
                          import.meta.env.VITE_PUBLIC_URL
                        }/assets/images/6.jpg`}
                        alt="Cracker 3"
                        className="rounded-lg shadow-md"
                      />
                      <p className="text-center text-black">
                        Family Combo Pack
                      </p>
                    </div>
                  </div>
                </div>
                <div className="showcase-action">
                  <p className="text-[13px] font-600 text-black mb-3">
                    CHECK OUT MORE CRACKERS
                  </p>
                  <Link
                    to="/cracker-sale"
                    className="text-purple-400 font-semibold"
                  >
                    Browse Our Full Collection
                    <svg
                      width="7"
                      height="11"
                      viewBox="0 0 7 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2.08984"
                        y="0.636719"
                        width="6.94219"
                        height="1.54271"
                        transform="rotate(45 2.08984 0.636719)"
                        fill="#6A0DAD"
                      />
                      <rect
                        x="7"
                        y="5.54492"
                        width="6.94219"
                        height="1.54271"
                        transform="rotate(135 7 5.54492)"
                        fill="#6A0DAD"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
