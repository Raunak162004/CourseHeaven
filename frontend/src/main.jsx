import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Rc5tqRN9wnEM40G6o0nDAGwHZP9RffRf94V0B3bMSh9s7D0W0npVL10YICsbK4d62wYCri2HNq6LZYFqRvENz3d00sWX1o5oi"
);

createRoot(document.getElementById("root")).render(
  <Elements
    stripe={stripePromise}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
