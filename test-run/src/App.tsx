import './App.css'
import { useState } from 'react';
import { Vanta } from 'vanta-react';

// 커스텀 로딩 컴포넌트 예제
const CustomLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    backgroundColor: '#f0f8ff',
    border: '2px dashed #4a90e2',
    borderRadius: '8px',
    color: '#4a90e2',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
      <div>Custom Vanta Loading...</div>
    </div>
  </div>
);

function App() {
  const [count, setCount] = useState(0);
  const [showCustomLoader, setShowCustomLoader] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Vanta React Test</h1>
      <p>React is working!</p>
      <p>✨ 자동 라이브러리 로딩 기능을 사용합니다 - 별도 설정 불필요!</p>
      
      <div style={{ marginTop: '20px' }}>
        <button type="button" onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
        
        <button 
          type="button" 
          onClick={() => setShowCustomLoader(!showCustomLoader)}
          style={{ marginLeft: '10px' }}
        >
          {showCustomLoader ? '기본 로더 사용' : '커스텀 로더 사용'}
        </button>
      </div>

      <div style={{ marginTop: '20px', height: '200px', position: 'relative' }}>
        {/* 기본 자동 로딩을 사용하는 Vanta 컴포넌트 */}
        {!showCustomLoader ? (
          <Vanta
            effect="net"
            options={{
              color: 0x3f7fb3,
              points: 8.00,
              maxDistance: 23.00,
              spacing: 17.00,
            }}
          />
        ) : (
          /* 커스텀 로딩 UI를 사용하는 Vanta 컴포넌트 */
          <Vanta
            effect="waves"
            loadingComponent={<CustomLoader />}
            onLoadStart={() => console.log('🔄 라이브러리 로딩 시작')}
            onLoadSuccess={() => console.log('✅ 라이브러리 로딩 완료')}
            onLoadError={(error) => console.error('❌ 라이브러리 로딩 실패:', error)}
            options={{
              color: 0x667eea,
              waveHeight: 15,
              waveSpeed: 0.75,
            }}
          />
        )}
      </div>

      {/* 배경 효과용 Vanta 컴포넌트 (항상 표시) */}
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
    </div>
  );
}

export default App
