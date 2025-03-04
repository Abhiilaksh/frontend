import React from 'react'
import Template from './Template'
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}`}>
      <Template type={"login"} text1={"Don't have an account?"} text2={"Sign Up"} heading={"Login to"} />
    </GoogleOAuthProvider>
  )
}
