import React from 'react';
import { createRoot } from 'react-dom/client';
import CdnDemoApp from './dev/cdn-demo-app';
import './dev/style.css';

// CDN 기반 React 앱 초기화
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

// CDN 데모 앱 렌더링
console.log('[CDN Demo] Starting CDN-based Vanta React demo...');
root.render(React.createElement(CdnDemoApp));
