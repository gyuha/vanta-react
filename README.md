# Vanta React Backgrounds

> [한국어 문서](./README-ko.md) | English

A React component library for Vanta.js animated backgrounds with full TypeScript support and React 16 compatibility.

## ✨ Features

- 🎨 **15 Vanta Effects Supported** - net, waves, birds, cells, and more
- 🔧 **Full TypeScript Support** - Type safety and IntelliSense out of the box
- ⚛️ **React 16 Compatible** - Works with legacy projects
- 🎯 **Flexible Usage** - Full screen background or container mode
- 🧹 **Automatic Memory Management** - Auto cleanup on component unmount
- 📦 **Tree Shaking Support** - Only bundle the effects you need

## Installation

```bash
# npm
npm install vanta-react-backgrounds three react

# yarn
yarn add vanta-react-backgrounds three react

# pnpm
pnpm add vanta-react-backgrounds three react
```

## Basic Usage

### Full Screen Background

```tsx
import React from 'react';
import { Vanta } from 'vanta-react-backgrounds';

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
import { Vanta } from 'vanta-react-backgrounds';

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
import { Vanta, VantaEffectName } from 'vanta-react-backgrounds';

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
- `dots` - Dot animation
- `topology` - Topology animation
- `trunk` - Tree trunk animation
- `waves` - Wave animation

## TypeScript Support

This library provides full TypeScript support:

```tsx
import { Vanta, VantaEffectName, VantaProps } from 'vanta-react-backgrounds';

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
- **Three.js**: 0.140.2+ (recommended)
- **TypeScript**: 4.0+
- **Node.js**: 14+

## Development & Testing

```bash
# Clone repository
git clone https://github.com/your-username/vanta-react-backgrounds.git
cd vanta-react-backgrounds

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

- Vanta.js depends on Three.js, so Three.js must be installed alongside this library.
- We recommend using Three.js version 0.140.2 for compatibility.
- Memory cleanup is automatically performed when the component is unmounted.
