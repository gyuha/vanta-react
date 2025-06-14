/**
 * 성능 모니터링을 위한 유틸리티 함수들
 * 개발 모드에서만 활성화되며, preloading 성능 추적을 지원합니다.
 */

export interface PerformanceMetrics {
  /** 로딩 시작 시간 (milliseconds) */
  startTime: number;
  /** 로딩 완료 시간 (milliseconds) */
  endTime?: number;
  /** 총 로딩 시간 (milliseconds) */
  loadTime?: number;
  /** 로딩 시작 전 메모리 사용량 (bytes) */
  memoryBefore?: number;
  /** 로딩 완료 후 메모리 사용량 (bytes) */
  memoryAfter?: number;
  /** 메모리 증가량 (bytes) */
  memoryIncrease?: number;
  /** 로드된 효과 개수 */
  effectsLoaded: number;
  /** 로딩 성공 여부 */
  success: boolean;
  /** 에러 메시지 (실패한 경우) */
  errorMessage?: string;
}

/**
 * 성능 모니터링이 활성화되어 있는지 확인하는 함수
 */
export const isPerformanceMonitoringEnabled = (): boolean => {
  try {
    return (typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
           ((globalThis as any).process?.env?.VANTA_PERFORMANCE_MONITORING === 'true');
  } catch {
    return false;
  }
};

/**
 * 메모리 사용량을 측정하는 함수
 */
export const getMemoryUsage = (): number => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
    return (window.performance as any).memory.usedJSHeapSize;
  }
  return 0;
};

/**
 * 성능 모니터링을 시작하는 함수
 */
export const startPerformanceMonitoring = (): PerformanceMetrics => {
  const startTime = performance.now();
  const memoryBefore = getMemoryUsage();
  
  return {
    startTime,
    memoryBefore,
    effectsLoaded: 0,
    success: false,
  };
};

/**
 * 성능 모니터링을 완료하는 함수
 */
export const finishPerformanceMonitoring = (
  metrics: PerformanceMetrics,
  effectsLoaded: number,
  success: boolean,
  errorMessage?: string
): PerformanceMetrics => {
  const endTime = performance.now();
  const loadTime = endTime - metrics.startTime;
  const memoryAfter = getMemoryUsage();
  const memoryIncrease = memoryAfter - (metrics.memoryBefore || 0);
  
  const finalMetrics: PerformanceMetrics = {
    ...metrics,
    endTime,
    loadTime,
    memoryAfter,
    memoryIncrease,
    effectsLoaded,
    success,
    errorMessage,
  };
  
  return finalMetrics;
};

/**
 * 진행률을 로깅하는 함수
 */
export const logProgress = (loaded: number, total: number): void => {
  // Progress tracking is available but no longer logs to console
};
