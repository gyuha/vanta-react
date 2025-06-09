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
  return process.env.NODE_ENV === 'development' || process.env.VANTA_PERFORMANCE_MONITORING === 'true';
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
  
  if (isPerformanceMonitoringEnabled()) {
    console.log('🚀 Vanta preloading performance monitoring started');
    console.log(`📊 Initial memory usage: ${(memoryBefore / 1024 / 1024).toFixed(2)} MB`);
  }
  
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
  
  if (isPerformanceMonitoringEnabled()) {
    console.log('✅ Vanta preloading performance monitoring completed');
    console.log(`⏱️  Total loading time: ${loadTime.toFixed(2)} ms`);
    console.log(`📈 Effects loaded: ${effectsLoaded}`);
    console.log(`🧠 Memory usage after: ${(memoryAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🎯 Average time per effect: ${(loadTime / Math.max(effectsLoaded, 1)).toFixed(2)} ms`);
    
    if (!success && errorMessage) {
      console.log(`❌ Error: ${errorMessage}`);
    }
  }
  
  return finalMetrics;
};

/**
 * 진행률을 로깅하는 함수
 */
export const logProgress = (loaded: number, total: number): void => {
  if (isPerformanceMonitoringEnabled()) {
    const percentage = (loaded / total * 100).toFixed(0);
    console.log(`📈 Preloading progress: ${loaded}/${total} (${percentage}%)`);
  }
};
