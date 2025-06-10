/**
 * Vanta.js가 제공하는 효과 이름들을 TypeScript의 'string literal union' 타입으로 정의합니다.
 * 이를 통해 effect prop에 정해진 문자열만 사용하도록 강제하여 오타를 방지하고,
 * 코드 에디터에서 자동 완성 기능을 활용할 수 있습니다.
 */
export type VantaEffectName =
  | 'birds'
  | 'cells'
  | 'clouds'
  | 'clouds2'
  | 'fog'
  | 'globe'
  | 'net'
  | 'rings'
  | 'halo'
  | 'ripple'
  | 'dots'
  | 'topology'
  | 'trunk'
  | 'waves';

/**
 * Vanta.js 효과 인스턴스의 타입을 정의하는 인터페이스입니다.
 * Vanta 인스턴스는 다양한 내부 속성을 가지지만, 외부에서 제어할 때 가장 중요한 것은
 * 메모리 해제를 위한 destroy 메서드와 크기 조정을 위한 resize 메서드입니다.
 */
export interface VantaEffect {
  destroy: () => void;
  resize?: () => void;
  [key: string]: any; // 기타 Vanta 인스턴스의 속성들
}

/**
 * Vanta 효과를 생성하는 함수의 시그니처를 정의합니다.
 * 이 함수는 el(DOM 요소), THREE 라이브러리 등 여러 옵션을 포함하는 객체를 인자로 받습니다.
 */
export type VantaCreator = (options: {
  el: HTMLElement;
  THREE: any;
  [key: string]: any; // 그 외 다양한 옵션들을 허용합니다.
}) => VantaEffect;

/**
 * Vanta 컴포넌트가 받을 props의 타입을 정의하는 인터페이스입니다.
 * 각 prop의 타입과 역할을 명확하게 문서화합니다.
 */
export interface VantaProps {
  /** 렌더링할 Vanta 효과의 이름 (e.g., 'net', 'waves') */
  effect: VantaEffectName;
  /** Vanta 효과에 전달할 설정 옵션 객체. 키는 문자열, 값은 무엇이든 될 수 있습니다. */
  options?: Record<string, any>;
  /** 컨테이너 div에 추가할 사용자 정의 CSS 클래스 */
  className?: string;
  /** 컨테이너 div에 적용할 인라인 스타일 */
  style?: React.CSSProperties;
  /** true로 설정하면 화면 전체를 덮는 배경으로 동작합니다 (fixed positioning, full screen) */
  background?: boolean;
}

// /**
//  * preloadVantaEffects 함수에 전달할 수 있는 옵션들을 정의하는 인터페이스입니다.
//  * 순차적 로딩, 취소 기능, 진행률 콜백 등의 고급 기능을 지원합니다.
//  * 
//  * @deprecated 프리로딩 기능이 제거되었습니다.
//  */
// export interface PreloadOptions {
//   /** 비동기 작업을 취소하기 위한 AbortSignal */
//   signal?: AbortSignal;
//   /** 로딩 진행률을 받을 콜백 함수 (loaded: 완료된 항목 수, total: 전체 항목 수) */
//   onProgress?: (loaded: number, total: number) => void;
//   /** 각 효과 로딩 사이의 지연 시간 (밀리초, 기본값: 100ms) */
//   delayBetweenLoads?: number;
// }

// /**
//  * useVantaPreloader 훅이 반환하는 값들의 타입을 정의하는 인터페이스입니다.
//  * preloading 상태와 진행률, 취소 기능을 포함합니다.
//  * 
//  * @deprecated 프리로딩 기능이 제거되었습니다.
//  */
// export interface VantaPreloaderResult {
//   /** 현재 preloading이 진행 중인지 여부 */
//   isPreloading: boolean;
//   /** preloading 중 발생한 에러 메시지 (에러가 없으면 null) */
//   preloadError: string | null;
//   /** 현재까지 로드된 효과의 개수 */
//   loadedCount: number;
//   /** 로드해야 할 전체 효과의 개수 */
//   totalCount: number;
//   /** 진행률 (0-100 사이의 숫자) */
//   progress: number;
//   /** 모든 효과의 로딩이 완료되었는지 여부 */
//   isComplete: boolean;
//   /** 진행 중인 preloading을 취소하는 함수 */
//   cancelPreloading: () => void;
// }
