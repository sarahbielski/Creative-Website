import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {loadModel} from './lib/model';
import './index.css';

// Start the bottle downloading before React has even mounted — it is the
// longest pole in the load and nothing about it depends on the tree.
loadModel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
