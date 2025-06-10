import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Vanta, 
  type VantaEffectName, 
  useVantaEffect, 
  getAvailableEffects,
  getCachedEffects,
  isPerformanceMonitoringEnabled,
  getMemoryUsage 
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

// 각 효과별 기본 옵션 정의
const getEffectOptions = (effect: VantaEffectName) => {
  const baseOptions = {
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
  };

  switch (effect) {
    case 'birds':
      return {
        ...baseOptions,
        backgroundColor: 0x000000, // 더 어두운 배경으로 새들이 잘 보이도록
        backgroundAlpha: 1,
        color1: 0xff0000,
        color2: 0x00d1ff,
        colorMode: 'varianceGradient',
        birdSize: 1.5, // 새 크기를 약간 키움
        wingSpan: 25,   // wingSpan을 약간 줄임
        speedLimit: 4,  // 속도를 약간 줄임
        separation: 15, // 분리 거리를 줄임
        alignment: 15,  // 정렬을 줄임
        cohesion: 15,   // 응집력을 줄임
        quantity: 3,    // 새의 수를 늘림
      };
    case 'cells':
      return {
        ...baseOptions,
        color1: 0x3f7fb3,
        color2: 0x1e3a8a,
        size: 1.5,
        speed: 1,
      };
    case 'clouds':
      return {
        ...baseOptions,
        backgroundColor: 0x87CEEB,
        skyColor: 0x87CEEB,
        cloudColor: 0xffffff,
        cloudShadowColor: 0x183550,
        sunColor: 0xffffff,
        sunGlareColor: 0xffffff,
        sunlightColor: 0xffffff,
        speed: 1,
      };
    case 'clouds2':
      return {
        ...baseOptions,
        backgroundColor: 0x87CEEB,
        skyColor: 0x87CEEB,
        cloudColor: 0xffffff,
        lightColor: 0xffffff,
        speed: 1,
      };
    case 'fog':
      return {
        ...baseOptions,
        highlightColor: 0xff8a80,
        midtoneColor: 0xff5722,
        lowlightColor: 0xffccbc,
        baseColor: 0xffcc02,
        blurFactor: 0.6,
        zoom: 1,
        speed: 1.2,
      };
    case 'globe':
      return {
        ...baseOptions,
        backgroundColor: 0x222426,
        color: 0x3f7fb3,
        color2: 0x1e3a8a,
        size: 1,
      };
    case 'net':
      return {
        ...baseOptions,
        color: 0x3f7fb3,
        backgroundColor: 0x222426,
        points: 8,
        maxDistance: 23,
        spacing: 17,
        showDots: true,
      };
    case 'rings':
      return {
        ...baseOptions,
        color: 0x3f7fb3,
        backgroundColor: 0x222426,
        backgroundAlpha: 1,
      };
    case 'halo':
      return {
        ...baseOptions,
        backgroundColor: 0x000814,
        baseColor: 0x3f7fb3,
        size: 1.2,
        amplitudeFactor: 1,
        xOffset: 0,
        yOffset: 0,
      };
    case 'ripple':
      return {
        ...baseOptions,
        color1: 0x3f7fb3,
        color2: 0x1e3a8a,
      };
    case 'dots':
      return {
        ...baseOptions,
        backgroundColor: 0x222426,
        color: 0x3f7fb3,
        color2: 0x1e3a8a,
        size: 2,
        spacing: 30,
      };
    case 'topology':
      return {
        ...baseOptions,
        backgroundColor: 0x222426,
        color: 0x3f7fb3,
      };
    case 'trunk':
      return {
        ...baseOptions,
        color: 0x98465f,
        backgroundColor: 0x222426,
        spacing: 0,
        chaos: 1,
      };
    case 'waves':
      return {
        ...baseOptions,
        color: 0x3f7fb3,
        shininess: 30,
        waveHeight: 15,
        waveSpeed: 1,
        zoom: 0.75,
      };
    default:
      return {
        ...baseOptions,
        color: 0x3f7fb3,
      };
  }
};

const DemoApp: React.FC = () => {
  const [currentEffect, setCurrentEffect] = useState<VantaEffectName>('birds');
  const [backgroundMode, setBackgroundMode] = useState<boolean>(true);
  const [showPerformanceInfo, setShowPerformanceInfo] = useState<boolean>(false);

  // 효과 로딩 상태 추적
  const { isLoading, error, isLoaded } = useVantaEffect(currentEffect);

  // getEffectOptions 함수를 useCallback으로 메모이제이션
  const memoizedGetEffectOptions = useCallback((effect: VantaEffectName) => {
    return getEffectOptions(effect);
  }, []);

  // 현재 효과의 옵션을 useMemo로 메모이제이션
  const currentEffectOptions = useMemo(() => {
    return memoizedGetEffectOptions(currentEffect);
  }, [currentEffect, memoizedGetEffectOptions]);

  // 성능 정보 업데이트
  const [performanceInfo, setPerformanceInfo] = useState({
    availableEffects: 0,
    cachedEffects: 0,
    loadTime: 0,
    memoryUsage: 0,
    performanceMonitoringEnabled: false,
  });

  useEffect(() => {
    const updatePerformanceInfo = () => {
      setPerformanceInfo({
        availableEffects: getAvailableEffects().length,
        cachedEffects: getCachedEffects().length,
        loadTime: performance.now(),
        memoryUsage: getMemoryUsage(),
        performanceMonitoringEnabled: isPerformanceMonitoringEnabled(),
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
        options={currentEffectOptions}
      />

      {/* 컨트롤 패널 */}
      <div className="relative z-10 p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Vanta React Demo
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
                  Loading {currentEffect} effect...
                </div>
              )}
              {error && (
                <div className="text-xs text-red-600 mt-1">
                  Error: {error}
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
                  <div><strong>Current Effect:</strong> {currentEffect} {isLoaded ? '✓' : '⏳'}</div>
                  <div><strong>Cache Status:</strong> {getCachedEffects().join(', ') || 'None cached'}</div>
                  {performanceInfo.memoryUsage > 0 && (
                    <div><strong>Memory Usage:</strong> {(performanceInfo.memoryUsage / 1024 / 1024).toFixed(2)} MB</div>
                  )}
                  <div><strong>Performance Monitoring:</strong> {performanceInfo.performanceMonitoringEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
                  <div className="text-gray-500 text-xs mt-2">
                    💡 Performance monitoring is active in development mode
                  </div>
                </div>
              )}
            </div>

            {/* 정보 */}
            <div className="text-sm text-gray-600 mt-4">
              <p>Current Effect: <strong>{currentEffect}</strong></p>
              <p>Background Mode: <strong>{backgroundMode ? 'On' : 'Off'}</strong></p>
              
              {/* 원본 테스트 링크 추가 */}
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-700 font-medium mb-1">원본 테스트 링크:</p>
                <a 
                  href={`https://www.vantajs.com/?effect=${currentEffect}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                >
                  https://www.vantajs.com/?effect={currentEffect}
                </a>
              </div>
              
              {showPerformanceInfo && (
                <div className="mt-4">
                  <p>Available Effects: <strong>{performanceInfo.availableEffects}</strong></p>
                  <p>Cached Effects: <strong>{performanceInfo.cachedEffects}</strong></p>
                  <p>Load Time: <strong>{performanceInfo.loadTime.toFixed(2)} ms</strong></p>
                </div>
              )}
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
                  options={currentEffectOptions}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                이 모드에서는 Vanta가 컨테이너 내부에서만 렌더링됩니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoApp;
