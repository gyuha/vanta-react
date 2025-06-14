import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.tsx'

// React 16 호환성을 위한 렌더링
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Vanta 컴포넌트가 자동으로 라이브러리를 로드하므로 별도 preload 불필요
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
