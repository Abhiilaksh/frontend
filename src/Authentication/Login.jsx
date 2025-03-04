import React from 'react'
import Template from './Template'
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Login() {
  return (
    <GoogleOAuthProvider clientId="258781223728-jvvqgo7nr72j3t4vt4vcgn1d13f317u7.apps.googleusercontent.com">
      <Template type={"login"} text1={"Don't have an account?"} text2={"Sign Up"} heading={"Login to"} />
    </GoogleOAuthProvider>
  )
}
