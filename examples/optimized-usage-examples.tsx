import React, { useState, useEffect } from 'react';
import { 
  Vanta, 
  VantaEffectName, 
  preloadVantaEffects, 
  useVantaEffect,
  useVantaPreloader 
} from 'vanta-react';

/**
 * 기본 동적 로딩 예제
 * 효과가 필요할 때만 로드됩니다.
 */
export const BasicDynamicExample: React.FC = () => {
  const [effect, setEffect] = useState<VantaEffectName>('net');
  const { isLoading, error, isLoaded } = useVantaEffect(effect);

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          padding: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: '8px'
        }}>
          Loading {effect} effect...
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          padding: '10px',
          background: 'rgba(255,0,0,0.8)',
          color: 'white',
          borderRadius: '4px',
          zIndex: 10
        }}>
          Error: {error}
        </div>
      )}

      {/* Vanta 컴포넌트 */}
      <Vanta
        effect={effect}
        options={{
          color: 0x3f7fb3,
          points: 8.0,
          maxDistance: 23.0,
          spacing: 17.0,
        }}
      />

      {/* 효과 선택 버튼들 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 10
      }}>
        <button 
          onClick={() => setEffect('net')}
          disabled={isLoading}
          style={{ marginRight: '10px' }}
        >
          Net
        </button>
        <button 
          onClick={() => setEffect('waves')}
          disabled={isLoading}
          style={{ marginRight: '10px' }}
        >
          Waves
        </button>
        <button 
          onClick={() => setEffect('birds')}
          disabled={isLoading}
        >
          Birds
        </button>
      </div>

      {/* 로딩 상태 표시 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10
      }}>
        Status: {isLoading ? 'Loading...' : isLoaded ? 'Loaded' : 'Ready'}
      </div>
    </div>
  );
};

/**
 * 프리로딩 예제
 * 여러 효과를 미리 로드하여 빠른 전환을 제공합니다.
 */
export const PreloadingExample: React.FC = () => {
  const [effect, setEffect] = useState<VantaEffectName>('net');
  const [enablePreload, setEnablePreload] = useState(false);
  
  // 프리로드할 효과들
  const effectsToPreload: VantaEffectName[] = ['net', 'waves', 'birds', 'cells'];
  
  const { 
    isPreloading, 
    preloadError, 
    loadedCount, 
    totalCount, 
    progress, 
    isComplete 
  } = useVantaPreloader(enablePreload ? effectsToPreload : []);

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      {/* 프리로딩 컨트롤 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 10,
        minWidth: '200px'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={enablePreload}
              onChange={(e) => setEnablePreload(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Enable Preloading
          </label>
        </div>
        
        {enablePreload && (
          <div>
            <div style={{ marginBottom: '5px' }}>
              Progress: {loadedCount}/{totalCount} ({progress.toFixed(0)}%)
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: isComplete ? '#4CAF50' : '#2196F3',
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isPreloading && <div style={{ fontSize: '12px', marginTop: '5px' }}>Loading...</div>}
            {preloadError && <div style={{ fontSize: '12px', color: '#ff6b6b', marginTop: '5px' }}>Error: {preloadError}</div>}
            {isComplete && <div style={{ fontSize: '12px', color: '#4CAF50', marginTop: '5px' }}>All effects loaded!</div>}
          </div>
        )}
      </div>

      {/* Vanta 컴포넌트 */}
      <Vanta
        effect={effect}
        background={false}
        options={{
          color: 0x8b5cf6,
          waveHeight: 25,
          waveSpeed: 1,
        }}
      />

      {/* 효과 선택 버튼들 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        gap: '10px'
      }}>
        {effectsToPreload.map((effectName) => (
          <button
            key={effectName}
            onClick={() => setEffect(effectName)}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              background: effect === effectName ? '#8b5cf6' : '#4a5568',
              color: 'white',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {effectName}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 조건부 로딩 예제
 * 특정 조건에서만 효과를 로드합니다.
 */
export const ConditionalLoadingExample: React.FC = () => {
  const [showEffect, setShowEffect] = useState(false);
  const [effect, setEffect] = useState<VantaEffectName>('clouds');

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      {/* 컨트롤 패널 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255,255,255,0.9)',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={() => setShowEffect(!showEffect)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: showEffect ? '#ef4444' : '#10b981',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {showEffect ? 'Hide Effect' : 'Show Effect'}
          </button>
        </div>
        
        {showEffect && (
          <div>
            <select
              value={effect}
              onChange={(e) => setEffect(e.target.value as VantaEffectName)}
              style={{
                width: '100%',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              <option value="clouds">Clouds</option>
              <option value="fog">Fog</option>
              <option value="topology">Topology</option>
              <option value="rings">Rings</option>
            </select>
          </div>
        )}
      </div>

      {/* 조건부 Vanta 컴포넌트 */}
      {showEffect && (
        <Vanta
          effect={effect}
          options={{
            color: 0x6366f1,
            backgroundColor: 0x1f2937,
          }}
        />
      )}

      {/* 안내 텍스트 */}
      {!showEffect && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '18px'
        }}>
          <div>효과가 비활성화되었습니다</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            "Show Effect" 버튼을 클릭하여 동적으로 로드하세요
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 성능 모니터링 예제
 * 로딩 시간과 메모리 사용량을 추적합니다.
 */
export const PerformanceMonitoringExample: React.FC = () => {
  const [effect, setEffect] = useState<VantaEffectName>('net');
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    // 효과 로딩 시간 측정
    const measureLoadTime = () => {
      const endTime = performance.now();
      setLoadTime(endTime - startTime);
    };

    // 메모리 정보 가져오기 (Chrome에서만 사용 가능)
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    const timer = setTimeout(() => {
      measureLoadTime();
      updateMemoryInfo();
    }, 1000);

    return () => clearTimeout(timer);
  }, [effect]);

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      {/* 성능 정보 패널 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 10,
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          Performance Monitor
        </div>
        <div>Effect: {effect}</div>
        {loadTime && <div>Load Time: {loadTime.toFixed(2)}ms</div>}
        {memoryInfo && (
          <div style={{ marginTop: '8px' }}>
            <div>Used JS Heap: {(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB</div>
            <div>Total JS Heap: {(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(1)}MB</div>
          </div>
        )}
      </div>

      {/* Vanta 컴포넌트 */}
      <Vanta
        effect={effect}
        options={{
          color: 0xff6b6b,
          points: 15,
          maxDistance: 30,
        }}
      />

      {/* 효과 변경 버튼들 */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}>
        {['net', 'dots', 'waves', 'cells'].map((effectName) => (
          <button
            key={effectName}
            onClick={() => {
              setLoadTime(null);
              setEffect(effectName as VantaEffectName);
            }}
            style={{
              margin: '0 5px',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: effect === effectName ? '#ff6b6b' : '#64748b',
              color: 'white',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {effectName}
          </button>
        ))}
      </div>
    </div>
  );
};
