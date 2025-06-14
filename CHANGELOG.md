# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.2] - 2024-12-28

### Removed
- **Console Logs**: Removed all debug console messages for cleaner production output
- Debug messages like "[CDN Vanta] Preloading popular Vanta effects..." no longer appear
- Performance monitoring logs are now silent in production
- Vanta component debug logging removed

### Changed
- Silent operation for better production experience
- Clean console output without development debug messages

## [0.4.1] - 2024-12-28

### Fixed
- **React 16 Compatibility**: Resolved `ReactDebugCurrentFrame` error when using with TanStack Router
- Fixed JSX runtime configuration for React 16 support

### Changed
- Updated Vite configuration to use classic JSX runtime
- Improved external dependency handling for better compatibility

## [0.4.0] - 2024-12-28

### Added
- **Automatic Library Loading**: No more manual `preloadLibraries()` calls required
- Auto-loading functionality with `autoLoad` prop (defaults to `true`)
- Retry mechanisms with configurable `retryCount` and `retryDelay`
- Custom loading and error UI components support
- Event callbacks: `onLoadStart`, `onLoadSuccess`, `onLoadError`
- Comprehensive error handling and recovery

### Changed
- Default behavior changed from manual to automatic library loading
- Simplified component usage - just use `<Vanta effect="waves" />` directly

### Backward Compatibility
- Manual loading still supported with `autoLoad={false}`
- Existing code with `preloadLibraries()` continues to work

## [0.3.0] - 2024-12-27

### Added
- **CDN-based Loading**: Dynamic library loading from CDN instead of bundling
- Massive bundle size reduction (99% smaller - from 1.9MB to ~18KB)
- TypeScript support for all Vanta effects
- Error boundary component for robust error handling
- Performance monitoring utilities

### Changed
- Switched from local library bundling to CDN-based approach
- Requires manual `preloadLibraries()` call before component usage

### Breaking Changes
- Manual library preloading required
- Local Three.js and p5.js files no longer bundled

## [0.2.0] - 2024-12-26

### Added
- Local Three.js and p5.js bundling
- Basic React component wrapper for Vanta.js
- TypeScript definitions

### Issues
- Large bundle size (~1.9MB) due to bundled libraries
- Manual library management required

## [0.1.0] - 2024-12-25

### Added
- Initial release
- Basic Vanta.js React integration
- Limited effect support
