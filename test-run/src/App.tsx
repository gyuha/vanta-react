import './App.css'
import { useState } from 'react';
import { Vanta } from 'vanta-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Vanta React Test</h1>
      <p>React is working!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Library Status:</h3>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button type="button" onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </div>
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
