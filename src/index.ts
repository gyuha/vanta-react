// 메인 컴포넌트 export
export { default as Vanta } from './components/vanta';

// 타입 정의 export
export * from './types';

// 유틸리티 함수 export
export {
  loadVantaEffect,
  preloadVantaEffects,
  getAvailableEffects,
  getCachedEffects,
  clearEffectCache,
} from './utils/vanta-loader';

// 커스텀 훅 export
export {
  useVantaEffect,
  useVantaPreloader,
} from './hooks/use-vanta';
