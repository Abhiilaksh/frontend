import React from "react";
import Template from "./Template";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Signup() {
  return (
    <GoogleOAuthProvider 
      clientId={`${import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}`}>

      <Template 
        type={"signup"} 
        text1={"Already have an account?"} 
        text2={"Login"} 
        heading={"Signup For"}
      />
    
    </GoogleOAuthProvider>
  );
}
