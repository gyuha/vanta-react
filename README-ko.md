# Vanta React 배경 효과

React 16 호환성과 완전한 TypeScript 지원을 제공하는 Vanta.js 애니메이션 배경 컴포넌트 라이브러리입니다.

## ✨ 특징

- 🎨 **15가지 Vanta 효과 지원** - net, waves, birds, cells 등 다양한 효과
- 🔧 **완전한 TypeScript 지원** - 타입 안전성과 IntelliSense 제공
- ⚛️ **React 16 호환** - 레거시 프로젝트에서도 사용 가능
- 🎯 **유연한 사용법** - 전체 화면 배경 또는 컨테이너 모드
- 🧹 **자동 메모리 관리** - 컴포넌트 언마운트 시 자동 정리
- 📦 **트리 쉐이킹 지원** - 사용하는 효과만 번들에 포함

## 설치

```bash
# npm
npm install vanta-react three react

# yarn
yarn add vanta-react three react

# pnpm
pnpm add vanta-react three react
```

## 기본 사용법

### 전체 화면 배경

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

function App() {
  return (
    <div>
      {/* 전체 화면 배경으로 사용 */}
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
        <h1>여기에 콘텐츠를 넣으세요</h1>
      </div>
    </div>
  );
}
```

### 컨테이너 모드

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

function ContainerExample() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Vanta
        effect="waves"
        background={false}
        className="custom-vanta-container"
        options={{
          color: 0xff6b6b,
          waveHeight: 40,
          waveSpeed: 1,
        }}
      />
    </div>
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
- `dots` - 점 애니메이션
- `topology` - 지형 애니메이션
- `trunk` - 나무 줄기 애니메이션
- `waves` - 파도 애니메이션

## TypeScript 지원

이 라이브러리는 완전한 TypeScript 지원을 제공합니다:

```tsx
import { Vanta, VantaEffectName, VantaProps } from 'vanta-react';

// 타입 안전한 효과 선택
const effect: VantaEffectName = 'net';

// 완전한 타입 지원
const vantaProps: VantaProps = {
  effect: 'waves',
  background: true,
  options: {
    color: 0x3f7fb3,
    waveHeight: 20,
  },
  className: 'my-vanta-background',
};
```

## 호환성

- **React**: 16.0.0+
- **Three.js**: 0.140.2+ (권장)
- **TypeScript**: 4.0+
- **Node.js**: 14+

## 개발 및 테스트

```bash
# 저장소 클론
git clone https://github.com/your-username/vanta-react.git
cd vanta-react

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 성능 최적화 팁

### 1. 필요한 효과만 import
```tsx
// 권장: 정적 import로 최적화
import { Vanta } from 'vanta-react';

// 사용할 효과만 명시적으로 선택
<Vanta effect="net" />
```

### 2. 옵션 메모이제이션
```tsx
import React, { useMemo } from 'react';
import { Vanta } from 'vanta-react';

function OptimizedComponent() {
  const vantaOptions = useMemo(() => ({
    color: 0x3f7fb3,
    points: 8.00,
    maxDistance: 23.00,
  }), []);

  return <Vanta effect="net" options={vantaOptions} />;
}
```

### 3. 조건부 렌더링
```tsx
import React, { useState } from 'react';
import { Vanta } from 'vanta-react';

function ConditionalBackground() {
  const [showBackground, setShowBackground] = useState(true);

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
   해결법: Three.js 0.140.2 버전 사용 권장
   npm install three@0.140.2
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

- Vanta.js는 Three.js에 의존하므로 반드시 Three.js도 함께 설치해야 합니다.
- Three.js 버전 호환성을 위해 0.140.2 버전 사용을 권장합니다.
- 컴포넌트가 언마운트될 때 자동으로 메모리 정리가 수행됩니다.
- 모바일 환경에서는 성능을 위해 간단한 효과 사용을 권장합니다.

## 관련 링크

- [Vanta.js 공식 사이트](https://www.vantajs.com/)
- [Three.js 문서](https://threejs.org/docs/)
- [React 문서](https://reactjs.org/docs/)

---

**📖 Documentation:** [English](README.md) | **한국어** (현재)
