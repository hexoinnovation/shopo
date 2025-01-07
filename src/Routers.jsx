import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./components/About";
import AllProductPage from "./components/AllProductPage";
import Login from "./components/Auth/Login/index";
import Profile from "./components/Auth/Profile";
import Signup from "./components/Auth/Signup";
import BecomeSaller from "./components/BecomeSaller";
import Blogs from "./components/Blogs";
import Blog from "./components/Blogs/Blog.jsx";
import CardPage from "./components/CartPage";
import CheakoutPage from "./components/CheakoutPage";
import Contact from "./components/Contact";
import Faq from "./components/Faq";
import FlashSale from "./components/FlashSale";
import FourZeroFour from "./components/FourZeroFour";
import Home from "./components/Home";
import HomeTwo from "./components/HomeTwo";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ProductsCompaire from "./components/ProductsCompaire/index";
import SallerPage from "./components/SallerPage";
import Sallers from "./components/Sellers";
import SingleProductPage from "./components/SingleProductPage";
import TermsCondition from "./components/TermsCondition/index";
import TrackingOrder from "./components/TrackingOrder";
import Wishlist from "./components/Wishlist";
import HomeThree from "./components/HomeThree";
import HomeFour from "./components/HomeFour";
import HomeFive from "./components/HomeFive";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/home-two", element: <HomeTwo /> },
  { path: "/home-three", element: <HomeThree /> },
  { path: "/home-four", element: <HomeFour /> },
  { path: "/home-five", element: <HomeFive /> },
  { path: "/all-products", element: <AllProductPage /> },
  { path: "/single-product", element: <SingleProductPage /> },
  { path: "/cart", element: <CardPage /> },
  { path: "/checkout", element: <CheakoutPage /> },
  { path: "/wishlist", element: <Wishlist /> },
  { path: "/flash-sale", element: <FlashSale /> },
  { path: "/saller-page", element: <SallerPage /> },
  { path: "/products-compaire", element: <ProductsCompaire /> },
  { path: "/sallers", element: <Sallers /> },
  { path: "/about", element: <About /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/blogs/blog", element: <Blog /> },
  { path: "/tracking-order", element: <TrackingOrder /> },
  { path: "/contact", element: <Contact /> },
  { path: "/faq", element: <Faq /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/profile", element: <Profile /> },
  { path: "/become-saller", element: <BecomeSaller /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/terms-condition", element: <TermsCondition /> },
  { path: "*", element: <FourZeroFour /> },
]);

function Routers() {
  return <RouterProvider router={router} />;
}

export default Routers;
