/**
 * 로컬 라이브러리 파일을 동적으로 로드하는 유틸리티
 */

let threeLoaded = false;
let p5Loaded = false;
let threeScript: HTMLScriptElement | null = null;
let p5Script: HTMLScriptElement | null = null;

/**
 * src/lib 폴더의 파일 URL을 생성하는 헬퍼 함수
 */
const getLibraryUrl = (filename: string): string => {
  return new URL(`../lib/${filename}`, import.meta.url).href;
};

/**
 * Three.js를 로컬 파일에서 로드
 */
export const loadLocalThree = (): Promise<any> => {
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
    threeScript.src = getLibraryUrl('three.min.js');
    threeScript.onload = () => {
      threeLoaded = true;
      if ((window as any).THREE) {
        resolve((window as any).THREE);
      } else {
        reject(new Error('Three.js failed to load properly'));
      }
    };
    threeScript.onerror = () => {
      reject(new Error('Failed to load Three.js from local file'));
    };

    document.head.appendChild(threeScript);
  });
};

/**
 * p5.js를 로컬 파일에서 로드
 */
export const loadLocalP5 = (): Promise<any> => {
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
    p5Script.src = getLibraryUrl('p5.min.js');
    p5Script.onload = () => {
      p5Loaded = true;
      if ((window as any).p5) {
        resolve((window as any).p5);
      } else {
        reject(new Error('p5.js failed to load properly'));
      }
    };
    p5Script.onerror = () => {
      reject(new Error('Failed to load p5.js from local file'));
    };

    document.head.appendChild(p5Script);
  });
};

/**
 * 필요한 라이브러리들을 병렬로 로드
 */
export const loadRequiredLibraries = async (needsP5 = false) => {
  try {
    const THREE = await loadLocalThree();
    
    let p5: any;
    if (needsP5) {
      p5 = await loadLocalP5();
    }

    return {
      THREE,
      ...(needsP5 && { p5 })
    };
  } catch (error) {
    console.error('Failed to load required libraries:', error);
    throw error;
  }
};

/**
 * 라이브러리 로드 상태 확인
 */
export const getLibraryStatus = () => ({
  threeLoaded,
  p5Loaded,
  threeAvailable: !!(window as any).THREE,
  p5Available: !!(window as any).p5
});
