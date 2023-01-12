import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from './App';
import AppContextWrapper from './AppContext';
import './index.css';
import { store } from "./redux/store";


const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = "699056548809-gb05se6qfhjkas89tojqv0h5j5smcmd2.apps.googleusercontent.com";
root.render(
  <Provider store={store}>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={clientId}>
      <AppContextWrapper>
       <App />
      </AppContextWrapper>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </Provider>
);


