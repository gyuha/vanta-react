# Vanta React

> **한국어** | [English](./README.md)

React 16+ 호환성과 완전한 TypeScript 지원을 제공하는 **CDN 우선 아키텍처** 기반 Vanta.js 애니메이션 배경 컴포넌트 라이브러리입니다. **자동 라이브러리 로딩** 기능으로 설정 없이 바로 사용할 수 있습니다.

## 🌟 주요 특징

- 📦 **초경량 번들**: ~21KB CDN 최적화 패키지
- 🚀 **제로 설정**: 설치 후 바로 사용 - 자동 라이브러리 로딩
- 🌐 **CDN 최적화**: Three.js, p5.js, Vanta를 CDN에서 자동 로드
- ⚡ **스마트 캐싱**: 웹사이트 간 라이브러리 캐시 공유
- 🛡️ **에러 복구**: 내장된 재시도 및 폴백 메커니즘
- 🎨 **14가지 효과**: 전체 Vanta 효과 라이브러리 지원
- 🔧 **TypeScript**: 완전한 타입 안전성
- ⚛️ **React 16+**: 레거시 및 모던 React 호환
- 🔇 **조용한 동작**: 디버그 메시지 없는 깔끔한 콘솔 출력

## 설치

```bash
# npm
npm install vanta-react

# yarn
yarn add vanta-react

# pnpm
pnpm add vanta-react
```

## 사용법

### 기본 사용법

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

function App() {
  return (
    <Vanta
      effect="waves"
      options={{
        mouseControls: true,
        touchControls: true,
        color: 0x3f6b7d
      }}
    />
  );
}
```

### 전체 화면 배경

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

function FullScreenExample() {
  return (
    <div>
      <Vanta
        effect="net"
        background={true}
        options={{
          color: 0x3f7fb3,
          points: 8.00,
          maxDistance: 23.00,
          spacing: 17.00,
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>여기에 콘텐츠 작성</h1>
      </div>
    </div>
  );
}
```

### 커스텀 로딩 UI

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

const CustomLoader = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    height: '200px',
    backgroundColor: '#f0f8ff',
    border: '2px dashed #4a90e2'
  }}>
    <div>🚀 Vanta 효과 로딩 중...</div>
  </div>
);

function CustomLoadingExample() {
  return (
    <Vanta
      effect="waves"
      loadingComponent={<CustomLoader />}
      onLoadStart={() => console.log('🔄 로딩 시작')}
      onLoadSuccess={() => console.log('✅ 로딩 완료')}
      onLoadError={(error) => console.error('❌ 로딩 실패:', error)}
      options={{ color: 0x667eea }}
    />
  );
```

## 설정

### 기본 동작

기본적으로 Vanta 컴포넌트는 필요한 라이브러리를 자동으로 로드합니다:

```tsx
// 그냥 작동합니다 - 설정 불필요!
<Vanta effect="net" options={{ color: 0x3f7fb3 }} />
```

### Props 참조

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `autoLoad` | `boolean` | `true` | 자동 라이브러리 로딩 활성화/비활성화 |
| `loadingComponent` | `ReactNode` | 내장 스피너 | 커스텀 로딩 UI 컴포넌트 |
| `errorComponent` | `ReactNode \| Function` | 내장 에러 UI | 커스텀 에러 UI 컴포넌트 또는 렌더 함수 |
| `retryCount` | `number` | `3` | 로딩 실패 시 재시도 횟수 |
| `retryDelay` | `number` | `1000` | 재시도 간격 (밀리초) |
| `onLoadStart` | `() => void` | - | 로딩 시작 시 콜백 |
| `onLoadSuccess` | `() => void` | - | 로딩 성공 시 콜백 |
| `onLoadError` | `(error: string) => void` | - | 로딩 실패 시 콜백 |

### 커스텀 에러 처리

```tsx
const CustomErrorComponent = ({ error, retry }) => (
  <div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #ff6b6b' }}>
    <div>❌ Vanta 효과 로딩 실패</div>
    <div style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>{error}</div>
    <button onClick={retry} style={{ padding: '8px 16px' }}>
      🔄 다시 시도
    </button>
  </div>
);

function ErrorHandlingExample() {
  return (
    <Vanta
      effect="waves"
      errorComponent={CustomErrorComponent}
      retryCount={5}
      retryDelay={2000}
      options={{ color: 0x667eea }}
    />
  );
}
```

### 자동 로딩 비활성화 (수동 제어)

수동 제어나 특정 사용 사례를 위해 자동 로딩을 비활성화할 수 있습니다:

```tsx
import React, { useEffect, useState } from 'react';
import { Vanta, preloadLibraries } from 'vanta-react';

function ManualLoadingExample() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadLibraries = async () => {
      try {
        await preloadLibraries();
        setIsReady(true);
      } catch (error) {
        console.error('라이브러리 로딩 실패:', error);
      }
    };

    loadLibraries();
  }, []);

  if (!isReady) {
    return <div>라이브러리 로딩 중...</div>;
  }

  return (
    <Vanta
      effect="net"
      autoLoad={false}  // 자동 로딩 비활성화
      options={{ color: 0x3f7fb3 }}
    />
  );
