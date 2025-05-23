import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletKitProvider } from '@mysten/wallet-kit';
import './index.css';
import App from './App';
import '@suiet/wallet-kit/style.css';
import './suiet-wallet-kit-custom.css'; // You CSS file here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WalletKitProvider>
      <App />
    </WalletKitProvider>
  </React.StrictMode>
); 