import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./providers/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import AuthProvider from "./providers/AuthProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ReactQueryProvider>
  
        <AuthProvider>
        <BrowserRouter>
          <ThemeProvider>
            <Toaster />
            <App />
          </ThemeProvider>
          </BrowserRouter>
        </AuthProvider>
  
    </ReactQueryProvider>
  </StrictMode>
);
