import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VantaProps, VantaEffect, VantaCreator } from '../types';

/**
 * Vanta.js 효과를 React 컴포넌트로 래핑한 컴포넌트입니다.
 * 동적으로 Vanta 효과 모듈을 로드하고, React 라이프사이클에 맞게 관리합니다.
 */
const Vanta: React.FC<VantaProps> = ({
  effect,
  options,
  className = '',
  background = false,
}) => {
  // Vanta 효과 인스턴스를 저장하는 ref
  const vantaEffectRef = useRef<VantaEffect | null>(null);
  // DOM 요소를 참조하는 ref
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
          if (vantaRef.current) {
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
          }
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

  // background prop에 따라 다른 스타일을 적용합니다.
  const baseClassName = background
    ? 'fixed inset-0 w-full h-full -z-10' // 전체 화면 배경
    : 'w-full h-full'; // 일반 div

  return (
    <div
      ref={vantaRef}
      className={`${baseClassName} ${className}`}
    />
  );
};

export default Vanta;
