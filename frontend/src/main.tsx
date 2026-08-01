import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster 
      theme="dark" 
      position="top-right" 
      toastOptions={{
        style: {
          background: '#0f172a',
          border: '1px solid #334155',
          color: '#f8fafc',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px'
        }
      }}
    />
  </StrictMode>,
);