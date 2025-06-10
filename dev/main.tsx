import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DemoApp from './demo-app';
import { preloadLibraries, getPreloadStatus } from '../src/utils/preload-libraries';
import './style.css';

/**
 * 라이브러리 pre-loading을 포함한 앱 래퍼 컴포넌트
 * React 앱이 시작되기 전에 three.js와 p5.js를 미리 로드합니다.
 */
const AppWithPreload: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoadingMessage('Loading required libraries from CDN...');
        console.log('[Main] Starting CDN library preload process');
        
        await preloadLibraries();
        
        // 추가 검증
        const status = getPreloadStatus();
        if (!status.isPreloaded || !status.threeAvailable || !status.p5Available) {
          throw new Error('CDN libraries failed to load properly');
        }

        setLoadingMessage('CDN libraries loaded successfully!');
        console.log('[Main] CDN libraries preloaded successfully');
        
        // 약간의 지연을 두어 로딩 메시지를 보여주고 앱 시작
        setTimeout(() => {
          setIsReady(true);
        }, 500);
        
      } catch (err) {
        console.error('[Main] Failed to initialize libraries:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown initialization error';
        setError(errorMessage);
      }
    };

    initialize();
  }, []);

  // 에러 상태
  if (error) {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        color: '#dc3545',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }
    }, 
      React.createElement('h2', { 
        style: { marginBottom: '16px' } 
      }, '앱 초기화 실패'),
      React.createElement('p', { 
        style: { marginBottom: '20px', maxWidth: '500px' } 
      }, '라이브러리 로딩 중 오류가 발생했습니다:'),
      React.createElement('div', {
        style: {
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#721c24'
        }
      }, error),
      React.createElement('button', {
        onClick: () => window.location.reload(),
        style: {
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }
      }, '다시 시도')
    );
  }

  // 로딩 상태
  if (!isReady) {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        color: '#495057',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }
    },
      React.createElement('div', {
        style: {
          width: '50px',
          height: '50px',
          border: '4px solid #e9ecef',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }
      }),
      React.createElement('h2', { 
        style: { marginBottom: '8px' } 
      }, 'Vanta React'),
      React.createElement('p', { 
        style: { fontSize: '16px', marginBottom: '8px' } 
      }, loadingMessage),
      React.createElement('p', { 
        style: { fontSize: '14px', color: '#6c757d' } 
      }, 'Three.js와 p5.js를 로드하고 있습니다...'),
      React.createElement('style', {}, `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `)
    );
  }

  // 라이브러리 로딩 완료 후 메인 앱 렌더링
  return React.createElement(DemoApp);
};

ReactDOM.render(React.createElement(AppWithPreload), document.getElementById('root'));
