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
 * 메모리 해제를 위한 destroy 메서드입니다.
 */
export interface VantaEffect {
  destroy: () => void;
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
  /** true로 설정하면 화면 전체를 덮는 배경으로 동작합니다 (fixed positioning, full screen) */
  background?: boolean;
}
