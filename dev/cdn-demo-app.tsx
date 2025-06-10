import React, { useState, useEffect, useCallback } from 'react';
import { Vanta, ErrorBoundary } from '../src';
import { 
  preloadLibraries, 
  getPreloadStatus,
  loadVantaEffectFromCdn,
  getVantaLoadStatus,
  type VantaEffectName
} from '../src';

interface PerformanceInfo {
  memoryUsed: string;
  loadSource: string;
  libraryStatus: string;
  vantaStatus: string;
}

const CDN_DEMO_EFFECTS: VantaEffectName[] = ['waves', 'birds', 'net', 'clouds', 'fog'];

const CdnDemoApp: React.FC = () => {
  const [isLibrariesReady, setIsLibrariesReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('라이브러리 로딩 준비 중...');
  const [currentEffect, setCurrentEffect] = useState<VantaEffectName>('waves');
  const [performanceInfo, setPerformanceInfo] = useState<PerformanceInfo>({
    memoryUsed: '0 MB',
    loadSource: 'cdn',
    libraryStatus: 'loading',
    vantaStatus: 'not-loaded'
  });

  // 성능 정보 업데이트
  const updatePerformanceInfo = useCallback(() => {
    const status = getPreloadStatus();
    const vantaStatus = getVantaLoadStatus();
    
    let memoryUsed = '0 MB';
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
      const memory = (window.performance as any).memory;
      memoryUsed = `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`;
    }

    setPerformanceInfo({
      memoryUsed,
      loadSource: status.loadSource || 'cdn',
      libraryStatus: status.isPreloaded ? 'ready' : (status.isLoading ? 'loading' : 'error'),
      vantaStatus: `${vantaStatus.loadedCount} effects loaded`
    });
  }, []);

  // 라이브러리 로딩
  useEffect(() => {
    const loadLibrariesFromCdn = async () => {
      try {
        setLoadingMessage('CDN에서 THREE.js와 p5.js 로딩 중...');
        
        // CDN에서 라이브러리 로드
        await preloadLibraries();
        
        setLoadingMessage('Vanta waves 이펙트 로딩 중...');
        
        // 첫 번째 이펙트 로드
        await loadVantaEffectFromCdn('waves');
        
        setIsLibrariesReady(true);
        setLoadingMessage('모든 라이브러리 로딩 완료!');
        
        console.log('[CDN Demo] All libraries loaded successfully from CDN');
      } catch (error) {
        console.error('[CDN Demo] Failed to load libraries:', error);
        setLoadingMessage(`로딩 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    };

    loadLibrariesFromCdn();
  }, []);

  // 성능 모니터링
  useEffect(() => {
    updatePerformanceInfo();
    const interval = setInterval(updatePerformanceInfo, 2000);
    return () => clearInterval(interval);
  }, [updatePerformanceInfo]);

  // 이펙트 변경 핸들러
  const handleEffectChange = async (effectName: string) => {
    try {
      setLoadingMessage(`${effectName} 이펙트 로딩 중...`);
      await loadVantaEffectFromCdn(effectName as VantaEffectName);
      setCurrentEffect(effectName as VantaEffectName);
      setLoadingMessage('이펙트 로딩 완료!');
    } catch (error) {
      console.error(`Failed to load effect ${effectName}:`, error);
      setLoadingMessage(`이펙트 로딩 실패: ${effectName}`);
    }
  };

  if (!isLibrariesReady) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          fontSize: '24px', 
          marginBottom: '20px',
          color: '#333'
        }}>
          🌐 CDN 라이브러리 로딩 중...
        </div>
        <div style={{ 
          fontSize: '16px', 
          color: '#666',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          {loadingMessage}
        </div>
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          💡 CDN에서 로딩 실패 시 자동으로 로컬 파일로 폴백됩니다.
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <ErrorBoundary>
        <Vanta 
          effect={currentEffect}
          options={{
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            ...(currentEffect === 'waves' && {
              color: 0x3f6b7d,
              waveHeight: 20,
              waveSpeed: 1,
              zoom: 0.75
            }),
            ...(currentEffect === 'birds' && {
              backgroundColor: 0x3040a,
              color1: 0xff6347,
              color2: 0x1e90ff,
              birdSize: 1.0,
              wingSpan: 20.0,
              speedLimit: 4.0,
              separation: 20.0,
              alignment: 20.0,
              cohesion: 5.0
            }),
            ...(currentEffect === 'net' && {
              color: 0x3f6b7d,
              backgroundColor: 0x23153c,
              points: 8.0,
              maxDistance: 25.0,
              spacing: 20.0
            }),
            ...(currentEffect === 'clouds' && {
              backgroundColor: 0x3040a,
              skyColor: 0x68b8d7,
              cloudColor: 0xadc1de,
              speed: 1.2
            }),
            ...(currentEffect === 'fog' && {
              highlightColor: 0xff8a80,
              midtoneColor: 0xff5722,
              lowlightColor: 0x4a148c,
              baseColor: 0x212121,
              blurFactor: 0.6,
              speed: 2.0,
              zoom: 1.5
            })
          }}
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%',
            zIndex: 1
          }}
        />
      </ErrorBoundary>

      {/* 컨트롤 패널 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
          🌐 CDN Vanta React Demo
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="effect-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            이펙트 선택:
          </label>
          <select 
            id="effect-select"
            value={currentEffect} 
            onChange={(e) => handleEffectChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
          >
            {CDN_DEMO_EFFECTS.map(effect => (
              <option key={effect} value={effect}>
                {effect.charAt(0).toUpperCase() + effect.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          borderTop: '1px solid #eee',
          paddingTop: '10px'
        }}>
          <div><strong>📊 성능 정보:</strong></div>
          <div>메모리 사용량: {performanceInfo.memoryUsed}</div>
          <div>로드 소스: {performanceInfo.loadSource.toUpperCase()}</div>
          <div>라이브러리: {performanceInfo.libraryStatus}</div>
          <div>Vanta: {performanceInfo.vantaStatus}</div>
          <div style={{ marginTop: '10px', fontSize: '11px', fontStyle: 'italic' }}>
            💡 라이브러리가 CDN에서 로드되어 패키지 크기가 크게 감소했습니다.
          </div>
        </div>
      </div>

      {/* 상태 메시지 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '14px',
        zIndex: 10
      }}>
        {loadingMessage}
      </div>
    </div>
  );
};

export default CdnDemoApp;