```

## Props 참조

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `effect` | `VantaEffectName` | ✅ | 렌더링할 Vanta 효과 이름 |
| `background` | `boolean` | ❌ | `true`: 전체 화면 배경, `false`: 컨테이너 모드 (기본값: `false`) |
| `options` | `Record<string, any>` | ❌ | Vanta 효과에 전달할 설정 옵션 |
| `className` | `string` | ❌ | 추가할 CSS 클래스 이름 |
| `style` | `React.CSSProperties` | ❌ | 컨테이너에 적용할 인라인 스타일 |
| `autoLoad` | `boolean` | ❌ | 자동 라이브러리 로딩 활성화/비활성화 (기본값: `true`) |
| `loadingComponent` | `ReactNode` | ❌ | 커스텀 로딩 UI 컴포넌트 |
| `errorComponent` | `ReactNode \| Function` | ❌ | 커스텀 에러 UI 컴포넌트 또는 렌더 함수 |
| `retryCount` | `number` | ❌ | 로딩 실패 시 재시도 횟수 (기본값: `3`) |
| `retryDelay` | `number` | ❌ | 재시도 간격 (밀리초, 기본값: `1000`) |
| `onLoadStart` | `() => void` | ❌ | 로딩 시작 시 콜백 |
| `onLoadSuccess` | `() => void` | ❌ | 로딩 성공 시 콜백 |
| `onLoadError` | `(error: string) => void` | ❌ | 로딩 실패 시 콜백 |

## 지원되는 효과

- `birds` - 새 떼 애니메이션
- `cells` - 세포 구조 애니메이션
- `clouds` - 구름 애니메이션
- `clouds2` - 구름 애니메이션 (변형)
- `dots` - 점 애니메이션 *(p5.js 필요)*
- `fog` - 안개 효과
- `globe` - 지구본 효과
- `halo` - 후광 효과
- `net` - 네트워크 연결 애니메이션
- `rings` - 원형 애니메이션
- `ripple` - 물결 효과
- `topology` - 토폴로지 애니메이션 *(p5.js 필요)*
- `trunk` - 나무 줄기 애니메이션 *(p5.js 필요)*
- `waves` - 파도 애니메이션

### p5.js 효과

*(p5.js 필요)*로 표시된 효과들은 필요할 때 p5.js 라이브러리를 자동으로 로드합니다.

## 고급 사용법

### 수동 라이브러리 관리

```tsx
import { 
  preloadLibraries, 
  loadVantaEffectFromCdn, 
  getVantaLoadStatus,
  areLibrariesReady 
} from 'vanta-react';

// 핵심 라이브러리 프리로드
await preloadLibraries();

// 특정 효과 로드
await loadVantaEffectFromCdn('waves');
await loadVantaEffectFromCdn('birds');

