# Vanta React - CDN Optimized

> [한국어 문서](./README-ko.md) | [CDN Guide](./README-CDN.md) | English

A React component library for Vanta.js animated backgrounds with **CDN-first architecture** for ultra-lightweight bundles.

## 🌟 CDN-First Benefits

- 📦 **Ultra-Light Bundle**: ~18KB (vs 1.9MB with bundled libraries)
- 🌐 **CDN Loading**: Three.js, p5.js, and Vanta loaded from CDN
- ⚡ **Faster Loading**: Cached libraries across websites
- 🔄 **Auto-Updates**: Always get the latest library versions
- 🛡️ **Smart Fallbacks**: Built-in error handling and recovery

## ✨ Features

- 🎨 **14 Vanta Effects Supported** - net, waves, birds, cells, and more
- 🔧 **Full TypeScript Support** - Type safety and IntelliSense out of the box
- ⚛️ **React 16 Compatible** - Works with legacy projects
- 🎯 **Flexible Usage** - Full screen background or container mode
- 🧹 **Automatic Memory Management** - Auto cleanup on component unmount
- 🌐 **CDN Dependencies** - Three.js and p5.js loaded from jsdelivr CDN
- 🔄 **Dynamic Loading** - Effects are loaded on demand from CDN
- 🛡️ **Error Boundaries** - Built-in error handling with recovery options

## Installation

```bash
# npm
npm install vanta-react

# yarn
yarn add vanta-react

# pnpm
pnpm add vanta-react
```

## Quick Start

### 1. Initialize CDN Libraries

```tsx
import React, { useEffect, useState } from 'react';
import { Vanta, preloadLibraries } from 'vanta-react';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLibraries = async () => {
      try {
        // Load Three.js and p5.js from CDN
        await preloadLibraries();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load libraries:', error);
      }
    };

    initLibraries();
  }, []);

  if (!isReady) {
    return <div>Loading libraries from CDN...</div>;
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

### 2. Full Screen Background

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
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

### 3. Container Mode with Style

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
        style={{
          borderRadius: '10px',
          overflow: 'hidden'
        }}
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

## CDN Library Management

### Preload Status Monitoring

```tsx
import { getPreloadStatus, areLibrariesReady } from 'vanta-react';

function StatusMonitor() {
  const status = getPreloadStatus();
  
  return (
    <div>
      <div>Libraries Ready: {areLibrariesReady() ? '✅' : '❌'}</div>
      <div>Load Source: {status.loadSource}</div>
      <div>THREE.js: {status.threeAvailable ? '✅' : '❌'}</div>
      <div>p5.js: {status.p5Available ? '✅' : '❌'}</div>
      {status.hasError && <div>Error: {status.error}</div>}
    </div>
  );
}
```

### Dynamic Effect Loading

```tsx
import { loadVantaEffectFromCdn, getVantaLoadStatus } from 'vanta-react';

