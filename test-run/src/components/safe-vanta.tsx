import React, { useEffect, useState, useRef } from 'react';
import { Vanta, areLibrariesReady } from 'vanta-react';
import type { VantaProps } from 'vanta-react';

interface SafeVantaProps extends VantaProps {
  fallback?: React.ReactNode;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * React 19 호환성을 개선한 안전한 Vanta 래퍼 컴포넌트
 * - 중복 초기화 방지
 * - 자동 재시도 메커니즘
 * - 향상된 에러 처리
 */
const SafeVanta: React.FC<SafeVantaProps> = ({
  fallback = <div>Loading Vanta effect...</div>,
  retryCount = 3,
  retryDelay = 1000,
  ...vantaProps
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const retryRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    // React 19 StrictMode 대응 - 중복 실행 방지
    if (initRef.current) return;
    initRef.current = true;
    const checkLibraries = () => {
      if (areLibrariesReady()) {
        setIsReady(true);
        setError(null);
        return;
      }

      if (retryRef.current < retryCount) {
        retryRef.current++;
        console.log(`[SafeVanta] Libraries not ready, retrying... (${retryRef.current}/${retryCount})`);
        
        timeoutRef.current = setTimeout(checkLibraries, retryDelay);
      } else {
        setError('Failed to load Vanta libraries after multiple attempts');
      }
    };

    checkLibraries();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [retryCount, retryDelay]);

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'red', 
        textAlign: 'center',
        backgroundColor: '#fff1f0',
        border: '1px solid #ffccc7',
        borderRadius: '4px'
      }}>
        <h3>Vanta Effect Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            retryRef.current = 0;
            initRef.current = false;
            setIsReady(false);
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <Vanta {...vantaProps} />;
};

export default SafeVanta;
