
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

console.log('=== MAIN.TSX DEBUG ===');
console.log('main.tsx: Starting application');
console.log('main.tsx: App component:', App);
console.log('main.tsx: Document ready state:', document.readyState);
console.log('=== END MAIN DEBUG ===');

const rootElement = document.getElementById("root");
console.log('main.tsx: Root element found:', !!rootElement);

if (rootElement) {
  createRoot(rootElement).render(<App />);
  console.log('main.tsx: App rendered successfully');
} else {
  console.error('main.tsx: Root element not found!');
}
