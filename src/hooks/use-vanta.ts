import { useEffect, useState } from 'react';
import type { VantaEffectName } from '../types';
import { loadVantaEffect } from '../utils/vanta-loader';

/**
 * Vanta 효과 로딩 상태를 관리하는 커스텀 훅
 */
export const useVantaEffect = (effectName: VantaEffectName) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEffect = async () => {
      if (!effectName) return;

      setIsLoading(true);
      setError(null);
      setIsLoaded(false);

      try {
        const effect = await loadVantaEffect(effectName);
        
        if (isMounted) {
          if (effect) {
            setIsLoaded(true);
          } else {
            setError(`Failed to load effect: ${effectName}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEffect();

    return () => {
      isMounted = false;
    };
  }, [effectName]);

  return { isLoading, error, isLoaded };
};

// /**
//  * 여러 Vanta 효과를 미리 로드하는 커스텀 훅
//  * AbortController를 통한 취소 기능과 실시간 진행률 업데이트를 지원합니다.
//  * 
//  * @deprecated 프리로딩 기능이 제거되었습니다.
//  */
// export const useVantaPreloader = (effectNames: VantaEffectName[]): VantaPreloaderResult => {
//   const [loadedCount, setLoadedCount] = useState(0);
//   const [isPreloading, setIsPreloading] = useState(false);
//   const [preloadError, setPreloadError] = useState<string | null>(null);
//   const abortControllerRef = useRef<AbortController | null>(null);

//   const cancelPreloading = useCallback(() => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//   }, []);

//   useEffect(() => {
//     let isMounted = true;

//     const preload = async () => {
//       if (effectNames.length === 0) return;

//       // 새로운 AbortController 생성
//       abortControllerRef.current = new AbortController();
      
//       setIsPreloading(true);
//       setPreloadError(null);
//       setLoadedCount(0);

//       try {
//         await preloadVantaEffects(effectNames, {
//           signal: abortControllerRef.current.signal,
//           onProgress: (loaded: number, total: number) => {
//             if (isMounted) {
//               setLoadedCount(loaded);
//             }
//           },
//           delayBetweenLoads: 100, // 브라우저 응답성을 위한 지연
//         });
//       } catch (err) {
//         if (isMounted) {
//           if (err instanceof Error) {
//             if (err.name === 'AbortError' || err.message === 'Preloading cancelled') {
//               // 사용자가 취소한 경우
//               setPreloadError('Preloading was cancelled');
//               console.log('Preloading cancelled by user');
//             } else {
//               // 기타 에러의 경우
//               setPreloadError(`Preload failed: ${err.message}`);
//               console.error('Preloading failed:', err);
//             }
//           } else {
//             // 알 수 없는 에러 타입의 경우
//             setPreloadError('Unknown preload error occurred');
//             console.error('Unknown preloading error:', err);
//           }
//         }
//       } finally {
//         if (isMounted) {
//           setIsPreloading(false);
//         }
//       }
//     };

//     preload();

//     return () => {
//       isMounted = false;
//       // 컴포넌트 언마운트 시 진행 중인 preloading 취소
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [effectNames]);

//   const progress = effectNames.length > 0 ? (loadedCount / effectNames.length) * 100 : 0;

//   return {
//     isPreloading,
//     preloadError,
//     loadedCount,
//     totalCount: effectNames.length,
//     progress,
//     isComplete: loadedCount === effectNames.length && effectNames.length > 0,
//     cancelPreloading,
//   };
// };
