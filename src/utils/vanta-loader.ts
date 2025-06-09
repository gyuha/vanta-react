import type { VantaCreator } from '../types';

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

/**
 * 여러 효과를 미리 로드하는 함수 (프리로딩)
 */
export const preloadVantaEffects = async (effectNames: string[]): Promise<void> => {
  const loadPromises = effectNames.map(name => loadVantaEffect(name));
  await Promise.all(loadPromises);
};

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
  Object.keys(EFFECT_CACHE).forEach(key => {
    delete EFFECT_CACHE[key];
  });
  Object.keys(LOADING_STATE).forEach(key => {
    delete LOADING_STATE[key];
  });
};
