import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import { msalConfig } from './config/msalConfig';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
// import { PublicClientApplication } from '@azure/msal-browser';
const msalInstance = new PublicClientApplication(msalConfig);
const startApp = async () => {
    // await initializeMsal();
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <MsalProvider instance={msalInstance}>
            <Provider store={store}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Provider>
        </MsalProvider>
    );
};

startApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();