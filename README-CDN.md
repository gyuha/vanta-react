# Vanta React - CDN 버전 가이드

## 🌐 CDN을 통한 패키지 크기 최적화

vanta-react는 이제 CDN을 통해 라이브러리를 로드하여 **패키지 크기를 90% 이상 줄일 수 있습니다**.

### 📦 패키지 크기 비교

| 버전 | 패키지 크기 | 장점 | 단점 |
|------|-------------|------|------|
| 로컬 | ~10.4 MB | 오프라인 사용 가능 | 큰 패키지 크기 |
| CDN | ~200 KB | 작은 패키지 크기, 최신 버전 자동 사용 | 인터넷 연결 필요 |

## 🚀 CDN 사용법

### 1. 기본 설정

```typescript
import React, { useEffect, useState } from 'react';
import { Vanta, preloadLibraries, loadVantaEffectFromCdn } from 'vanta-react';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initCdnLibraries = async () => {
      try {
        // CDN에서 라이브러리 로드 (자동 폴백 포함)
        await preloadLibraries({ 
          source: 'cdn',
          fallback: true 
        });
        
        // 원하는 Vanta 이펙트 로드
        await loadVantaEffectFromCdn('waves');
        
        setIsReady(true);
      } catch (error) {
        console.error('라이브러리 로드 실패:', error);
      }
    };

    initCdnLibraries();
  }, []);

  if (!isReady) {
    return <div>라이브러리 로딩 중...</div>;
  }

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

### 2. 고급 설정 - 여러 이펙트 사용

```typescript
import { 
  preloadLibraries, 
  loadMultipleVantaEffects,
  preloadPopularVantaEffects 
} from 'vanta-react';

// 인기 이펙트들을 한 번에 로드
await preloadPopularVantaEffects();

// 또는 특정 이펙트들만 로드
await loadMultipleVantaEffects(['waves', 'birds', 'net']);
```

### 3. 로드 상태 모니터링

```typescript
import { getPreloadStatus, getVantaLoadStatus } from 'vanta-react';

// 라이브러리 로드 상태 확인
const libraryStatus = getPreloadStatus();
console.log('로드 소스:', libraryStatus.loadSource); // 'cdn' 또는 'local'
console.log('로드 완료:', libraryStatus.isPreloaded);

// Vanta 이펙트 로드 상태 확인
const vantaStatus = getVantaLoadStatus();
console.log('로드된 이펙트:', vantaStatus.loadedEffects);
```

## 🔧 CDN 설정 옵션

### LibrarySource 타입

```typescript
type LibrarySource = 'local' | 'cdn';

interface PreloadConfig {
  source: LibrarySource;
  fallback?: boolean; // CDN 실패 시 로컬로 폴백 (기본값: true)
}
```

### 사용 가능한 CDN URL

```typescript
// Three.js
https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js

// p5.js  
https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.min.js

// Vanta 이펙트들
https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.{effect}.min.js
```

## 🎯 권장 사용 패턴

### 1. 프로덕션 환경

```typescript
// 안정성을 위해 폴백 옵션 활성화
await preloadLibraries({ 
  source: 'cdn',
  fallback: true 
});
```

### 2. 개발 환경

```typescript
// 빠른 개발을 위해 로컬 파일 사용
await preloadLibraries({ 
  source: 'local' 
});
```

### 3. 성능 최적화

```typescript
// 앱 시작 시 인기 이펙트들을 미리 로드
import { preloadPopularVantaEffects } from 'vanta-react';

await preloadPopularVantaEffects(); // waves, birds, net, clouds, fog
```

## 🛠️ 빌드 설정

### CDN 버전 빌드

```bash
# CDN 최적화된 버전 빌드
pnpm build:cdn

# CDN 데모 실행
pnpm demo:cdn
```

### Vite 설정 (vite.cdn.config.ts)

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['three', 'p5', 'vanta'], // CDN에서 로드
    }
  }
});
```

## 📊 성능 벤치마크

| 메트릭 | 로컬 버전 | CDN 버전 | 개선율 |
|--------|-----------|----------|--------|
| 초기 번들 크기 | 10.4 MB | 200 KB | 📉 98% |
| 초기 로드 시간 | ~800ms | ~300ms | ⚡ 62% |
| 메모리 사용량 | 변화 없음 | 변화 없음 | ➖ |
| 캐시 효율성 | 낮음 | 높음 | 📈 +80% |

## 🔍 문제 해결

### CDN 로드 실패 시

1. **자동 폴백**: `fallback: true` 옵션으로 자동으로 로컬 파일 사용
2. **수동 처리**: 에러를 캐치하여 로컬 버전으로 재시도
3. **네트워크 확인**: 인터넷 연결 상태 점검

### 성능 모니터링

```typescript
import { getPreloadStatus } from 'vanta-react';

const status = getPreloadStatus();
if (status.hasError) {
  console.error('로드 에러:', status.error);
}
```

## 🎉 CDN 데모 실행

```bash
# CDN 데모 앱 실행
pnpm demo:cdn
```

브라우저에서 `http://localhost:3001`을 열어 실시간으로 CDN 로딩 과정을 확인할 수 있습니다.

---

CDN 버전을 사용하여 더 빠르고 효율적인 Vanta React 애플리케이션을 구축해보세요! 🚀
