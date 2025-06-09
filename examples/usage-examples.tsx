import React from 'react';
import { Vanta } from 'vanta-react';

// 전체 화면 배경으로 사용하는 예제
export function FullScreenExample() {
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
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>전체 화면 배경 예제</h1>
        <p>이 콘텐츠는 Vanta 배경 위에 표시됩니다.</p>
      </div>
    </div>
  );
}

// 컨테이너 모드로 사용하는 예제
export function ContainerExample() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>컨테이너 모드 예제</h1>
      <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        <Vanta
          effect="waves"
          background={false}
          options={{
            color: 0xff6b6b,
            waveHeight: 40,
            waveSpeed: 1,
          }}
        />
      </div>
      <p>위의 박스 안에서만 Vanta 효과가 렌더링됩니다.</p>
    </div>
  );
}

// 여러 효과를 사용하는 예제
export function MultipleEffectsExample() {
  const [currentEffect, setCurrentEffect] = React.useState<'net' | 'waves' | 'birds'>('net');

  return (
    <div>
      <Vanta
        effect={currentEffect}
        background={true}
        options={{
          color: currentEffect === 'net' ? 0x3f7fb3 : currentEffect === 'waves' ? 0xff6b6b : 0x32cd32,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>효과 전환 예제</h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setCurrentEffect('net')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: currentEffect === 'net' ? '#3f7fb3' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Net
          </button>
          <button 
            onClick={() => setCurrentEffect('waves')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: currentEffect === 'waves' ? '#ff6b6b' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Waves
          </button>
          <button 
            onClick={() => setCurrentEffect('birds')}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: currentEffect === 'birds' ? '#32cd32' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Birds
          </button>
        </div>
        <p>버튼을 클릭하여 다른 Vanta 효과로 전환해보세요.</p>
      </div>
    </div>
  );
}
