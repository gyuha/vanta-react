// 메인 컴포넌트 export
export { default as Vanta } from './components/vanta';

// 에러 바운더리 컴포넌트 export
export { default as ErrorBoundary } from './components/error-boundary';

// 타입 정의 export
export * from './types';

// 유틸리티 함수 export
export {
  loadVantaEffect,
  getAvailableEffects,
  getCachedEffects,
  clearEffectCache,
} from './utils/vanta-loader';

// 라이브러리 pre-loading 함수 export
export {
  preloadLibraries,
  areLibrariesReady,
  getPreloadedThree,
  getPreloadedP5,
  getPreloadStatus,
  resetPreloadState,
} from './utils/preload-libraries';

// 성능 모니터링 함수 export (개발 모드에서 사용)
export {
  isPerformanceMonitoringEnabled,
  getMemoryUsage,
  startPerformanceMonitoring,
  finishPerformanceMonitoring,
  logProgress,
  type PerformanceMetrics,
} from './utils/performance-monitor';

// 커스텀 훅 export
export {
  useVantaEffect,
} from './hooks/use-vanta';
