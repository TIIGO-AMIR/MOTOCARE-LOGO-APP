import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker so the app is installable on mobile phones via GitHub live link
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
