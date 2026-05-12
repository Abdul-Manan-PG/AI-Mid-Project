'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RubiksCube from '@/app/components/cube/RubiksCube';

export default function Scene() {
  return (
    <div className="w-full h-[500px] sm:h-[600px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800">
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        {/* Ambient light so all sides are visible */}
        <ambientLight intensity={0.7} />
        {/* Directional light to give 3D depth and shadows */}
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Allows the user to rotate the camera around the cube */}
        <OrbitControls enablePan={false} enableZoom={true} minDistance={4} maxDistance={12} />
        
        <RubiksCube />
      </Canvas>
    </div>
  );
}