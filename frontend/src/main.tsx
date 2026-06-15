import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.tsx";

createRoot(
document.getElementById("root")!
).render( <StrictMode> <GoogleOAuthProvider
   clientId="923952499756-lsfht6clutmt9l0ka28uprndqp356n99.apps.googleusercontent.com"
 > <App /> </GoogleOAuthProvider> </StrictMode>
);
