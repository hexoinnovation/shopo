import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'react-range-slider-input/dist/style.css';
import { registerSW } from "virtual:pwa-register";
if (import.meta.env.MODE === "production") {
  registerSW();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

AOS.init();
