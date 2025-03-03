import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AdminContextProvider from "./context/AdminContext.jsx";
import ServCenterContextProvider from "./context/ServCenterContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <ServCenterContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ServCenterContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
