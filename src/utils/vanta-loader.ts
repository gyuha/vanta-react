import type { VantaCreator } from '../types';
// import { 
//   startPerformanceMonitoring, 
//   finishPerformanceMonitoring, 
//   logProgress,
//   type PerformanceMetrics 
// } from './performance-monitor';

// 동적 import를 위한 효과 모듈 매핑
const VANTA_EFFECT_MODULES: Record<string, () => Promise<{ default: VantaCreator }>> = {
  birds: () => import('vanta/dist/vanta.birds.min.js'),
  cells: () => import('vanta/dist/vanta.cells.min.js'),
  clouds: () => import('vanta/dist/vanta.clouds.min.js'),
  clouds2: () => import('vanta/dist/vanta.clouds2.min.js'),
  fog: () => import('vanta/dist/vanta.fog.min.js'),
  globe: () => import('vanta/dist/vanta.globe.min.js'),
  net: () => import('vanta/dist/vanta.net.min.js'),
  rings: () => import('vanta/dist/vanta.rings.min.js'),
  halo: () => import('vanta/dist/vanta.halo.min.js'),
  ripple: () => import('vanta/dist/vanta.ripple.min.js'),
  dots: () => import('vanta/dist/vanta.dots.min.js'),
  topology: () => import('vanta/dist/vanta.topology.min.js'),
  trunk: () => import('vanta/dist/vanta.trunk.min.js'),
  waves: () => import('vanta/dist/vanta.waves.min.js'),
};

// 로드된 효과들을 캐시하는 객체
const EFFECT_CACHE: Record<string, VantaCreator> = {};

// 로딩 상태를 추적하는 객체
const LOADING_STATE: Record<string, Promise<VantaCreator | null>> = {};

/**
 * 효과 모듈을 동적으로 로드하는 함수
 * 이미 로드된 효과는 캐시에서 반환하여 성능을 최적화합니다.
 * 동시에 같은 효과를 로드하려는 경우 중복 로딩을 방지합니다.
 */
export const loadVantaEffect = async (effectName: string): Promise<VantaCreator | null> => {
  const normalizedName = effectName.toLowerCase();
  
  // 캐시에서 확인
  if (EFFECT_CACHE[normalizedName]) {
    return EFFECT_CACHE[normalizedName];
  }
  
  // 이미 로딩 중인 경우 기존 Promise 반환
  if (normalizedName in LOADING_STATE) {
    return LOADING_STATE[normalizedName];
  }
  
  // 동적 import 함수 확인
  const importFunction = VANTA_EFFECT_MODULES[normalizedName];
  if (!importFunction) {
    console.error(`Vanta.js effect "${effectName}" is not available. Available effects:`, Object.keys(VANTA_EFFECT_MODULES));
    return null;
  }
  
  // 로딩 Promise 생성 및 저장
  const loadingPromise = (async () => {
    try {
      const module = await importFunction();
      const VantaCreator = module.default;
      
      // 캐시에 저장
      EFFECT_CACHE[normalizedName] = VantaCreator;
      
      // 로딩 상태에서 제거
      delete LOADING_STATE[normalizedName];
      
      return VantaCreator;
    } catch (error) {
      console.error(`Failed to load Vanta.js effect "${effectName}":`, error);
      
      // 로딩 상태에서 제거
      delete LOADING_STATE[normalizedName];
      
      return null;
    }
  })();
  
  LOADING_STATE[normalizedName] = loadingPromise;
  
  return loadingPromise;
};

// /**
//  * 여러 효과를 미리 로드하는 함수 (프리로딩)
//  * 순차적 로딩을 통해 브라우저 응답성을 보장하고 취소 기능을 제공합니다.
//  * 
//  * @deprecated 프리로딩 기능이 제거되었습니다.
//  */
// export const preloadVantaEffects = async (
//   effectNames: string[],
//   options?: PreloadOptions
// ): Promise<void> => {
//   const { signal, onProgress, delayBetweenLoads = 100 } = options || {};
  
//   // 성능 모니터링 시작
//   const performanceMetrics = startPerformanceMonitoring();
//   let effectsLoaded = 0;
  
//   try {
//     for (let i = 0; i < effectNames.length; i++) {
//       // AbortSignal을 통한 취소 확인
//       if (signal?.aborted) {
//         const abortError = new Error('Preloading cancelled');
//         abortError.name = 'AbortError';
//         throw abortError;
//       }
      
//       try {
//         // 효과를 순차적으로 로드
//         await loadVantaEffect(effectNames[i]);
//         effectsLoaded++;
        
//         // 진행률 콜백 호출
//         onProgress?.(i + 1, effectNames.length);
        
//         // 성능 모니터링용 진행률 로깅
//         logProgress(i + 1, effectNames.length);
        
//         // 메인 스레드에 여유 시간 제공 (마지막 아이템이 아닌 경우)
//         if (i < effectNames.length - 1) {
//           await new Promise(resolve => setTimeout(resolve, delayBetweenLoads));
//         }
//       } catch (error) {
//         // 취소 에러인 경우 즉시 전파
//         if (error instanceof Error && error.name === 'AbortError') {
//           throw error;
//         }
        
//         // 개별 효과 로드 실패 시 경고 로그 출력하고 진행률 업데이트 후 다음으로 계속
//         console.warn(`Failed to preload effect "${effectNames[i]}":`, error);
//         onProgress?.(i + 1, effectNames.length);
        
//         if (i < effectNames.length - 1) {
//           await new Promise(resolve => setTimeout(resolve, delayBetweenLoads));
//         }
//       }
//     }
    
//     // 성공적으로 완료
//     finishPerformanceMonitoring(performanceMetrics, effectsLoaded, true);
//   } catch (error) {
//     // 에러 발생 시 성능 모니터링 완료
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     finishPerformanceMonitoring(performanceMetrics, effectsLoaded, false, errorMessage);
//     throw error;
//   }
// };

/**
 * 사용 가능한 모든 효과 이름을 반환하는 함수
 */
export const getAvailableEffects = (): string[] => {
  return Object.keys(VANTA_EFFECT_MODULES);
};

/**
 * 캐시된 효과들을 확인하는 함수 (디버깅용)
 */
export const getCachedEffects = (): string[] => {
  return Object.keys(EFFECT_CACHE);
};

/**
 * 캐시를 초기화하는 함수 (메모리 정리용)
 */
export const clearEffectCache = (): void => {
  for (const key of Object.keys(EFFECT_CACHE)) {
    delete EFFECT_CACHE[key];
  }
  for (const key of Object.keys(LOADING_STATE)) {
    delete LOADING_STATE[key];
  }
};
