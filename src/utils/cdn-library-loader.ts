/**
 * CDN을 통해 라이브러리를 동적으로 로드하는 유틸리티
 * jsdelivr CDN을 사용하여 최신 버전의 라이브러리를 로드합니다.
 */

// 로드 상태 추적
let threeLoaded = false;
let p5Loaded = false;
let vantaLoaded = false;
let threeScript: HTMLScriptElement | null = null;
let p5Script: HTMLScriptElement | null = null;

// CDN URL 설정
const CDN_URLS = {
  THREE: 'https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js',
  P5: 'https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.min.js',
  VANTA_BASE: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/',
} as const;

/**
 * 스크립트를 동적으로 로드하는 범용 함수
 */
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

/**
 * Three.js를 CDN에서 로드
 */
export const loadCdnThree = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있다면 즉시 반환
    if (threeLoaded && (window as any).THREE) {
      resolve((window as any).THREE);
      return;
    }

    // 이미 스크립트가 로딩 중이라면 기다림
    if (threeScript) {
      threeScript.addEventListener('load', () => {
        resolve((window as any).THREE);
      });
      threeScript.addEventListener('error', reject);
      return;
    }

    // 스크립트 태그 생성 및 로드
    threeScript = document.createElement('script');
    threeScript.src = CDN_URLS.THREE;
    threeScript.onload = () => {
      threeLoaded = true;
      if ((window as any).THREE) {
        resolve((window as any).THREE);
      } else {
        reject(new Error('Three.js failed to load properly from CDN'));
      }
    };
    threeScript.onerror = () => {
      reject(new Error('Failed to load Three.js from CDN'));
    };

    document.head.appendChild(threeScript);
  });
};

/**
 * p5.js를 CDN에서 로드
 */
export const loadCdnP5 = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있다면 즉시 반환
    if (p5Loaded && (window as any).p5) {
      resolve((window as any).p5);
      return;
    }

    // 이미 스크립트가 로딩 중이라면 기다림
    if (p5Script) {
      p5Script.addEventListener('load', () => {
        resolve((window as any).p5);
      });
      p5Script.addEventListener('error', reject);
      return;
    }

    // 스크립트 태그 생성 및 로드
    p5Script = document.createElement('script');
    p5Script.src = CDN_URLS.P5;
    p5Script.onload = () => {
      p5Loaded = true;
      if ((window as any).p5) {
        resolve((window as any).p5);
      } else {
        reject(new Error('p5.js failed to load properly from CDN'));
      }
    };
    p5Script.onerror = () => {
      reject(new Error('Failed to load p5.js from CDN'));
    };

    document.head.appendChild(p5Script);
  });
};

/**
 * Vanta 특정 이펙트를 CDN에서 로드
 */
export const loadCdnVantaEffect = (effectName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const effectUrl = `${CDN_URLS.VANTA_BASE}vanta.${effectName}.min.js`;
    
    // 이미 로드된 이펙트인지 확인
    const vantaObject = (window as any).VANTA;
    if (vantaObject?.[effectName.toUpperCase()]) {
      resolve(vantaObject[effectName.toUpperCase()]);
      return;
    }

    // 스크립트 로드
    const script = document.createElement('script');
    script.src = effectUrl;
    script.onload = () => {
      const vanta = (window as any).VANTA;
      const effect = vanta?.[effectName.toUpperCase()];
      if (effect) {
        resolve(effect);
      } else {
        reject(new Error(`Failed to load Vanta effect: ${effectName}`));
      }
    };
    script.onerror = () => {
      reject(new Error(`Failed to load Vanta effect from CDN: ${effectName}`));
    };

    document.head.appendChild(script);
  });
};

/**
 * 필요한 라이브러리들을 병렬로 CDN에서 로드
 */
export const loadCdnLibraries = async (needsP5 = false) => {
  try {
    console.log('[CDN] Starting library load from CDN...');
    
    // THREE.js와 p5.js를 병렬로 로드
    const loadPromises: Promise<any>[] = [loadCdnThree()];
    
    if (needsP5) {
      loadPromises.push(loadCdnP5());
    }

    const results = await Promise.all(loadPromises);
    const THREE = results[0];
    const p5 = needsP5 ? results[1] : undefined;

    console.log('[CDN] Libraries loaded successfully from CDN');
    
    return {
      THREE,
      ...(needsP5 && { p5 })
    };
  } catch (error) {
    console.error('[CDN] Failed to load libraries from CDN:', error);
    throw error;
  }
};

/**
 * CDN 라이브러리 로드 상태 확인
 */
export const getCdnLibraryStatus = () => ({
  threeLoaded,
  p5Loaded,
  vantaLoaded,
  threeAvailable: !!(window as any).THREE,
  p5Available: !!(window as any).p5,
  vantaAvailable: !!(window as any).VANTA
});

/**
 * 사용 가능한 Vanta 이펙트 목록
 */
export const VANTA_EFFECTS = [
  'birds', 'cells', 'clouds', 'clouds2', 'dots', 'fog', 
  'globe', 'halo', 'net', 'rings', 'ripple', 'topology', 
  'trunk', 'waves'
] as const;

export type VantaEffectName = typeof VANTA_EFFECTS[number];

/**
 * 모든 Vanta 이펙트를 미리 로드 (선택사항)
 */
export const preloadAllVantaEffects = async (): Promise<void> => {
  try {
    console.log('[CDN] Preloading all Vanta effects...');
    
    const loadPromises = VANTA_EFFECTS.map(effect => 
      loadCdnVantaEffect(effect).catch(error => {
        console.warn(`[CDN] Failed to preload effect ${effect}:`, error);
        return null;
      })
    );

    await Promise.all(loadPromises);
    console.log('[CDN] All Vanta effects preloaded');
  } catch (error) {
    console.error('[CDN] Failed to preload Vanta effects:', error);
    throw error;
  }
};
