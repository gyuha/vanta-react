# Vanta React

> [한국어 문서](./README-ko.md) | English

A React component library for Vanta.js animated backgrounds with full TypeScript support and React 16 compatibility.

## ✨ Features

- 🎨 **15 Vanta Effects Supported** - net, waves, birds, cells, and more
- 🔧 **Full TypeScript Support** - Type safety and IntelliSense out of the box
- ⚛️ **React 16 Compatible** - Works with legacy projects
- 🎯 **Flexible Usage** - Full screen background or container mode
- 🧹 **Automatic Memory Management** - Auto cleanup on component unmount
- 📦 **Bundled Dependencies** - Three.js and p5.js included for seamless integration
- 🚀 **Performance Monitoring** - Built-in performance monitoring for development
- 🔄 **Dynamic Loading** - Effects are loaded on demand for optimal bundle size

## Installation

```bash
# npm
npm install vanta-react

# yarn
yarn add vanta-react

# pnpm
pnpm add vanta-react
```

## Basic Usage

### Full Screen Background

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

function App() {
  return (
    <div>
      {/* Use as full screen background */}
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
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

### Container Mode

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

### Dynamic Effect Switching

```tsx
import React, { useState } from 'react';
import { Vanta, VantaEffectName } from 'vanta-react';

function DynamicExample() {
  const [effect, setEffect] = useState<VantaEffectName>('net');

  return (
    <div>
      <Vanta effect={effect} background={true} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <button onClick={() => setEffect('waves')}>Waves</button>
        <button onClick={() => setEffect('birds')}>Birds</button>
        <button onClick={() => setEffect('net')}>Net</button>
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `effect` | `VantaEffectName` | ✅ | The name of the Vanta effect to render |
| `background` | `boolean` | ❌ | `true`: Full screen background, `false`: Container mode (default: `false`) |
| `options` | `Record<string, any>` | ❌ | Configuration options to pass to the Vanta effect |
| `className` | `string` | ❌ | Additional CSS class name to apply |

## Supported Effects

- `birds` - Animated bird flock
- `cells` - Cell structure animation
- `clouds` - Cloud animation
- `clouds2` - Cloud animation (variant)
- `fog` - Fog effect
- `globe` - Globe effect
- `net` - Network connection animation
- `rings` - Circular animation
- `halo` - Halo effect
- `ripple` - Ripple effect
- `dots` - Dot animation *(requires p5.js)*
- `topology` - Topology animation *(requires p5.js)*
- `trunk` - Tree trunk animation *(requires p5.js)*
- `waves` - Wave animation

### p5.js Effects

Some effects (`dots`, `topology`, `trunk`) require p5.js in addition to Three.js. This library automatically includes both Three.js and p5.js when needed.

**No additional setup required** - p5.js is automatically provided to effects that need it.

## TypeScript Support

This library provides full TypeScript support:

```tsx
import { Vanta, VantaEffectName, VantaProps } from 'vanta-react';

// Type-safe effect selection
const effect: VantaEffectName = 'net';

// Full type support
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

## Compatibility

- **React**: 16.0.0+
- **Three.js**: 0.134+ (bundled)
- **p5.js**: 1.1.9+ (bundled when needed)
- **TypeScript**: 4.0+
- **Node.js**: 14+

## Development & Testing

```bash
# Clone repository
git clone https://github.com/gyuha/vanta-react.git
cd vanta-react

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build
pnpm build
```

## License

MIT License

## Contributing

Bug reports, feature requests, and Pull Requests are welcome!

## Notes

- Three.js and p5.js are automatically bundled with this library for seamless integration.
- We use Three.js version 0.134 for optimal compatibility with Vanta.js effects.
- Memory cleanup is automatically performed when the component is unmounted.
- Performance monitoring is available in development mode for optimization insights.

## Performance Optimization

### Dynamic Loading
Vanta React uses **dynamic imports** to load effects only when needed, significantly reducing the initial bundle size.

```tsx
import { Vanta, useVantaEffect } from 'vanta-react';

// Effects are loaded dynamically when first used
function DynamicLoadingExample() {
  const [effect, setEffect] = useState<VantaEffectName>('net');
  const { isLoading, error, isLoaded } = useVantaEffect(effect);

  return (
    <div>
      {isLoading && <div>Loading {effect} effect...</div>}
      {error && <div>Error: {error}</div>}
      <Vanta effect={effect} background={true} />
    </div>
  );
}
```

### Bundle Size Analysis
- **Main bundle**: ~45 kB (core library + Three.js + p5.js)
- **Individual effects**: 5-15 kB each (loaded on demand)
- **Total if all effects loaded**: ~150 kB
- **Typical usage**: 45-75 kB (1-2 effects)

### Performance Tips

#### 1. Effect Caching
```tsx
// Effects are automatically cached after first load
const [effect, setEffect] = useState('net');

// Switching back to 'net' later will be instant
setEffect('waves'); // Loads waves effect
setEffect('net');   // Uses cached version
```

#### 2. Conditional Loading
```tsx
// Only load effects when actually needed
function ConditionalExample() {
  const [showBackground, setShowBackground] = useState(false);
  
  return (
    <div>
      {showBackground && <Vanta effect="waves" background={true} />}
      <button onClick={() => setShowBackground(!showBackground)}>
        Toggle Background
      </button>
    </div>
  );
}
```

#### 3. Memory Management
```tsx
// Components automatically clean up when unmounted
useEffect(() => {
  // Optional: Clear cache when component unmounts
  return () => {
    if (shouldClearCache) {
      clearEffectCache();
    }
  };
}, []);
```

#### 4. Performance Monitoring (Development Mode)
You can monitor effect loading performance in development mode:

```tsx
function PerformanceExample() {
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Vanta rendering time: ${end - start}ms`);
    };
  }, []);

  return <Vanta effect="net" background={true} />;
}
```
