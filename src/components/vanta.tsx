import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import type { VantaProps, VantaEffect } from '../types';
import { loadVantaEffect } from '../utils/vanta-loader';
import { areLibrariesReady, getPreloadedThree, getPreloadedP5 } from '../utils/preload-libraries';

/**
 * Vanta.js 효과를 React 컴포넌트로 래핑한 컴포넌트입니다.
 * 동적으로 Vanta 효과 모듈을 로드하고, React 라이프사이클에 맞게 관리합니다.
 */
const Vanta: React.FC<VantaProps> = ({
  effect,
  options,
  className = '',
  style,
  background = false,
}) => {
  // Vanta 효과 인스턴스를 저장하는 ref
  const vantaEffectRef = useRef<VantaEffect | null>(null);
  // DOM 요소를 참조하는 ref
  const vantaRef = useRef<HTMLDivElement>(null);
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // options 객체의 불필요한 재생성을 방지하기 위한 메모이제이션
  const memoizedOptions = useMemo(() => options, [options]);

  // p5가 필요한 효과들을 식별하는 함수
  const needsP5 = useMemo(() => {
    return ['trunk', 'topology', 'dots'].includes(effect);
  }, [effect]);

  // 리사이즈 핸들러를 useCallback으로 최적화
  const createResizeHandler = useCallback(() => {
    return () => {
      if (vantaEffectRef.current && vantaRef.current) {
        const element = vantaRef.current;
        element.style.width = '100vw';
        element.style.height = '100vh';
        if (vantaEffectRef.current.resize) {
          vantaEffectRef.current.resize();
        }
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true; // 클린업 함수에서의 비동기 작업 충돌을 방지하기 위한 플래그
    let initializationPromise: Promise<void> | null = null;

    // 개발 모드에서 useEffect 실행 로깅
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.debug('[Vanta] useEffect triggered:', { effect, background, optionsKeys: Object.keys(memoizedOptions || {}) });
    }

    const initializeVantaEffect = async () => {
      if (!vantaRef.current || !effect) return;

      // 1. 기존 효과가 있다면 안전하게 파괴합니다.
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (destroyError) {
          console.warn('[Vanta] Error destroying previous effect:', destroyError);
        }
        vantaEffectRef.current = null;
      }

      // 2. 로딩 상태 설정
      if (isMounted) {
        setIsLoading(true);
        setLoadError(null);
      }

      try {
        // 3. 라이브러리 준비 상태 확인 - React 19에서 더 안전한 체크
        const maxRetries = 5;
        let retryCount = 0;
        
        while (retryCount < maxRetries && isMounted) {
          if (areLibrariesReady()) {
            break;
          }
          
          if (retryCount === 0) {
            console.warn('[Vanta] Libraries are not preloaded. Ensure preloadLibraries() is called before using Vanta components.');
          }
          
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 100 * retryCount)); // 지수 백오프
        }
        
        if (!areLibrariesReady() && isMounted) {
          setLoadError('Libraries not ready after multiple attempts. Please ensure preloadLibraries() is called.');
          return;
        }

        // 4. 전역에서 직접 라이브러리 참조 (안전한 접근 함수 사용)
        let THREE: any;
        let p5: any;

        try {
          THREE = getPreloadedThree();
          if (needsP5) {
            p5 = getPreloadedP5();
          }
        } catch (libraryError) {
          if (isMounted) {
            setLoadError(`Library access error: ${libraryError instanceof Error ? libraryError.message : 'Unknown error'}`);
          }
          return;
        }

        // 5. 효과 모듈을 동적으로 로드합니다.
        const VantaCreator = await loadVantaEffect(effect);
        
        if (!VantaCreator && isMounted) {
          setLoadError(`Effect "${effect}" not found`);
          return;
        }

        // 6. 컴포넌트가 여전히 마운트되어 있고 DOM 요소가 존재하는지 확인 (React 19 안전성)
        if (isMounted && vantaRef.current && VantaCreator) {
          // 배경 모드일 때 컨테이너 크기를 명시적으로 설정
          if (background && vantaRef.current) {
            // DOM 요소의 크기를 즉시 설정
            const element = vantaRef.current;
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.width = '100vw';
            element.style.height = '100vh';
            element.style.zIndex = '-10';
            
            // 강제로 레이아웃 재계산을 위해 offsetHeight를 읽어옴
            element.offsetHeight;
          }

          // 7. Vanta 효과 인스턴스를 생성하고 ref에 저장합니다.
          const effectOptions = {
            el: vantaRef.current,
            THREE: THREE,
            ...(needsP5 && { p5: p5 }), // p5가 필요한 효과에만 p5 전달
            // 기본 옵션과 사용자가 전달한 옵션을 병합합니다.
            ...{
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: background ? window.innerHeight : 200.00,
              minWidth: background ? window.innerWidth : 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
            },
            ...memoizedOptions,
          };

          vantaEffectRef.current = VantaCreator(effectOptions);

          // React 19 호환성: 효과 생성 검증
          if (!vantaEffectRef.current && isMounted) {
            setLoadError(`Failed to create effect "${effect}"`);
            return;
          }

          // 배경 모드일 때 추가 설정 및 리사이즈 이벤트 처리
          if (background && vantaEffectRef.current && isMounted) {
            // 초기 크기 조정 - React 19에서 더 안전한 타이밍
            const resizeTimeout = setTimeout(() => {
              if (vantaEffectRef.current && vantaRef.current && isMounted) {
                try {
                  if (vantaEffectRef.current.resize) {
                    vantaEffectRef.current.resize();
                  }
                } catch (resizeError) {
                  console.warn('[Vanta] Resize error:', resizeError);
                }
              }
            }, 100);

            const handleResize = createResizeHandler();

            window.addEventListener('resize', handleResize);
            
            // 클린업에서 리사이즈 이벤트 제거
            const currentCleanup = () => {
              window.removeEventListener('resize', handleResize);
              clearTimeout(resizeTimeout);
            };
            
            // 기존 클린업 함수와 합치기 위해 저장
            (vantaEffectRef.current as VantaEffect & { _customCleanup?: () => void })._customCleanup = currentCleanup;
          }
        }
      } catch (error) {
        console.error(`Vanta.js effect "${effect}" failed to initialize:`, error);
        if (isMounted) {
          setLoadError(`Failed to initialize effect "${effect}"`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // React 19에서 중복 실행 방지
    if (!initializationPromise) {
      initializationPromise = initializeVantaEffect();
    }

    // 8. 클린업 함수: 컴포넌트가 언마운트되거나 의존성이 변경될 때 호출됩니다.
    return () => {
      isMounted = false;
      
      // 초기화 중인 Promise가 있다면 완료를 기다림
      if (initializationPromise) {
        initializationPromise.finally(() => {
          if (vantaEffectRef.current) {
            // 커스텀 클린업 함수 실행
            const effectWithCleanup = vantaEffectRef.current as VantaEffect & { _customCleanup?: () => void };
            if (effectWithCleanup._customCleanup) {
              try {
                effectWithCleanup._customCleanup();
              } catch (cleanupError) {
                console.warn('[Vanta] Cleanup error:', cleanupError);
              }
            }
            
            try {
              vantaEffectRef.current.destroy();
            } catch (destroyError) {
              console.warn('[Vanta] Destroy error:', destroyError);
            }
            
            vantaEffectRef.current = null; // 참조를 명시적으로 null로 만들어 가비지 컬렉션을 돕습니다.
          }
        });
      } else if (vantaEffectRef.current) {
        // 즉시 클린업 가능한 경우
        try {
          const effectWithCleanup = vantaEffectRef.current as VantaEffect & { _customCleanup?: () => void };
          if (effectWithCleanup._customCleanup) {
            effectWithCleanup._customCleanup();
          }
          vantaEffectRef.current.destroy();
        } catch (error) {
          console.warn('[Vanta] Cleanup error:', error);
        }
        vantaEffectRef.current = null;
      }
    };
  }, [effect, memoizedOptions, background, createResizeHandler, needsP5]); // needsP5는 효과별 라이브러리 요구사항 확인용

  // background prop에 따라 다른 스타일을 적용합니다.
  const baseClassName = background
    ? 'fixed inset-0 w-screen h-screen -z-10' // 전체 화면 배경 (vw/vh 대신 screen 사용)
    : 'w-full h-full'; // 일반 div

  // 로딩 중이거나 에러가 있는 경우의 처리
  if (loadError) {
    console.warn(`Vanta effect load error: ${loadError}`);
  }

  return React.createElement('div', {
    ref: vantaRef,
    className: `${baseClassName} ${className}`,
    style: {
      // 로딩 중일 때는 투명도를 낮춰서 시각적 피드백 제공 (선택사항)
      opacity: isLoading ? 0.7 : 1,
      transition: 'opacity 0.3s ease-in-out',
      // 배경 모드일 때 추가 스타일
      ...(background && {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }),
      // 사용자 정의 스타일 추가
      ...style,
    }
  });
};

export default Vanta;
