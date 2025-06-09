import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { VantaProps, VantaEffect } from '../types';
import { loadVantaEffect } from '../utils/vanta-loader';

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
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // 클린업 함수에서의 비동기 작업 충돌을 방지하기 위한 플래그

    const initializeVantaEffect = async () => {
      if (!vantaRef.current || !effect) return;

      // 1. 기존 효과가 있다면 안전하게 파괴합니다.
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }

      // 2. 로딩 상태 설정
      setIsLoading(true);
      setLoadError(null);

      try {
        // 3. 효과 모듈을 동적으로 로드합니다.
        const VantaCreator = await loadVantaEffect(effect);
        
        if (!VantaCreator) {
          setLoadError(`Effect "${effect}" not found`);
          return;
        }

        // 4. 컴포넌트가 여전히 마운트되어 있고 DOM 요소가 존재하는지 확인
        if (isMounted && vantaRef.current) {
          // 5. Vanta 효과 인스턴스를 생성하고 ref에 저장합니다.
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
      } catch (error) {
        console.error(`Vanta.js effect "${effect}" failed to initialize:`, error);
        setLoadError(`Failed to initialize effect "${effect}"`);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeVantaEffect();

    // 6. 클린업 함수: 컴포넌트가 언마운트되거나 의존성이 변경될 때 호출됩니다.
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

  // 로딩 중이거나 에러가 있는 경우의 처리
  if (loadError) {
    console.warn(`Vanta effect load error: ${loadError}`);
  }

  return (
    <div
      ref={vantaRef}
      className={`${baseClassName} ${className}`}
      style={{
        // 로딩 중일 때는 투명도를 낮춰서 시각적 피드백 제공 (선택사항)
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.3s ease-in-out',
      }}
    />
  );
};

export default Vanta;
