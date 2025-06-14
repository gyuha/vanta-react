import './App.css'
import { useState, useEffect } from 'react';
import { Vanta, preloadLibraries } from 'vanta-react';

// 하위 호환성 테스트: 기존 manual preload 방식
function LegacyApp() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLibraries = async () => {
      try {
        // 기존 방식: 수동으로 라이브러리 preload
        await preloadLibraries();
        setIsReady(true);
        console.log('✅ Legacy preload completed');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('❌ Legacy preload failed:', errorMessage);
      }
    };

    initLibraries();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Legacy Mode - Error</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Legacy Mode - Loading</h1>
        <p>🔄 Manually preloading libraries...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Legacy Mode - Ready</h1>
      <p>✅ Libraries preloaded manually, autoLoad disabled</p>
      
      {/* 하위 호환성: autoLoad=false로 기존 동작 유지 */}
      <Vanta
        effect="birds"
        autoLoad={false}  // 자동 로딩 비활성화
        background={true}
        options={{
          backgroundColor: 0x000000,
          color1: 0xff6b6b,
          color2: 0x4ecdc4,
          birdSize: 1.5,
          wingSpan: 20,
          speedLimit: 5,
        }}
      />
    </div>
  );
}

export default LegacyApp;
