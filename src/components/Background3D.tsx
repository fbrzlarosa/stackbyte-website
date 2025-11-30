"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// --------------------------------------------------------
// RETRO CYBER SCAPE SHADER
// --------------------------------------------------------

const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vDist;

  // Optimized Pseudo-random
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Optimized Value Noise (Simpler mixing)
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    // Four corners
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // 1. Infinite Scroll Movement
    vec2 noiseCoord = pos.xy * 0.1;
    noiseCoord.y -= uScroll * 1.0 + uTime * 0.1;
    
    // 2. Terrain Generation
    // Single octave noise for performance
    float elevation = noise(noiseCoord) * 3.0;
    
    // Valley
    float valley = abs(pos.x);
    elevation *= smoothstep(2.0, 15.0, valley);
    
    // 3. Mouse Interaction (Squared distance is faster than distance())
    vec2 diff = pos.xy - uMouse;
    float distSq = dot(diff, diff);
    // Interaction radius squared (8.0 * 8.0 = 64.0)
    float interaction = 1.0 - smoothstep(0.0, 64.0, distSq);
    
    if (interaction > 0.01) {
       elevation += interaction * 2.0;
    }
    
    pos.z += elevation;
    vElevation = pos.z;
    
    vec4 viewPos = modelViewMatrix * vec4(pos, 1.0);
    vDist = -viewPos.z;

    gl_Position = projectionMatrix * viewPos;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorGrid;
  uniform vec3 uColorBackground;
  
  varying vec2 vUv;
  varying float vElevation;
  varying float vDist;

  void main() {
    // 1. Grid Pattern (Optimized)
    vec2 gridUV = vUv * 150.0; // Reduced density for lower poly count
    vec2 gridDist = abs(fract(gridUV - 0.5) - 0.5) / fwidth(gridUV);
    float distToLine = min(gridDist.x, gridDist.y);
    
    // Core line
    float core = 1.0 - min(distToLine, 1.0);
    
    // Simple linear glow instead of exp()
    float glow = max(0.0, 1.0 - distToLine * 0.1);
    
    // 2. Color Logic
    vec3 bg = uColorBackground;
    
    // Pre-calculated pulse
    float pulse = 1.0 + sin(uTime * 3.0) * 0.4;
    
    vec3 neonColor = uColorGrid * 2.0;
    vec3 coreColor = vec3(1.0);
    
    // Height factor
    float heightFactor = smoothstep(0.0, 10.0, vElevation);
    neonColor = mix(neonColor, vec3(0.5, 1.0, 1.0), heightFactor);
    
    vec3 gridColor = neonColor * glow;
    gridColor += coreColor * core * 0.8;
    gridColor *= pulse;
    
    vec3 color = max(bg, gridColor);
    
    // 3. Fog
    float fog = 1.0 - smoothstep(10.0, 50.0, vDist);
    
    // Alpha
    float alpha = fog * 0.6;
    alpha += glow * 0.4 * fog;

    gl_FragColor = vec4(color, alpha);
  }
`;

import { useBackground } from "@/context/BackgroundContext";

function RetroLandscape() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const scrollRef = useRef(0);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const { currentTheme } = useBackground();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          scrollRef.current = window.scrollY * 0.005;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (event: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const x = (event.clientX / window.innerWidth) * 2 - 1;
          const y = -(event.clientY / window.innerHeight) * 2 + 1;
          mouseRef.current.x = x;
          mouseRef.current.y = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(9999, 9999) },
    uColorGrid: { value: new THREE.Color("#06b6d4") }, // Initial color
    uColorBackground: { value: new THREE.Color("#000000") },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Smooth scroll interpolation
      material.uniforms.uScroll.value = THREE.MathUtils.lerp(
        material.uniforms.uScroll.value,
        scrollRef.current,
        0.1
      );
      
      // Color transition
      const targetColor = new THREE.Color(currentTheme.primary);
      material.uniforms.uColorGrid.value.lerp(targetColor, 0.05);

      // Raycast optimization
      raycaster.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.intersectObject(meshRef.current);

      if (intersects.length > 0) {
        const localPoint = meshRef.current.worldToLocal(intersects[0].point.clone());
        const currentMouse = material.uniforms.uMouse.value;
        currentMouse.x = THREE.MathUtils.lerp(currentMouse.x, localPoint.x, 0.2);
        currentMouse.y = THREE.MathUtils.lerp(currentMouse.y, localPoint.y, 0.2);
      }
    }
  });

  return (
    <group rotation={[-Math.PI / 3, 0, 0]} position={[0, -4, -12]}>
      <mesh ref={meshRef}>
        {/* Reduced geometry segments for performance (128x128 instead of 256x256) */}
        <planeGeometry args={[200, 200, 128, 128]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Background3D() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.0, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none mix-blend-screen"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ opacity: 0.01 }}
      >
        <RetroLandscape />
      </Canvas>
    </motion.div>
  );
}
