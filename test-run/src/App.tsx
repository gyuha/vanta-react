import './App.css'
import React, { useEffect, useState } from 'react';
import { Vanta, preloadLibraries } from 'vanta-react';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLibraries = async () => {
      try {
        console.log('Loading libraries from CDN...');
        await preloadLibraries();
        setIsReady(true);
        console.log('Libraries loaded successfully!');
      } catch (err) {
        console.error('Failed to load libraries:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    initLibraries();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error loading libraries</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Loading libraries from CDN...</h2>
        <p>Please wait while Three.js and p5.js are loaded from CDN.</p>
      </div>
    );
  }

  return (
    <>
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
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Vanta React Test</h1>
        <p>CDN-first architecture working!</p>
      </div>
    </>
  )
}

export default App
