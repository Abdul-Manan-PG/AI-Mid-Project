'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCubeStore } from '@/app/store/cubeStore';
import * as THREE from 'three';

const COLORS = [
  '#ff9800', // Right 
  '#f44336', // Left
  '#ffffff', // Up
  '#ffeb3b', // Down
  '#4caf50', // Front
  '#2196f3', // Back
];

// Helper to determine axis and angle based on standard cube notation
const parseMove = (move: string) => {
  const face = move[0];
  const modifier = move.length > 1 ? move[1] : '';
  
  let axis = new THREE.Vector3();
  let angle = Math.PI / 2; // 90 degrees
  let condition = (pos: THREE.Vector3) => false;

  if (modifier === "'") angle *= -1;
  if (modifier === "2") angle *= 2;

  switch (face) {
    case 'R': axis.set(1, 0, 0); angle *= -1; condition = (p) => Math.round(p.x) === 1; break;
    case 'L': axis.set(1, 0, 0); condition = (p) => Math.round(p.x) === -1; break;
    case 'U': axis.set(0, 1, 0); angle *= -1; condition = (p) => Math.round(p.y) === 1; break;
    case 'D': axis.set(0, 1, 0); condition = (p) => Math.round(p.y) === -1; break;
    case 'F': axis.set(0, 0, 1); angle *= -1; condition = (p) => Math.round(p.z) === 1; break;
    case 'B': axis.set(0, 0, 1); condition = (p) => Math.round(p.z) === -1; break;
  }
  return { axis, angle, condition };
};

export default function RubiksCube() {
  // Grab the upgraded state properties from Zustand
  const { activeMove, clearActiveMove } = useCubeStore();
  
  const groupRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  
  const [animating, setAnimating] = useState(false);
  const [currentMove, setCurrentMove] = useState<{ axis: THREE.Vector3, targetAngle: number, currentAngle: number } | null>(null);

  const [cubies] = useState(() => {
    const temp = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          temp.push({ position: new THREE.Vector3(x, y, z), id: `${x}${y}${z}`, ref: React.createRef<THREE.Mesh>() });
        }
      }
    }
    return temp;
  });

  // Trigger animation when activeMove is set in Zustand
  useEffect(() => {
    if (activeMove && !animating) {
      const { axis, angle, condition } = parseMove(activeMove);
      
      // Attach the correct 9 cubies to the invisible pivot
      cubies.forEach((cubie) => {
        const mesh = cubie.ref.current;
        if (mesh) {
          const worldPos = new THREE.Vector3();
          mesh.getWorldPosition(worldPos);
          
          if (condition(worldPos)) {
            pivotRef.current?.attach(mesh);
          }
        }
      });

      setCurrentMove({ axis, targetAngle: angle, currentAngle: 0 });
      setAnimating(true);
    }
  }, [activeMove, animating, cubies]);

  // The 3D Animation Loop
  useFrame((_, delta) => {
    if (animating && currentMove && pivotRef.current && groupRef.current) {
      const speed = 6; // Rotation speed
      const step = Math.sign(currentMove.targetAngle) * speed * delta;
      
      if (Math.abs(currentMove.currentAngle + step) >= Math.abs(currentMove.targetAngle)) {
        // Snap to exact final angle
        const remaining = currentMove.targetAngle - currentMove.currentAngle;
        pivotRef.current.rotateOnWorldAxis(currentMove.axis, remaining);
        
        // Detach cubies from pivot back to the main group
        while (pivotRef.current.children.length > 0) {
          groupRef.current.attach(pivotRef.current.children[0]);
        }
        
        // Reset pivot
        pivotRef.current.rotation.set(0, 0, 0);
        
        setAnimating(false);
        setCurrentMove(null);
        
        // Tell Zustand the animation is done so it allows the next move
        clearActiveMove(); 
      } else {
        pivotRef.current.rotateOnWorldAxis(currentMove.axis, step);
        currentMove.currentAngle += step;
      }
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {cubies.map((cubie) => (
          <mesh key={cubie.id} ref={cubie.ref} position={cubie.position}>
            <boxGeometry args={[0.96, 0.96, 0.96]} />
            {COLORS.map((color, idx) => (
              <meshStandardMaterial key={idx} attach={`material-${idx}`} color={color} roughness={0.2} metalness={0.1} />
            ))}
          </mesh>
        ))}
      </group>
      <group ref={pivotRef} position={[0, 0, 0]} />
    </>
  );
}