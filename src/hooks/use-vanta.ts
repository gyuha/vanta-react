import { useEffect, useState } from 'react';
import type { VantaEffectName } from '../types';
import { loadVantaEffect, preloadVantaEffects } from '../utils/vanta-loader';

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

/**
 * 여러 Vanta 효과를 미리 로드하는 커스텀 훅
 */
export const useVantaPreloader = (effectNames: VantaEffectName[]) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const preload = async () => {
      if (effectNames.length === 0) return;

      setIsPreloading(true);
      setPreloadError(null);
      setLoadedCount(0);

      try {
        await preloadVantaEffects(effectNames);
        
        if (isMounted) {
          setLoadedCount(effectNames.length);
        }
      } catch (err) {
        if (isMounted) {
          setPreloadError(err instanceof Error ? err.message : 'Preload failed');
        }
      } finally {
        if (isMounted) {
          setIsPreloading(false);
        }
      }
    };

    preload();

    return () => {
      isMounted = false;
    };
  }, [effectNames]);

  const progress = effectNames.length > 0 ? (loadedCount / effectNames.length) * 100 : 0;

  return {
    isPreloading,
    preloadError,
    loadedCount,
    totalCount: effectNames.length,
    progress,
    isComplete: loadedCount === effectNames.length && effectNames.length > 0,
  };
};