async function loadEffect(effectName) {
  try {
    await loadVantaEffectFromCdn(effectName);
    const status = getVantaLoadStatus();
    console.log(`Loaded effects: ${status.loadedEffects.join(', ')}`);
  } catch (error) {
    console.error(`Failed to load ${effectName}:`, error);
  }
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `effect` | `VantaEffectName` | ✅ | The name of the Vanta effect to render |
| `background` | `boolean` | ❌ | `true`: Full screen background, `false`: Container mode (default: `false`) |
| `options` | `Record<string, any>` | ❌ | Configuration options to pass to the Vanta effect |
| `className` | `string` | ❌ | Additional CSS class name to apply |
| `style` | `React.CSSProperties` | ❌ | Inline styles to apply to the container |

## Supported Effects

- `birds` - Animated bird flock
- `cells` - Cell structure animation
- `clouds` - Cloud animation
- `clouds2` - Cloud animation (variant)
- `dots` - Dot animation *(requires p5.js)*
- `fog` - Fog effect
- `globe` - Globe effect
- `halo` - Halo effect
- `net` - Network connection animation
- `rings` - Circular animation
- `ripple` - Ripple effect
- `topology` - Topology animation *(requires p5.js)*
- `trunk` - Tree trunk animation *(requires p5.js)*
- `waves` - Wave animation

### p5.js Effects

Effects marked with *(requires p5.js)* need the p5.js library. The library automatically loads p5.js from CDN when needed.

## Bundle Size Comparison

| Version | Bundle Size | Description |
|---------|-------------|-------------|
| v0.2.0 (Local) | ~1.9 MB | Three.js + p5.js bundled |
| v0.3.0 (CDN) | ~18 KB | CDN-optimized |

**Reduction: 99% smaller bundle size!**

## CDN URLs Used

```javascript
// Three.js
https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js

// p5.js
https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.min.js

// Vanta Effects
https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.{effect}.min.js
```

## Error Handling

### Error Boundary Usage

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

### Manual Error Handling

```tsx
import { preloadLibraries, resetPreloadState } from 'vanta-react';

async function handleLibraryError() {
  try {
    await preloadLibraries();
  } catch (error) {
    console.error('CDN load failed:', error);
    
    // Reset and retry
    resetPreloadState();
    await preloadLibraries();
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import { 
  Vanta, 
  VantaEffectName, 
  VantaProps,
  ErrorBoundary,
  preloadLibraries,
  loadVantaEffectFromCdn,
  type VantaEffectName
} from 'vanta-react';

// Type-safe effect selection
const effect: VantaEffectName = 'net';

// Full type support
const vantaProps: VantaProps = {
  effect: 'waves',
  background: true,
  style: { borderRadius: '10px' },
  options: {
    color: 0x3f7fb3,
    waveHeight: 20,
  },
  className: 'my-vanta-background',
};
```

## Performance Tips

### 1. Preload Popular Effects

```tsx
import { preloadPopularVantaEffects } from 'vanta-react';

// Preload common effects at app startup
useEffect(() => {
  preloadPopularVantaEffects(); // waves, birds, net, clouds, fog
}, []);
```

### 2. Load Multiple Effects

```tsx
import { loadMultipleVantaEffects } from 'vanta-react';

// Load specific effects in parallel
await loadMultipleVantaEffects(['waves', 'birds', 'net']);
```

### 3. Monitor Performance

```tsx
import { getVantaLoadStatus } from 'vanta-react';

const status = getVantaLoadStatus();
console.log(`Loaded ${status.loadedCount} effects`);
console.log(`Loading ${status.loadingCount} effects`);
```

## Migration from v0.2.0

### Breaking Changes

1. **Library Loading**: Must call `preloadLibraries()` before using Vanta components
2. **Bundle Size**: Reduced from 1.9MB to 18KB
3. **Dependencies**: `vanta` package no longer bundled (loaded from CDN)

### Migration Steps

```tsx
// Before (v0.2.0)
import { Vanta } from 'vanta-react';

function App() {
  return <Vanta effect="waves" />;
}

// After (v0.3.0)
import { Vanta, preloadLibraries } from 'vanta-react';

function App() {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    preloadLibraries().then(() => setReady(true));
  }, []);
  
  if (!ready) return <div>Loading...</div>;
  
  return <Vanta effect="waves" />;
}
```

## Compatibility

- **React**: 16.0.0+
- **Three.js**: 0.134+ (loaded from CDN)
- **p5.js**: 1.1.9+ (loaded from CDN when needed)
- **TypeScript**: 4.0+
- **Node.js**: 14+
- **Browsers**: Modern browsers with ES2015+ support

## Development

```bash
# Clone repository
git clone https://github.com/gyuha/vanta-react.git
cd vanta-react

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start CDN demo
pnpm demo:cdn

# Build
pnpm build
```

## License

MIT License

## Contributing

Bug reports, feature requests, and Pull Requests are welcome!

## Support

- [GitHub Issues](https://github.com/gyuha/vanta-react/issues)
- [CDN Documentation](./README-CDN.md)
- [Korean Documentation](./README-ko.md)

---

**🌐 CDN-first architecture for the modern web!** Enjoy ultra-fast loading and minimal bundle sizes with vanta-react v0.3.0.
