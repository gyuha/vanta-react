import React, { useState, useEffect } from 'react';
import { 
  Vanta, 
  type VantaEffectName, 
  useVantaEffect, 
  getAvailableEffects,
  getCachedEffects 
} from '../src';

const effectOptions = [
  'birds',
  'cells',
  'clouds',
  'clouds2',
  'fog',
  'globe',
  'net',
  'rings',
  'halo',
  'ripple',
  'dots',
  'topology',
  'trunk',
  'waves',
] as const;

const DemoApp: React.FC = () => {
  const [currentEffect, setCurrentEffect] = useState<VantaEffectName>('net');
  const [backgroundMode, setBackgroundMode] = useState<boolean>(true);
  const [showPerformanceInfo, setShowPerformanceInfo] = useState<boolean>(false);

  // 효과 로딩 상태 추적
  const { isLoading, error, isLoaded } = useVantaEffect(currentEffect);

  // 성능 정보 업데이트
  const [performanceInfo, setPerformanceInfo] = useState({
    availableEffects: 0,
    cachedEffects: 0,
    loadTime: 0,
  });

  useEffect(() => {
    const updatePerformanceInfo = () => {
      setPerformanceInfo({
        availableEffects: getAvailableEffects().length,
        cachedEffects: getCachedEffects().length,
        loadTime: performance.now(),
      });
    };

    updatePerformanceInfo();
    const interval = setInterval(updatePerformanceInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Vanta 컴포넌트 */}
      <Vanta
        effect={currentEffect}
        background={backgroundMode}
        options={{
          color: 0x3f7fb3,
          points: 8.00,
          maxDistance: 23.00,
          spacing: 17.00,
        }}
      />

      {/* 컨트롤 패널 */}
      <div className="relative z-10 p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Vanta React Demo (Optimized)
          </h1>

          <div className="space-y-4">
            {/* 효과 선택 */}
            <div>
              <label htmlFor="effect-select" className="block text-sm font-medium text-gray-700 mb-2">
                Effect
              </label>
              <select
                id="effect-select"
                value={currentEffect}
                onChange={(e) => setCurrentEffect(e.target.value as VantaEffectName)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isLoading}
              >
                {effectOptions.map((effect) => (
                  <option key={effect} value={effect}>
                    {effect.charAt(0).toUpperCase() + effect.slice(1)}
                  </option>
                ))}
              </select>
              {isLoading && (
                <div className="text-xs text-blue-600 mt-1">
                  🔄 Loading {currentEffect} effect...
                </div>
              )}
              {error && (
                <div className="text-xs text-red-600 mt-1">
                  ❌ Error: {error}
                </div>
              )}
              {isLoaded && !isLoading && (
                <div className="text-xs text-green-600 mt-1">
                  ✅ {currentEffect} loaded successfully
                </div>
              )}
            </div>

            {/* 배경 모드 토글 */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={backgroundMode}
                  onChange={(e) => setBackgroundMode(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-sm font-medium text-gray-700">
                  Full Screen Background
                </span>
              </label>
            </div>

            {/* 성능 정보 토글 */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showPerformanceInfo}
                  onChange={(e) => setShowPerformanceInfo(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show Performance Info
                </span>
              </label>
              
              {showPerformanceInfo && (
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs space-y-1">
                  <div><strong>Available Effects:</strong> {performanceInfo.availableEffects}</div>
                  <div><strong>Cached Effects:</strong> {performanceInfo.cachedEffects}</div>
                  <div><strong>Current Effect:</strong> {currentEffect} {isLoaded ? '✅' : '⏳'}</div>
                  <div><strong>Cached List:</strong> {getCachedEffects().join(', ') || 'None cached'}</div>
                  <div className="text-gray-500 text-xs mt-2">
                    💡 Switch between effects to see dynamic loading in action!
                  </div>
                </div>
              )}
            </div>

            {/* 정보 */}
            <div className="text-sm text-gray-600 mt-4">
              <p>Current Effect: <strong>{currentEffect}</strong></p>
              <p>Background Mode: <strong>{backgroundMode ? 'Full Screen' : 'Container'}</strong></p>
            </div>
          </div>
        </div>

        {/* 일반 모드일 때 컨테이너 */}
        {!backgroundMode && (
          <div className="mt-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Container Mode Example
              </h2>
              <div className="w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
                <Vanta
                  effect={currentEffect}
                  background={false}
                  className="rounded-lg"
                  options={{
                    color: 0x8b5cf6,
                    points: 6.00,
                    maxDistance: 20.00,
                    spacing: 15.00,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                이 모드에서는 Vanta가 컨테이너 내부에서만 렌더링됩니다.
              </p>
            </div>
          </div>
        )}

        {/* 성능 팁 */}
        <div className="mt-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">🚀 Performance Tips</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Effects are loaded dynamically - only when needed!</li>
              <li>• Use preloading for effects you know will be used</li>
              <li>• Cached effects switch instantly without loading</li>
              <li>• Total bundle size: ~22KB core + ~15-35KB per effect</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoApp;
