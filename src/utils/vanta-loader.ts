/**
 * CDN 기반 Vanta 이펙트 로더
 * CDN에서 Vanta 이펙트를 동적으로 로드하고 관리합니다.
 */

import type { VantaCreator } from '../types';
import { loadCdnVantaEffect, type VantaEffectName } from './cdn-library-loader';

// 로드된 효과들을 캐시하는 객체
const EFFECT_CACHE: Record<string, VantaCreator> = {};

// 로딩 상태를 추적하는 객체
const LOADING_STATE: Record<string, Promise<VantaCreator | null>> = {};

/**
 * CDN에서 Vanta 효과를 동적으로 로드하는 함수
 * 이미 로드된 효과는 캐시에서 반환하여 성능을 최적화합니다.
 * 동시에 같은 효과를 로드하려는 경우 중복 로딩을 방지합니다.
 */
export const loadVantaEffect = async (effectName: string): Promise<VantaCreator | null> => {
  const normalizedName = effectName.toLowerCase();
  
  // 캐시에서 확인
  if (EFFECT_CACHE[normalizedName]) {
    console.debug(`[Vanta Loader] Effect "${normalizedName}" loaded from cache`);
    return EFFECT_CACHE[normalizedName];
  }
  
  // 이미 로딩 중인 경우 기존 Promise 반환
  if (normalizedName in LOADING_STATE) {
    console.debug(`[Vanta Loader] Effect "${normalizedName}" already loading, waiting...`);
    return LOADING_STATE[normalizedName];
  }
  
  // 새로운 로딩 프로세스 시작
  const loadingPromise = (async (): Promise<VantaCreator | null> => {
    try {
      console.debug(`[Vanta Loader] Loading effect "${normalizedName}" from CDN...`);
      
      // CDN에서 효과 로드
      const effectCreator = await loadCdnVantaEffect(normalizedName as VantaEffectName);
      
      if (effectCreator && typeof effectCreator === 'function') {
        // 캐시에 저장
        EFFECT_CACHE[normalizedName] = effectCreator;
        console.debug(`[Vanta Loader] Effect "${normalizedName}" loaded successfully from CDN`);
        return effectCreator;
      } else {
        throw new Error(`Invalid effect creator received for "${normalizedName}"`);
      }
    } catch (error) {
      console.error(`[Vanta Loader] Failed to load effect "${normalizedName}" from CDN:`, error);
      return null;
    } finally {
      // 로딩 상태에서 제거
      delete LOADING_STATE[normalizedName];
    }
  })();
  
  // 로딩 상태에 추가
  LOADING_STATE[normalizedName] = loadingPromise;
  
  return loadingPromise;
};

/**
 * 사용 가능한 효과 목록을 반환하는 함수
 * CDN에서 지원하는 모든 Vanta 효과들을 나열합니다.
 */
export const getAvailableEffects = (): string[] => {
  return [
    'birds', 'cells', 'clouds', 'clouds2', 'dots', 'fog', 
    'globe', 'halo', 'net', 'rings', 'ripple', 'topology', 
    'trunk', 'waves'
  ];
};

/**
 * 현재 캐시된 효과들의 목록을 반환하는 함수
 * 이미 로드되어 즉시 사용 가능한 효과들을 확인할 수 있습니다.
 */
export const getCachedEffects = (): string[] => {
  return Object.keys(EFFECT_CACHE);
};

/**
 * 효과 캐시를 초기화하는 함수
 * 메모리 정리나 테스트 목적으로 사용됩니다.
 */
export const clearEffectCache = (): void => {
  Object.keys(EFFECT_CACHE).forEach(key => {
    delete EFFECT_CACHE[key];
  });
  
  Object.keys(LOADING_STATE).forEach(key => {
    delete LOADING_STATE[key];
  });
  
  console.debug('[Vanta Loader] Effect cache cleared');
};

/**
 * 특정 효과가 로드되었는지 확인하는 함수
 * @param effectName 확인할 효과 이름
 * @returns 효과가 캐시에 로드되어 있는지 여부
 */
export const isEffectLoaded = (effectName: string): boolean => {
  const normalizedName = effectName.toLowerCase();
  return normalizedName in EFFECT_CACHE;
};

/**
 * 현재 로딩 중인 효과들의 목록을 반환하는 함수
 * @returns 로딩 중인 효과 이름들의 배열
 */
export const getLoadingEffects = (): string[] => {
  return Object.keys(LOADING_STATE);
};

/**
 * 여러 효과를 병렬로 미리 로드하는 함수
 * @param effectNames 로드할 효과 이름들의 배열
 * @returns 로드 결과 (성공한 효과들)
 */
export const preloadEffects = async (effectNames: string[]): Promise<string[]> => {
  try {
    console.debug(`[Vanta Loader] Preloading ${effectNames.length} effects from CDN...`);
    
    const loadPromises = effectNames.map(async (effectName) => {
      try {
        await loadVantaEffect(effectName);
        return effectName;
      } catch (error) {
        console.warn(`[Vanta Loader] Failed to preload effect "${effectName}":`, error);
        return null;
      }
    });

    const results = await Promise.all(loadPromises);
    const successfulEffects = results.filter((name): name is string => name !== null);
    
    console.debug(`[Vanta Loader] Successfully preloaded ${successfulEffects.length}/${effectNames.length} effects`);
    return successfulEffects;
  } catch (error) {
    console.error('[Vanta Loader] Failed to preload effects:', error);
    return [];
  }
};
