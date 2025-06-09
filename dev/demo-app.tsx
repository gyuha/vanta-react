import React, { useState } from 'react';
import { Vanta, VantaEffectName } from '../src';

const effectOptions = [
  'birds',
  'cells',
  'clouds',
  'clouds2',
  'fog',
  'globe',
  'net',
  'rings',
  'halo',
  'ripple',
  'dots',
  'topology',
  'trunk',
  'waves',
] as const;

const DemoApp: React.FC = () => {
  const [currentEffect, setCurrentEffect] = useState<VantaEffectName>('net');
  const [backgroundMode, setBackgroundMode] = useState<boolean>(true);

  return (
    <div className="min-h-screen">
      {/* Vanta 컴포넌트 */}
      <Vanta
        effect={currentEffect}
        background={backgroundMode}
        options={{
          color: 0x3f7fb3,
          points: 8.00,
          maxDistance: 23.00,
          spacing: 17.00,
        }}
      />

      {/* 컨트롤 패널 */}
      <div className="relative z-10 p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Vanta React Demo
          </h1>

          <div className="space-y-4">
            {/* 효과 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effect
              </label>
              <select
                value={currentEffect}
                onChange={(e) => setCurrentEffect(e.target.value as VantaEffectName)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {effectOptions.map((effect) => (
                  <option key={effect} value={effect}>
                    {effect.charAt(0).toUpperCase() + effect.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* 배경 모드 토글 */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={backgroundMode}
                  onChange={(e) => setBackgroundMode(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-sm font-medium text-gray-700">
                  Full Screen Background
                </span>
              </label>
            </div>

            {/* 정보 */}
            <div className="text-sm text-gray-600 mt-4">
              <p>Current Effect: <strong>{currentEffect}</strong></p>
              <p>Background Mode: <strong>{backgroundMode ? 'On' : 'Off'}</strong></p>
            </div>
          </div>
        </div>

        {/* 일반 모드일 때 컨테이너 */}
        {!backgroundMode && (
          <div className="mt-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Container Mode Example
              </h2>
              <div className="w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
                <Vanta
                  effect={currentEffect}
                  background={false}
                  className="rounded-lg"
                  options={{
                    color: 0x3f7fb3,
                    points: 8.00,
                    maxDistance: 23.00,
                    spacing: 17.00,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                이 모드에서는 Vanta가 컨테이너 내부에서만 렌더링됩니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoApp;
