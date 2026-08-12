import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/system/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <Toaster
      theme="dark"
      position="top-right"
      toastOptions={{
        style: {
          background: '#0b1220',
          border: '1px solid #334155',
          color: '#f8fafc',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
      }}
    />
  </StrictMode>
);
