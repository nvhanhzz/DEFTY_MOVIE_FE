import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './shared/store';
import './config/i18n';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>
);