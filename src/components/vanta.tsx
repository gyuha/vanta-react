import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VantaProps, VantaEffect, VantaCreator } from '../types';

// Vanta.js 효과들을 정적으로 import
import BIRDS from 'vanta/dist/vanta.birds.min.js';
import CELLS from 'vanta/dist/vanta.cells.min.js';
import CLOUDS from 'vanta/dist/vanta.clouds.min.js';
import CLOUDS2 from 'vanta/dist/vanta.clouds2.min.js';
import FOG from 'vanta/dist/vanta.fog.min.js';
import GLOBE from 'vanta/dist/vanta.globe.min.js';
import NET from 'vanta/dist/vanta.net.min.js';
import RINGS from 'vanta/dist/vanta.rings.min.js';
import HALO from 'vanta/dist/vanta.halo.min.js';
import RIPPLE from 'vanta/dist/vanta.ripple.min.js';
import DOTS from 'vanta/dist/vanta.dots.min.js';
import TOPOLOGY from 'vanta/dist/vanta.topology.min.js';
import TRUNK from 'vanta/dist/vanta.trunk.min.js';
import WAVES from 'vanta/dist/vanta.waves.min.js';

// 효과 이름과 생성자 함수를 매핑하는 객체
const VANTA_EFFECTS: Record<string, VantaCreator> = {
  birds: BIRDS,
  cells: CELLS,
  clouds: CLOUDS,
  clouds2: CLOUDS2,
  fog: FOG,
  globe: GLOBE,
  net: NET,
  rings: RINGS,
  halo: HALO,
  ripple: RIPPLE,
  dots: DOTS,
  topology: TOPOLOGY,
  trunk: TRUNK,
  waves: WAVES,
};

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

      // 2. 효과 이름에 해당하는 생성자 함수를 찾습니다.
      const VantaCreator = VANTA_EFFECTS[effect.toLowerCase()];
      
      if (VantaCreator && isMounted && vantaRef.current) {
        // 3. Vanta 효과 인스턴스를 생성하고 ref에 저장합니다.
        try {
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
        } catch (error) {
          console.error(`Vanta.js effect "${effect}" failed to initialize:`, error);
        }
      } else if (!VantaCreator) {
        console.error(`Vanta.js effect "${effect}" is not available. Available effects:`, Object.keys(VANTA_EFFECTS));
      }
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
