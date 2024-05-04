import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';
import { CantoTesnet } from "@thirdweb-dev/chains";

const root = ReactDOM.createRoot(document.getElementById('root'));

const clientId = import.meta.env.VITE_NEXT_PUBLIC_CLIENT_ID.toString();

root.render(
  <ThirdwebProvider activeChain = {CantoTesnet}
  clientId={clientId}> 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)