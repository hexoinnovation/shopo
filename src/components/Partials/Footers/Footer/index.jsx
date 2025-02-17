import { Link } from "react-router-dom";
import Facebook from "../../../Helpers/icons/Facebook";
import Instagram from "../../../Helpers/icons/Instagram";
import Youtube from "../../../Helpers/icons/Youtube";

export default function Footer({ type }) {
  return (
    <footer className="footer-section-wrapper bg-purple-800 print:hidden py-4">
      <div className="container-x block mx-auto pt-[8px]">
        <div className="w-full flex flex-col items-center mb-[30px]">
          {/* logo area */}
          <div className="mb-[20px]">
            {type === 3 ? (
              <Link to="/">
                <img
                  width="152"
                  height="36"
                  src={`${
                    import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/logo-3.svg`}
                  alt="logo"
                />
              </Link>
            ) : (
              <Link to="/">
                <img
                  width="152"
                  height="36"
                  src={`${
                    import.meta.env.VITE_PUBLIC_URL
                  }/assets/images/logo.svg`}
                  alt="logo"
                />
              </Link>
            )}
          </div>
          <div className="w-full h-[1px] bg-yellow-400"></div>
        </div>
        <div className="lg:flex justify-between mb-[30px]">
          <div className="lg:w-[424px] ml-0 w-full mb-8 lg:mb-0">
            <h1 className="text-[16px] font-500 text-yellow-400 mb-4">
              About Us
            </h1>
            <p className="text-yellow-200 text-[14px] w-[290px] leading-[24px]">
            We envision a world where businesses of all sizes can leverage 
            the power of technology to achieve their full potential. 
            Our goal is to be the IT partner that drives your business forward, 
            providing the expertise and support you need to succeed.
            </p>
          </div>
          <div className="flex-1 lg:flex">
            <div className="lg:w-1/3 w-full mb-8 lg:mb-0">
              <div className="mb-4">
                <h6 className="text-[16px] font-500 text-yellow-400">
                  Features
                </h6>
              </div>
              <div>
                <ul className="flex flex-col space-y-3">
                  <li>
                    <Link to="/about">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        About Us
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-condition">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        Terms & Conditions
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/all-products">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        Best Products
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/3 w-full mb-8 lg:mb-0">
              <div className="mb-4">
                <h6 className="text-[16px] font-500 text-yellow-400">
                  General Links
                </h6>
              </div>
              <div>
                <ul className="flex flex-col space-y-3">
                  <li>
                    <Link to="/blogs">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        Blog
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/tracking-order">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        Track Order
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/become-seller">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        Become a Seller
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/3 w-full mb-8 lg:mb-0">
              <div className="mb-4">
                <h6 className="text-[16px] font-500 text-yellow-400">
                  Helpful
                </h6>
              </div>
              <div>
                <ul className="flex flex-col space-y-3">
                  <li>
                    <Link to="/flash-sale">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        Flash Sale
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        FAQ
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/support">
                      <span className="text-yellow-200 text-[14px] hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 cursor-pointer capitalize">
                        Support
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-bar border-t border-yellow-400 lg:h-[60px] lg:flex justify-between items-center">
          <div className="flex lg:space-x-5 justify-between items-center mb-3">
            <div className="flex space-x-5 items-center">
              <a href=" https://www.instagram.com/hexoinnovation/#">
                <Instagram className="fill-current text-yellow-200 hover:text-yellow-400" />
              </a>
              <a href="https://www.facebook.com/people/Hexo-Innovation/61556658466330/?mibextid=qi2Omg&rdid=drGh7rn336b0PPTf&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FReFmZkbJu2NCFPeR%2F%3Fmibextid%3Dqi2Omg">
                <Facebook className="fill-current text-yellow-200 hover:text-yellow-400" />
              </a>
              <a href="https://www.linkedin.com/company/hexo-innovation/posts/?feedView=all">
                <Youtube className="fill-current text-yellow-200 hover:text-yellow-400" />
              </a>
            </div>
            <span className="sm:text-base text-[10px] text-yellow-200 font-300">
              ©2025
              <a
                href="https://quomodosoft.com/"
                target="_blank"
                rel="noreferrer"
                className="font-500 text-yellow-400 mx-1"
              >
               Hexo Innovation
              </a>
              All rights reserved.
            </span>
          </div>
          <div>
            <a href="#">
              <img
                width="318"
                height="28"
                src={`${
                  import.meta.env.VITE_PUBLIC_URL
                }/assets/images/payment-getways.png`}
                alt="payment-getways"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
