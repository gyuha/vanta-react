/**
 * CDN에서 라이브러리를 미리 로드하는 유틸리티
 * React 라이프사이클 충돌을 방지하고 안정적인 라이브러리 초기화를 제공합니다.
 * CDN 전용으로 최적화되었습니다.
 */

import { loadCdnThree, loadCdnP5 } from './cdn-library-loader';

// 전역 상태 관리
let librariesPreloaded = false;
let preloadPromise: Promise<void> | null = null;
let preloadError: Error | null = null;

/**
 * three.js와 p5.js를 CDN에서 앱 시작 시점에 미리 로드합니다.
 * 중복 호출을 방지하고 Promise 기반 동기화를 제공합니다.
 * React 19 호환성을 위해 개선되었습니다.
 */
export const preloadLibraries = async (): Promise<void> => {
  // 이미 로드가 완료되었다면 즉시 반환
  if (librariesPreloaded) {
    return Promise.resolve();
  }

  // 이미 로딩 중이라면 기존 Promise를 반환
  if (preloadPromise) {
    return preloadPromise;
  }

  // 이전에 발생한 에러가 있다면 다시 시도
  if (preloadError) {
    preloadError = null;
  }

  // 새로운 로딩 프로세스 시작
  preloadPromise = (async () => {
    try {
      console.log('[Preload] Starting library preload from CDN...');
      
      // React 19에서 더 안전한 병렬 로딩
      const loadingPromises = [
        loadCdnThree().catch(error => {
          console.error('[Preload] THREE.js loading failed:', error);
          throw new Error(`Failed to load THREE.js: ${error.message}`);
        }),
        loadCdnP5().catch(error => {
          console.error('[Preload] p5.js loading failed:', error);
          throw new Error(`Failed to load p5.js: ${error.message}`);
        })
      ];
      
      const [THREE, p5] = await Promise.all(loadingPromises);

      // 전역 객체에 라이브러리 할당 (안전성을 위해 명시적 확인)
      if (THREE && typeof window !== 'undefined') {
        (window as any).THREE = THREE;
        console.log('[Preload] THREE.js assigned to global window');
      } else {
        throw new Error('Failed to load THREE.js properly from CDN');
      }

      if (p5 && typeof window !== 'undefined') {
        (window as any).p5 = p5;
        console.log('[Preload] p5.js assigned to global window');
      } else {
        throw new Error('Failed to load p5.js properly from CDN');
      }

      // React 19에서 상태 업데이트 검증
      if (typeof window !== 'undefined' && (window as any).THREE && (window as any).p5) {
        librariesPreloaded = true;
        console.log('[Preload] Libraries preloaded successfully from CDN');
      } else {
        throw new Error('Library assignment verification failed');
      }
      
    } catch (error) {
      preloadError = error instanceof Error ? error : new Error('Unknown CDN preload error');
      console.error('[Preload] Failed to preload libraries from CDN:', preloadError);
      throw preloadError;
    }
  })();

  return preloadPromise;
};

/**
 * 라이브러리가 준비되었는지 확인하는 함수
 * @returns 모든 라이브러리가 로드되고 전역에서 사용 가능한지 여부
 */
export const areLibrariesReady = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return librariesPreloaded && 
         !!(window as any).THREE && 
         !!(window as any).p5;
};

/**
 * 전역 객체에서 라이브러리를 안전하게 가져오는 함수들
 */
export const getPreloadedThree = () => {
  if (typeof window === 'undefined' || !(window as any).THREE) {
    throw new Error('THREE.js is not preloaded from CDN. Call preloadLibraries() first.');
  }
  return (window as any).THREE;
};

export const getPreloadedP5 = () => {
  if (typeof window === 'undefined' || !(window as any).p5) {
    throw new Error('p5.js is not preloaded from CDN. Call preloadLibraries() first.');
  }
  return (window as any).p5;
};

/**
 * 라이브러리 로드 상태 정보를 반환하는 함수
 */
export const getPreloadStatus = () => ({
  isPreloaded: librariesPreloaded,
  isLoading: !!preloadPromise && !librariesPreloaded,
  hasError: !!preloadError,
  error: preloadError?.message || null,
  threeAvailable: !!(typeof window !== 'undefined' && (window as any).THREE),
  p5Available: !!(typeof window !== 'undefined' && (window as any).p5),
  loadSource: 'CDN' as const
});

/**
 * 프리로드 상태를 초기화하는 함수 (테스트나 재시작 용도)
 */
export const resetPreloadState = () => {
  librariesPreloaded = false;
  preloadPromise = null;
  preloadError = null;
  
  if (typeof window !== 'undefined') {
    (window as any).THREE = undefined;
    (window as any).p5 = undefined;
  }
  
  console.log('[Preload] Preload state reset');
};