// 상태 확인
const status = getVantaLoadStatus();
console.log('로드된 효과:', status.loadedEffects);
console.log('라이브러리 준비:', areLibrariesReady());
```

### 성능 최적화

```tsx
import { preloadPopularVantaEffects, loadMultipleVantaEffects } from 'vanta-react';

// 앱 시작 시 인기 효과 프리로드
useEffect(() => {
  preloadPopularVantaEffects(); // waves, birds, net, clouds, fog
}, []);

// 여러 효과를 병렬로 로드
await loadMultipleVantaEffects(['waves', 'birds', 'net']);
```

### 에러 바운더리 사용

```tsx
import { ErrorBoundary } from 'vanta-react';

function App() {
  return (
    <ErrorBoundary>
      <Vanta effect="waves" background={true} />
    </ErrorBoundary>
  );
}
```

### 동적 효과 전환

```tsx
import React, { useState } from 'react';
import { Vanta, VantaEffectName } from 'vanta-react';

function DynamicExample() {
  const [effect, setEffect] = useState<VantaEffectName>('net');

  return (
    <div>
      <Vanta effect={effect} background={true} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <button onClick={() => setEffect('waves')}>파도</button>
        <button onClick={() => setEffect('birds')}>새떼</button>
        <button onClick={() => setEffect('net')}>네트워크</button>
      </div>
    </div>
  );
}
```

## Props

| Prop | 타입 | 필수 | 설명 |
|------|------|----------|-------------|
| `effect` | `VantaEffectName` | ✅ | 렌더링할 Vanta 효과명 |
| `background` | `boolean` | ❌ | `true`: 전체 화면 배경, `false`: 컨테이너 모드 (기본값: `false`) |
| `options` | `Record<string, any>` | ❌ | Vanta 효과에 전달할 설정 옵션 |
| `className` | `string` | ❌ | 추가할 CSS 클래스명 |

## 지원되는 효과들

- `birds` - 새떼 애니메이션
- `cells` - 셀 구조 애니메이션
- `clouds` - 구름 애니메이션
- `clouds2` - 구름 애니메이션 (변형)
- `fog` - 안개 효과
- `globe` - 지구본 효과
- `net` - 네트워크 연결 애니메이션
- `rings` - 원형 애니메이션
- `halo` - 후광 효과
- `ripple` - 물결 효과
```

## TypeScript 지원

완전한 TypeScript 지원으로 포괄적인 타입 정의를 제공합니다:

```tsx
import { 
  Vanta, 
  VantaEffectName, 
  VantaProps,
  ErrorBoundary,
  preloadLibraries,
  loadVantaEffectFromCdn,
  type VantaEffect
} from 'vanta-react';

// 타입 안전한 효과 선택
const effect: VantaEffectName = 'net';

// props에 대한 완전한 타입 지원
const vantaProps: VantaProps = {
  effect: 'waves',
  background: true,
  style: { borderRadius: '10px' },
  options: {
    color: 0x3f7fb3,
    waveHeight: 20,
  },
  className: 'my-vanta-background',
  onLoadSuccess: () => console.log('로드됨!'),
};
```

## 사용되는 CDN URL

```javascript
// Three.js (v0.134.0 - Vanta.js 호환 버전)
https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js

// p5.js (v1.1.9 - 안정 버전)
https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.min.js

// Vanta 효과 (최신)
https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.{effect}.min.js
```

## 에러 처리

### 내장 에러 복구

```tsx
// 커스텀 설정으로 자동 재시도
<Vanta
  effect="net"
  retryCount={5}
  retryDelay={2000}
  onLoadError={(error) => {
    console.error('로딩 실패:', error);
    // 에러 추적 서비스로 전송
  }}
/>
```

### 수동 에러 처리

```tsx
import { preloadLibraries, resetPreloadState } from 'vanta-react';

async function handleLibraryError() {
  try {
    await preloadLibraries();
  } catch (error) {
    console.error('CDN 로드 실패:', error);
    
    // 재설정 후 재시도
    resetPreloadState();
    await preloadLibraries();
  }
}
```

