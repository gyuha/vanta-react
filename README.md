# Vanta React

> [한국어 문서](./README-ko.md) | English

A React component library for Vanta.js animated backgrounds with **CDN-first architecture** for ultra-lightweight bundles and **automatic library loading**.

## 🌟 Key Features

- 📦 **Ultra-Light Bundle**: ~18KB (vs 1.9MB with bundled libraries)
- 🔄 **Automatic Loading**: No manual setup required - just pass props!
- 🌐 **CDN Optimized**: Three.js, p5.js, and Vanta loaded from CDN
- ⚡ **Smart Caching**: Cached libraries across websites
- 🛡️ **Error Recovery**: Built-in retry and fallback mechanisms
- 🎨 **14 Vanta Effects**: Full effect library support
- 🔧 **TypeScript**: Complete type safety out of the box
- ⚛️ **React 16+**: Compatible with legacy and modern React

## ✨ Latest Update (v0.4.0+)

**Automatic Library Loading** - No more manual `preloadLibraries()` calls!

```tsx
// ✅ New way (v0.4.0+) - Just use it!
<Vanta effect="net" options={{ color: 0x3f7fb3 }} />

// ❌ Old way (v0.3.0) - Manual preloading required
const [ready, setReady] = useState(false);
useEffect(() => {
  preloadLibraries().then(() => setReady(true));
}, []);
if (!ready) return <div>Loading...</div>;
return <Vanta effect="net" />;
```

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

### 1. Basic Usage (Automatic Loading)

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

### 3. Custom Loading UI

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
    <div>🚀 Loading Vanta Effect...</div>
  </div>
);

function CustomLoadingExample() {
  return (
    <Vanta
      effect="waves"
      loadingComponent={<CustomLoader />}
      onLoadStart={() => console.log('🔄 Loading started')}
      onLoadSuccess={() => console.log('✅ Loading completed')}
      onLoadError={(error) => console.error('❌ Loading failed:', error)}
      options={{ color: 0x667eea }}
    />
  );
}
```
```

## 🚀 Auto-Loading Feature (v0.4.0+)

Starting from v0.4.0, Vanta React includes **automatic library loading** functionality. No more manual `preloadLibraries()` calls required!

### Simple Usage (Recommended)

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

function App() {
  return (
    <div>
      {/* Libraries are automatically loaded - no setup required! */}
      <Vanta
        effect="waves"
        options={{
          color: 0x3f6b7d,
          waveHeight: 20,
        }}
      />
    </div>
  );
}
```

### Custom Loading UI

```tsx
import React from 'react';
import { Vanta } from 'vanta-react';

const CustomLoader = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <div>🌐 Loading Vanta Effects...</div>
  </div>
);

function AppWithCustomLoader() {
  return (
    <Vanta
      effect="net"
      loadingComponent={<CustomLoader />}
      onLoadStart={() => console.log('Loading started')}
      onLoadSuccess={() => console.log('Loading completed')}
      onLoadError={(error) => console.error('Loading failed:', error)}
      options={{ color: 0x3f7fb3 }}
    />
  );
}
```

## Auto-Loading Configuration

### Default Behavior

By default, Vanta components automatically load required libraries:

```tsx
// ✅ Just works - no setup needed!
<Vanta effect="net" options={{ color: 0x3f7fb3 }} />
```

### Auto-Loading Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoLoad` | `boolean` | `true` | Enable/disable automatic library loading |
| `loadingComponent` | `ReactNode` | Built-in spinner | Custom loading UI component |
| `errorComponent` | `ReactNode \| Function` | Built-in error UI | Custom error UI component or render function |
| `retryCount` | `number` | `3` | Number of retry attempts on loading failure |
| `retryDelay` | `number` | `1000` | Delay between retries (milliseconds) |
| `onLoadStart` | `() => void` | - | Callback when loading starts |
| `onLoadSuccess` | `() => void` | - | Callback when loading succeeds |
| `onLoadError` | `(error: string) => void` | - | Callback when loading fails |

### Custom Error Handling

