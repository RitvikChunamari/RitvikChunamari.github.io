import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EdithHologramCanvasProps {
  scrollProgress: number;
  isEdithMode: boolean;
  isVisible?: boolean;
}

const EdithHologramCanvas: React.FC<EdithHologramCanvasProps> = ({
  scrollProgress,
  isEdithMode,
  isVisible = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const isVisibleRef = useRef(isVisible);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.025);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 1.5, // Only antialias on standard screens; retina does not need expensive AA passes
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Minimalist Architectural HUD Group
    const hudGroup = new THREE.Group();
    scene.add(hudGroup);

    // Fine 3D Floating Geometry Array
    const floatingGeomsGroup = new THREE.Group();
    hudGroup.add(floatingGeomsGroup);

    const whiteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });

    const slateMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });

    // Create floating wireframe geometry
    for (let i = 0; i < 12; i++) {
      const size = 1.0 + Math.random() * 2.0;
      const geo = i % 3 === 0 ? new THREE.IcosahedronGeometry(size, 1) : new THREE.BoxGeometry(size, size * 0.6, size * 0.8);
      const mesh = new THREE.Mesh(geo, i % 2 === 0 ? whiteMat : slateMat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 20 - 4
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      floatingGeomsGroup.add(mesh);
    }

    // Concentric Precision Target Ring
    const ringGeo = new THREE.RingGeometry(4.5, 4.52, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    hudGroup.add(ringMesh);

    // Outer Dashed Orbit Ring
    const outerRingGeo = new THREE.RingGeometry(7.0, 7.02, 24);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
      wireframe: true
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    hudGroup.add(outerRingMesh);

    // 3D Crosshair Tick Notches
    const crosshairGroup = new THREE.Group();
    hudGroup.add(crosshairGroup);

    const tickGeo = new THREE.BoxGeometry(0.04, 0.4, 0.04);
    const tickMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const tickMesh = new THREE.Mesh(tickGeo, tickMat);
      tickMesh.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0);
      tickMesh.rotation.z = angle;
      crosshairGroup.add(tickMesh);
    }

    // 3. Monochrome Star Field
    const particleCount = 300;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 45;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 45;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 45;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Floor Grid
    const gridHelper = new THREE.GridHelper(50, 40, 0x334155, 0x0f172a);
    gridHelper.position.y = -10;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.18;
    scene.add(gridHelper);

    // Mouse Movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      if (!isVisibleRef.current || document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = clock.getElapsedTime();
      const scroll = scrollRef.current;

      // Smooth Mouse Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Rotations
      ringMesh.rotation.z = elapsedTime * 0.05;
      outerRingMesh.rotation.z = -elapsedTime * 0.03;
      crosshairGroup.rotation.z = elapsedTime * 0.08;

      for (let i = 0; i < floatingGeomsGroup.children.length; i++) {
        const child = floatingGeomsGroup.children[i];
        child.rotation.x += 0.002 * (i % 3 + 1);
        child.rotation.y += 0.003 * (i % 2 + 1);
        // Antigravity zero-G floating harmonic bobbing
        child.position.y += Math.sin(elapsedTime * 0.8 + i * 1.5) * 0.012;
        child.position.x += Math.cos(elapsedTime * 0.5 + i * 1.2) * 0.008;
      }

      particleSystem.rotation.y = elapsedTime * 0.01 + scroll * Math.PI * 0.2;

      // Camera Flythrough Driven by Scroll
      const targetCamX = Math.sin(scroll * Math.PI) * 3 + mouseRef.current.x * 1.5;
      const targetCamY = Math.cos(scroll * Math.PI) * 2 + mouseRef.current.y * 1.5;
      const targetCamZ = 12 - scroll * 8;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      ringGeo.dispose();
      ringMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      tickGeo.dispose();
      tickMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      whiteMat.dispose();
      slateMat.dispose();
      gridHelper.geometry.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isEdithMode]);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-[1] will-change-transform transition-opacity duration-700 ${
        isVisible ? (isEdithMode ? 'opacity-75' : 'opacity-35') : 'opacity-0'
      }`}
    />
  );
};

export default EdithHologramCanvas;
