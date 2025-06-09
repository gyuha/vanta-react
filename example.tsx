import React, { useEffect, useRef } from 'react';
// Vanta.js는 THREE.js에 의존하므로 반드시 import 해야 합니다.
import * as THREE from 'three';

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
interface VantaEffect {
  destroy: () => void;
}

/**
 * Vanta 효과를 생성하는 함수의 시그니처를 정의합니다.
 * 이 함수는 el(DOM 요소), THREE 라이브러리 등 여러 옵션을 포함하는 객체를 인자로 받습니다.
 */
type VantaCreator = (options: {
  el: HTMLElement;
  THREE: typeof THREE;
  [key: string]: any; // 그 외 다양한 옵션들을 허용합니다.
}) => VantaEffect;

/**
 * 이 컴포넌트가 받을 props의 타입을 정의하는 인터페이스입니다.
 * 각 prop의 타입과 역할을 명확하게 문서화합니다.
 */
interface DynamicVantaBackgroundProps {
  /** 렌더링할 Vanta 효과의 이름 (e.g., 'net', 'waves') */
  effect: VantaEffectName;
  /** Vanta 효과에 전달할 설정 옵션 객체. 키는 문자열, 값은 무엇이든 될 수 있습니다. */
  options?: Record<string, any>;
  /** 배경 div에 추가할 사용자 정의 CSS 클래스 (Tailwind 등) */
  className?: string;
}

/**
 * React.FC (Functional Component) 타입을 사용하여 컴포넌트를 정의합니다.
 * 제네릭으로 Props 인터페이스를 전달하여 props 객체의 타입을 엄격하게 검사합니다.
 */
const DynamicVantaBackground: React.FC<DynamicVantaBackgroundProps> = ({
  effect,
  options,
  className = '',
}) => {
  // useRef 훅에 제네릭을 사용하여 ref가 참조할 객체의 타입을 명시합니다.
  // Vanta 효과 인스턴스를 저장하며, 초기값은 null입니다.
  const vantaEffectRef = useRef<VantaEffect | null>(null);
  // ref가 HTMLDivElement를 참조할 것임을 명시합니다.
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true; // 클린업 함수에서의 비동기 작업 충돌을 방지하기 위한 플래그

    if (vantaRef.current && effect) {
      // 1. 기존 효과가 있다면 안전하게 파괴합니다.
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
      }

      // 2. 새로운 효과 모듈을 동적으로 import 합니다.
      const effectModuleName = effect.toLowerCase();
      import(`vanta/dist/vanta.${effectModuleName}.min.js`)
        .then(vantaModule => {
          if (!isMounted || !vantaModule.default) return;

          const VantaCreator: VantaCreator = vantaModule.default;
          
          // 3. Vanta 효과 인스턴스를 생성하고 ref에 저장합니다.
          vantaEffectRef.current = VantaCreator({
            el: vantaRef.current,
            THREE: THREE,
            // 기본 옵션과 사용자가 전달한 옵션을 병합합니다.
            ...{
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
            },
            ...options,
          });
        })
        .catch(error => {
          // 동적 import 실패 시 에러를 콘솔에 기록합니다.
          console.error(`Vanta.js effect "${effect}" failed to load:`, error);
        });
    }

    // 4. 클린업 함수: 컴포넌트가 언마운트되거나 의존성이 변경될 때 호출됩니다.
    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null; // 참조를 명시적으로 null로 만들어 가비지 컬렉션을 돕습니다.
      }
    };
  }, [effect, options]); // effect나 options prop이 변경될 때마다 이 훅이 다시 실행됩니다.

  // JSX: TypeScript의 타입 검사를 통과해야 하는 UI 마크업입니다.
  return (
    <div
      ref={vantaRef}
      className={`fixed inset-0 w-full h-full -z-10 ${className}`}
    />
  );
};

export default DynamicVantaBackground;
