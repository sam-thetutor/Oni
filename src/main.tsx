import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "./config/privy";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <PrivyProvider appId={privyConfig.appId} config={privyConfig.config}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PrivyProvider>
);
