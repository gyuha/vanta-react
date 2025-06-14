/**
 * CDN 기반 Vanta 이펙트 로더
 * jsdelivr CDN을 통해 Vanta 이펙트를 동적으로 로드합니다.
 */

import type { VantaEffectName } from './cdn-library-loader';
import { loadCdnVantaEffect } from './cdn-library-loader';

// CDN URL 베이스
const VANTA_CDN_BASE = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/';

// 로드된 이펙트 캐시
const loadedEffects = new Set<string>();
const loadingPromises = new Map<string, Promise<any>>();

/**
 * CDN에서 Vanta 이펙트를 로드하는 함수
 * @param effectName 로드할 이펙트 이름
 * @returns 로드된 이펙트 생성자
 */
export const loadVantaEffectFromCdn = async (effectName: VantaEffectName): Promise<any> => {
  // 이미 로드된 이펙트인지 확인
  if (loadedEffects.has(effectName)) {
    const vanta = (window as any).VANTA;
    const effect = vanta && vanta[effectName.toUpperCase()];
    if (effect) {
      return effect;
    }
  }

  // 이미 로딩 중인 이펙트인지 확인
  if (loadingPromises.has(effectName)) {
    return loadingPromises.get(effectName);
  }

  // 새로운 로딩 프로세스 시작
  const loadingPromise = loadCdnVantaEffect(effectName);
  loadingPromises.set(effectName, loadingPromise);

  try {
    const effect = await loadingPromise;
    loadedEffects.add(effectName);
    loadingPromises.delete(effectName);
    return effect;
  } catch (error) {
    loadingPromises.delete(effectName);
    throw error;
  }
};

/**
 * 여러 Vanta 이펙트를 병렬로 로드
 * @param effectNames 로드할 이펙트 이름 배열
 * @returns 로드된 이펙트들의 객체
 */
export const loadMultipleVantaEffects = async (effectNames: VantaEffectName[]): Promise<Record<string, any>> => {
  try {
    const loadPromises = effectNames.map(async (effectName) => {
      const effect = await loadVantaEffectFromCdn(effectName);
      return { name: effectName, effect };
    });

    const results = await Promise.all(loadPromises);
    
    return results.reduce((acc, { name, effect }) => {
      acc[name] = effect;
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.error('[CDN Vanta] Failed to load multiple effects:', error);
    throw error;
  }
};

/**
 * 인기 있는 Vanta 이펙트들을 미리 로드
 */
export const preloadPopularVantaEffects = async (): Promise<void> => {
  const popularEffects: VantaEffectName[] = ['waves', 'birds', 'net', 'clouds', 'fog'];
  
  await loadMultipleVantaEffects(popularEffects);
};

/**
 * Vanta 이펙트 로드 상태 확인
 */
export const getVantaLoadStatus = () => ({
  loadedEffects: Array.from(loadedEffects),
  loadingEffects: Array.from(loadingPromises.keys()),
  vantaAvailable: !!(window as any).VANTA,
  loadedCount: loadedEffects.size,
  loadingCount: loadingPromises.size
});

/**
 * 로드된 Vanta 이펙트 캐시를 클리어
 */
export const clearVantaCache = () => {
  loadedEffects.clear();
  loadingPromises.clear();
};

/**
 * Vanta 이펙트가 사용 가능한지 확인
 * @param effectName 확인할 이펙트 이름
 * @returns 이펙트 사용 가능 여부
 */
export const isVantaEffectAvailable = (effectName: VantaEffectName): boolean => {
  if (typeof window === 'undefined') return false;
  
  const vanta = (window as any).VANTA;
  return !!(vanta && vanta[effectName.toUpperCase()]);
};

/**
 * CDN URL을 반환하는 헬퍼 함수
 * @param effectName 이펙트 이름
 * @returns CDN URL
 */
export const getVantaEffectCdnUrl = (effectName: VantaEffectName): string => {
  return `${VANTA_CDN_BASE}vanta.${effectName}.min.js`;
};