```tsx
const CustomErrorComponent = ({ error, retry }) => (
  <div style={{ padding: '20px', textAlign: 'center', border: '2px dashed #ff6b6b' }}>
    <div>❌ Failed to load Vanta effect</div>
    <div style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>{error}</div>
    <button onClick={retry} style={{ padding: '8px 16px' }}>
      🔄 Retry
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

### Disabling Auto-Loading (Legacy Mode)

For manual control or testing, you can disable auto-loading:

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
        console.error('Failed to load libraries:', error);
      }
    };

    loadLibraries();
  }, []);

  if (!isReady) {
    return <div>Loading libraries...</div>;
  }

  return (
    <Vanta
      effect="net"
      autoLoad={false}  // Disable auto-loading
      options={{ color: 0x3f7fb3 }}
    />
  );
}

```tsx
import React, { useEffect, useState } from 'react';
import { Vanta, preloadLibraries } from 'vanta-react';

function LegacyApp() {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    preloadLibraries().then(() => setReady(true));
  }, []);
  
  if (!ready) return <div>Loading...</div>;
  
  return (
    <Vanta
      effect="waves"
      autoLoad={false}  // Disable auto-loading
      options={{ color: 0x3f6b7d }}
    />
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

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `effect` | `VantaEffectName` | ✅ | The name of the Vanta effect to render |
| `background` | `boolean` | ❌ | `true`: Full screen background, `false`: Container mode (default: `false`) |
| `options` | `Record<string, any>` | ❌ | Configuration options to pass to the Vanta effect |
| `className` | `string` | ❌ | Additional CSS class name to apply |
| `style` | `React.CSSProperties` | ❌ | Inline styles to apply to the container |
| `autoLoad` | `boolean` | ❌ | Enable/disable automatic library loading (default: `true`) |
| `loadingComponent` | `ReactNode` | ❌ | Custom loading UI component |
| `errorComponent` | `ReactNode \| Function` | ❌ | Custom error UI component or render function |
| `retryCount` | `number` | ❌ | Number of retry attempts on loading failure (default: `3`) |
| `retryDelay` | `number` | ❌ | Delay between retries in milliseconds (default: `1000`) |
| `onLoadStart` | `() => void` | ❌ | Callback when loading starts |
| `onLoadSuccess` | `() => void` | ❌ | Callback when loading succeeds |
| `onLoadError` | `(error: string) => void` | ❌ | Callback when loading fails |

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

Effects marked with *(requires p5.js)* automatically load the p5.js library when needed.

## Advanced Usage

### Manual Library Management

```tsx
import { 
  preloadLibraries, 
  loadVantaEffectFromCdn, 
  getVantaLoadStatus,
  areLibrariesReady 
} from 'vanta-react';

// Preload core libraries
await preloadLibraries();

// Load specific effects
await loadVantaEffectFromCdn('waves');
await loadVantaEffectFromCdn('birds');

// Check status
const status = getVantaLoadStatus();
console.log('Loaded effects:', status.loadedEffects);
console.log('Libraries ready:', areLibrariesReady());
```

### Performance Optimization

```tsx
import { preloadPopularVantaEffects, loadMultipleVantaEffects } from 'vanta-react';

// Preload popular effects at app startup
useEffect(() => {
  preloadPopularVantaEffects(); // waves, birds, net, clouds, fog
}, []);

// Load multiple effects in parallel
await loadMultipleVantaEffects(['waves', 'birds', 'net']);
```

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
  type VantaEffect
} from 'vanta-react';

// Type-safe effect selection
const effect: VantaEffectName = 'net';

// Full type support for props
const vantaProps: VantaProps = {
  effect: 'waves',
  background: true,
  style: { borderRadius: '10px' },
  options: {
    color: 0x3f7fb3,
    waveHeight: 20,
  },
  className: 'my-vanta-background',
  onLoadSuccess: () => console.log('Loaded!'),
};
```

## Bundle Size Comparison

| Version | Bundle Size | Description |
|---------|-------------|-------------|
| v0.2.0 (Local) | ~1.9 MB | Three.js + p5.js bundled |
| v0.3.0+ (CDN) | ~18 KB | CDN-optimized with auto-loading |
| **Current** | **~20 KB** | **Auto-loading + enhanced error handling** |

**Reduction: 99% smaller bundle size!**

## CDN URLs Used

```javascript
// Three.js (v0.134.0 - Vanta.js compatible)
https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js

