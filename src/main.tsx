import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Vercel Web Analytics: cookieless page-view counts (visitors per day,
        top pages, referrers). Page changes inside the app are tracked too. */}
    <Analytics />
  </StrictMode>,
);