## 성능 팁

### 1. 인기 효과 프리로드

```tsx
import { preloadPopularVantaEffects } from 'vanta-react';

// 앱 시작 시 일반적인 효과 프리로드
useEffect(() => {
  preloadPopularVantaEffects(); // waves, birds, net, clouds, fog
}, []);
```

### 2. 여러 효과 로드

```tsx
import { loadMultipleVantaEffects } from 'vanta-react';

// 특정 효과들을 병렬로 로드
await loadMultipleVantaEffects(['waves', 'birds', 'net']);
```

### 3. 성능 모니터링

```tsx
import { getVantaLoadStatus } from 'vanta-react';

const status = getVantaLoadStatus();
console.log(`로드된 효과 ${status.loadedCount}개`);
console.log(`로딩 중인 효과 ${status.loadingCount}개`);
```

## 호환성

- **React**: 16.0.0+
- **TypeScript**: 4.0+
- **Three.js**: 0.134+ (CDN에서 자동 로드)
- **p5.js**: 1.1.9+ (필요시 자동 로드)
- **Node.js**: 14+
- **브라우저**: ES2015+ 지원 모던 브라우저

## 개발

```bash
# 저장소 클론
git clone https://github.com/gyuha/vanta-react.git
cd vanta-react

# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 빌드
pnpm build
```

## 문제 해결

### 일반적인 문제

1. **첫 로드 시 빈 화면**
   - 브라우저 콘솔에서 오류 확인
   - CDN 접근성 확인
   - 광고 차단기 비활성화 시도

2. **TypeScript 오류**
   ```bash
   pnpm add -D @types/react @types/react-dom
   ```

3. **효과가 렌더링되지 않음**
   ```tsx
   // 라이브러리 로드 상태 확인
   import { areLibrariesReady, getPreloadStatus } from 'vanta-react';
   
   console.log('준비:', areLibrariesReady());
   console.log('상태:', getPreloadStatus());
   ```

## 기여하기

버그 리포트, 기능 요청, Pull Request를 환영합니다!

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 라이센스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 지원

- [GitHub Issues](https://github.com/gyuha/vanta-react/issues)
- [문서](https://github.com/gyuha/vanta-react#readme)
- [예제](./examples/)

---

**🚀 React용 초고속, 자동 로딩 Vanta.js 배경!**  

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 성능 최적화

### 동적 로딩
Vanta React는 **동적 import**를 사용하여 필요한 효과만 로드하므로 초기 번들 크기를 크게 줄입니다.

```tsx
import { Vanta, useVantaEffect } from 'vanta-react';

// 효과는 처음 사용될 때 동적으로 로드됩니다
function DynamicLoadingExample() {
  const [effect, setEffect] = useState<VantaEffectName>('net');
  const { isLoading, error, isLoaded } = useVantaEffect(effect);

  return (
    <div>
      {isLoading && <div>{effect} 효과 로딩 중...</div>}
      {error && <div>오류: {error}</div>}
      <Vanta effect={effect} background={true} />
    </div>
  );
}
```

### 번들 크기 분석
- **메인 번들**: ~45 kB (핵심 라이브러리 + Three.js + p5.js)
- **개별 효과**: 각각 5-15 kB (필요시 로드)
- **모든 효과 로드시 총합**: ~150 kB
- **일반적인 사용**: 45-75 kB (1-2개 효과)

### 성능 최적화 팁

#### 1. 효과 캐싱
```tsx
// 효과는 첫 로드 후 자동으로 캐시됩니다
const [effect, setEffect] = useState('net');

// 나중에 'net'으로 다시 전환하면 즉시 표시됩니다
setEffect('waves'); // waves 효과 로드
setEffect('net');   // 캐시된 버전 사용
```

#### 2. 조건부 로딩
```tsx
// 실제로 필요할 때만 효과를 로드합니다
function ConditionalExample() {
  const [showBackground, setShowBackground] = useState(false);
  
  return (
    <div>
      {showBackground && <Vanta effect="waves" background={true} />}
      <button onClick={() => setShowBackground(!showBackground)}>
        배경 토글
      </button>
    </div>
  );
}
```

#### 3. 메모리 관리
```tsx
// 컴포넌트는 언마운트 시 자동으로 정리됩니다
useEffect(() => {
  // 선택사항: 컴포넌트 언마운트 시 캐시 정리
  return () => {
    if (shouldClearCache) {
      clearEffectCache();
    }
  };
}, []);
```

#### 4. 성능 모니터링 (개발 모드)
개발 모드에서는 효과 로딩 성능을 모니터링할 수 있습니다:

```tsx
function PerformanceExample() {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Vanta 렌더링 시간: ${end - start}ms`);
    };
  }, []);

  return <Vanta effect="net" background={true} />;
}
```

## 고급 사용법

### 커스텀 스타일링
```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