// p5.js (v1.1.9 - stable version)
https://cdn.jsdelivr.net/npm/p5@1.1.9/lib/p5.min.js

// Vanta Effects (latest)
https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.{effect}.min.js
```

## Migration Guide

### From v0.2.0 → v0.3.0

**Breaking Changes:**
1. Library loading changed from bundled to CDN
2. Manual `preloadLibraries()` call required

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

### From v0.3.0 → v0.4.0+ (Current)

**New Features:**
1. Automatic library loading (no manual setup)
2. Enhanced error handling and retry mechanisms
3. Custom loading/error UI support

```tsx
// Before (v0.3.0) - Manual preloading
const [ready, setReady] = useState(false);
useEffect(() => {
  preloadLibraries().then(() => setReady(true));
}, []);
if (!ready) return <div>Loading...</div>;
return <Vanta effect="waves" />;

// After (v0.4.0+) - Automatic loading
return <Vanta effect="waves" />; // Just works!
```

## Error Handling

### Built-in Error Recovery

```tsx
// Automatic retry with custom configuration
<Vanta
  effect="net"
  retryCount={5}
  retryDelay={2000}
  onLoadError={(error) => {
    console.error('Loading failed:', error);
    // Send to error tracking service
  }}
/>
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

## Compatibility

- **React**: 16.0.0+
- **TypeScript**: 4.0+
- **Three.js**: 0.134+ (auto-loaded from CDN)
- **p5.js**: 1.1.9+ (auto-loaded when needed)
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

# Build library
pnpm build

# Run test app
cd test-run
pnpm install
pnpm dev
```

## Troubleshooting

### Common Issues

1. **Blank screen on first load**
   - Check browser console for errors
   - Verify CDN accessibility
   - Try disabling ad blockers

2. **TypeScript errors**
   ```bash
   pnpm add -D @types/react @types/react-dom
   ```

3. **Effect not rendering**
   ```tsx
   // Check if libraries are loaded
   import { areLibrariesReady, getPreloadStatus } from 'vanta-react';
   
   console.log('Ready:', areLibrariesReady());
   console.log('Status:', getPreloadStatus());
   ```

## Contributing

Bug reports, feature requests, and Pull Requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/gyuha/vanta-react/issues)
- [Documentation](https://github.com/gyuha/vanta-react#readme)
- [Examples](./examples/)

---

**🚀 Ultra-fast, auto-loading Vanta.js backgrounds for React!**  
Enjoy minimal bundle sizes and zero-configuration setup with vanta-react v0.4.0+.
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

// After (v0.3.0 - Manual Loading)
import { Vanta, preloadLibraries } from 'vanta-react';

function App() {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    preloadLibraries().then(() => setReady(true));
  }, []);
  
  if (!ready) return <div>Loading...</div>;
  
  return <Vanta effect="waves" autoLoad={false} />;
}

// After (v0.4.0+ - Auto Loading, Recommended)
import { Vanta } from 'vanta-react';

function App() {
  // No setup required! Libraries are automatically loaded
  return <Vanta effect="waves" />;
}
```

### Migration to v0.4.0+ (Auto-Loading)

**Recommended Migration Path:**

1. **Remove manual preload code** - Delete `preloadLibraries()` calls and related state management
2. **Simplify components** - Use Vanta components directly without setup
3. **Optional customization** - Add custom loading/error UI if needed

```tsx
// ✅ New simplified approach (v0.4.0+)
function App() {
  return (
    <div>
      <Vanta effect="waves" />
      <Vanta effect="net" background={true} />
    </div>
  );
}

// ✅ With custom loading UI
function AppWithCustomUI() {
  return (
    <Vanta
      effect="waves"
      loadingComponent={<div>Custom loading...</div>}
      onLoadSuccess={() => console.log('Ready!')}
    />
  );
}

// ✅ Legacy mode (if you prefer manual control)
function LegacyApp() {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    preloadLibraries().then(() => setReady(true));
  }, []);
  
  return ready ? <Vanta effect="waves" autoLoad={false} /> : <div>Loading...</div>;
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
