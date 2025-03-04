import React from "react";
import Template from "./Template";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Signup() {
  return (
    <GoogleOAuthProvider clientId="258781223728-jvvqgo7nr72j3t4vt4vcgn1d13f317u7.apps.googleusercontent.com">
      <Template type={"signup"} text1={"Already have an account?"} text2={"Login"} heading={"Signup For"}/>
    </GoogleOAuthProvider>
  );
}