function CustomStyledVanta() {
  return (
    <div className="vanta-container">
      <Vanta
        effect="net"
        className="my-custom-vanta"
        background={false}
        options={{
          color: 0x3f7fb3,
          backgroundColor: 0x0a0a0a,
        }}
      />
      <style jsx>{`
        .vanta-container {
          position: relative;
          width: 100%;
          height: 500px;
          border-radius: 12px;
          overflow: hidden;
        }
        .my-custom-vanta {
          border-radius: inherit;
        }
      `}</style>
    </div>
  );
}
```

### 반응형 배경
```tsx
import React, { useState, useEffect } from 'react';
import { Vanta, VantaEffectName } from 'vanta-react';

function ResponsiveVanta() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effect: VantaEffectName = isMobile ? 'waves' : 'net';
  const options = isMobile 
    ? { waveHeight: 20, waveSpeed: 0.5 }
    : { points: 10, maxDistance: 20 };

  return (
    <Vanta 
      effect={effect} 
      background={true} 
      options={options} 
    />
  );
}
```

## 문제 해결

### 일반적인 문제들

1. **Three.js 버전 호환성 오류**
   ```
   해결법: Three.js 0.134 버전 사용 (번들에 포함됨)
   추가 설치 불필요
   ```

2. **컴포넌트가 렌더링되지 않음**
   ```
   원인: DOM 요소가 마운트되기 전에 Vanta 초기화
   해결법: useEffect와 ref를 올바르게 사용하는지 확인
   ```

3. **메모리 누수**
   ```
   원인: Vanta 인스턴스가 정리되지 않음
   해결법: 컴포넌트에서 자동 정리 처리됨 (수동 처리 불필요)
   ```

### 성능 모니터링
```tsx
import React, { useEffect } from 'react';
import { Vanta } from 'vanta-react';

function MonitoredVanta() {
  useEffect(() => {
    // 성능 측정
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Vanta 렌더링 시간: ${end - start}ms`);
    };
  }, []);

  return <Vanta effect="net" background={true} />;
}
```

## 라이선스

MIT License

## 기여

버그 리포트, 기능 제안, Pull Request를 환영합니다!

1. 포크하기
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 참고사항

- Three.js와 p5.js가 라이브러리에 자동으로 번들되어 원활한 통합을 제공합니다.
- Vanta.js 효과와의 최적 호환성을 위해 Three.js 0.134 버전을 사용합니다.
- 컴포넌트가 언마운트될 때 자동으로 메모리 정리가 수행됩니다.
- 모바일 환경에서는 성능을 위해 간단한 효과 사용을 권장합니다.
- 개발 모드에서 최적화 인사이트를 위한 성능 모니터링이 제공됩니다.

## 관련 링크

- [Vanta.js 공식 사이트](https://www.vantajs.com/)
- [Three.js 문서](https://threejs.org/docs/)
- [React 문서](https://reactjs.org/docs/)

---

**📖 Documentation:** [English](README.md) | **한국어** (현재)
