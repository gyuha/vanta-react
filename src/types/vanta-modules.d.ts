/**
 * CDN 기반 Vanta.js 타입 선언
 * 전역 VANTA 객체와 window 객체 확장을 위한 타입 정의
 */

declare global {
  interface Window {
    THREE?: any;
    p5?: any;
    VANTA?: {
      BIRDS?: any;
      CELLS?: any;
      CLOUDS?: any;
      CLOUDS2?: any;
      DOTS?: any;
      FOG?: any;
      GLOBE?: any;
      HALO?: any;
      NET?: any;
      RINGS?: any;
      RIPPLE?: any;
      TOPOLOGY?: any;
      TRUNK?: any;
      WAVES?: any;
      [key: string]: any;
    };
  }
}

/**
 * CDN에서 로드되는 Vanta 이펙트 타입
 * 각 이펙트는 함수로 제공되며 옵션 객체를 받아 이펙트 인스턴스를 반환합니다.
 */
export interface VantaEffectConstructor {
  (options: {
    el: HTMLElement;
    THREE?: any;
    p5?: any;
    [key: string]: any;
  }): {
    destroy(): void;
    resize?(): void;
    [key: string]: any;
  };
}

/**
 * CDN 로드 상태 타입
 */
export interface CdnLoadStatus {
  threeLoaded: boolean;
  p5Loaded: boolean;
  vantaLoaded: boolean;
  threeAvailable: boolean;
  p5Available: boolean;
  vantaAvailable: boolean;
}

// 모듈 내보내기 (TypeScript 모듈로 인식되도록)
export {};
