# Vanta React - 로컬 라이브러리 사용 가이드

## 개요
이 프로젝트는 Vanta.js React 애플리케이션에서 CDN 대신 로컬 파일을 사용하도록 수정되었습니다.

## 변경사항

### 1. 로컬 라이브러리 파일 추가
- `public/lib/three.min.js` - Three.js 라이브러리 (Three.js v0.140.2와 호환)
- `public/lib/p5.min.js` - p5.js 라이브러리 (v1.4.0)

### 2. 새로운 유틸리티 생성
- `src/utils/local-library-loader.ts` - 로컬 라이브러리 파일을 동적으로 로드하는 유틸리티
- `src/lib/three.d.ts` - Three.js 타입 선언 파일
- `src/lib/p5.d.ts` - p5.js 타입 선언 파일

### 3. Vanta 컴포넌트 수정
- `src/components/vanta.tsx`에서 CDN 대신 로컬 라이브러리 로더 사용
- Three.js와 p5.js를 동적으로 로드하여 window 객체에서 접근

### 4. 테스트 컴포넌트 추가
- `dev/test-local-libraries.tsx` - 라이브러리 로드 상태를 실시간으로 확인할 수 있는 테스트 컴포넌트
- `public/test-libraries.html` - 순수 JavaScript로 라이브러리 로드를 테스트하는 페이지

## 사용 방법

### 로컬 라이브러리 사용 활성화
```tsx
import { Vanta } from 'vanta-react';

// 기본 사용법 (Three.js만 필요한 효과)
<Vanta
  effect="net"
  options={{
    color: 0x3f7fb3,
    points: 8.00,
    maxDistance: 23.00,
    spacing: 17.00,
  }}
/>

// p5.js가 필요한 효과 (dots, topology, trunk)
<Vanta
  effect="dots"
  options={{
    color: 0xff6b6b,
    size: 3,
    spacing: 35,
  }}
/>
```

### 라이브러리 상태 확인
```tsx
import { getLibraryStatus } from 'vanta-react/utils/local-library-loader';

// 라이브러리 로드 상태 확인
const status = getLibraryStatus();
console.log(status);
// {
//   threeLoaded: boolean,
//   p5Loaded: boolean,
//   threeAvailable: boolean,
//   p5Available: boolean
// }
```

## 기술적 세부사항

### 동적 라이브러리 로딩
- Three.js와 p5.js는 필요할 때만 동적으로 로드됩니다
- 중복 로딩을 방지하기 위한 캐싱 메커니즘이 구현되어 있습니다
- 로딩 상태와 오류 처리가 포함되어 있습니다

### 효과별 라이브러리 요구사항
- **Three.js만 필요**: birds, cells, clouds, clouds2, fog, globe, net, rings, halo, ripple, waves
- **Three.js + p5.js 필요**: dots, topology, trunk

### 파일 구조
```
public/
  lib/
    three.min.js    # Three.js 라이브러리
    p5.min.js       # p5.js 라이브러리
    
src/
  utils/
    local-library-loader.ts  # 라이브러리 로더 유틸리티
  lib/
    three.d.ts      # Three.js 타입 선언
    p5.d.ts         # p5.js 타입 선언
  components/
    vanta.tsx       # 수정된 Vanta 컴포넌트
```

## 브라우저 호환성
- 모든 모던 브라우저에서 지원
- ES6 동적 import를 사용하므로 IE11은 지원하지 않음

## 성능 최적화
- 필요한 라이브러리만 로드
- 로드된 라이브러리는 캐시되어 재사용
- 중복 로딩 방지

## 문제 해결

### 라이브러리 로드 실패
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. `/lib/three.min.js`와 `/lib/p5.min.js` 파일이 정상적으로 로드되는지 확인
3. 콘솔에서 오류 메시지 확인

### 타입 오류
- TypeScript에서 라이브러리 타입을 인식하지 못하는 경우, `src/lib/` 디렉토리의 `.d.ts` 파일들이 올바르게 설정되어 있는지 확인

## 개발 및 테스트

### 개발 서버 실행
```bash
pnpm dev
```

### 라이브러리 테스트
1. `http://localhost:5174/test-libraries.html` - 순수 JavaScript 테스트
2. `http://localhost:5174/` - React 컴포넌트 테스트 (하단 테스트 섹션 참조)

## 주의사항
- Three.js 버전은 Vanta.js와의 호환성을 위해 v0.140.2를 사용합니다
- p5.js는 v1.4.0을 사용합니다
- 라이브러리 파일 경로를 변경할 경우 `local-library-loader.ts`의 경로도 함께 수정해야 합니다
