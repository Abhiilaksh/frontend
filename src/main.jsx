import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Rootreducer from './reducer/index.js'
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer:Rootreducer,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)