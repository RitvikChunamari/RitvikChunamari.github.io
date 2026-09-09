import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroWireframeCanvasProps {
  offset?: number;
}

const HeroWireframeCanvas: React.FC<HeroWireframeCanvasProps> = ({ offset = 0 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(offset);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.02);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 4. Root Interactivity Group (affected by mouse tilt & scroll)
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // --- Geometries & Materials ---
    const disposables: { dispose: () => void }[] = [];

    // Helper: create crisp wireframe line mesh from geometry
    const createWireframeLine = (
      geo: THREE.BufferGeometry,
      color: number = 0xffffff,
      opacity: number = 0.2
    ) => {
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      disposables.push(edges, mat, geo);
      return new THREE.LineSegments(edges, mat);
    };

    // Object A: Multi-faceted Torus Knot (Primary Hero Sculpture - Upper Right)
    const torusKnotGeo = new THREE.TorusKnotGeometry(2.6, 0.65, 80, 14, 2, 3);
    const torusKnotMesh = createWireframeLine(torusKnotGeo, 0xffffff, 0.18);
    // Inner core with accent red
    const innerCoreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const innerCoreMesh = createWireframeLine(innerCoreGeo, 0xff3b30, 0.35);
    torusKnotMesh.add(innerCoreMesh);

    // Position in the upper-right / mid-right negative space
    torusKnotMesh.position.set(5.5, 1.5, -2);
    sceneGroup.add(torusKnotMesh);

    // Object B: Floating Geodesic Icosahedron (Secondary - Lower Left)
    const icoGeo = new THREE.IcosahedronGeometry(2.0, 1);
    const icoMesh = createWireframeLine(icoGeo, 0xffffff, 0.16);
    icoMesh.position.set(-6.0, -2.5, -1);
    sceneGroup.add(icoMesh);

    // Object C: Concentric Gyroscopic Rings (Behind Main Typography)
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(2.0, -0.5, -5);

    const ringGeo1 = new THREE.RingGeometry(5.2, 5.22, 64);
    const ringMat1 = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const ringMesh1 = new THREE.LineLoop(new THREE.EdgesGeometry(ringGeo1), ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    gyroGroup.add(ringMesh1);
    disposables.push(ringGeo1, ringMat1);

    const ringGeo2 = new THREE.RingGeometry(7.0, 7.02, 48);
    const ringMat2 = new THREE.LineBasicMaterial({
      color: 0xff3b30,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const ringMesh2 = new THREE.LineLoop(new THREE.EdgesGeometry(ringGeo2), ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    gyroGroup.add(ringMesh2);
    disposables.push(ringGeo2, ringMat2);

    sceneGroup.add(gyroGroup);

    // Object D: Floating 3D Micro Particle Field (3D Dust / Constellation Nodes)
    const particleCount = 60;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 28;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    sceneGroup.add(particleSystem);
    disposables.push(particleGeo, particleMat);

    // 5. Mouse Parallax & Inertia State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Adjust positions for mobile vs desktop viewports
      const isMobile = width < 768;
      if (isMobile) {
        torusKnotMesh.position.set(0, 3.5, -4);
        torusKnotMesh.scale.set(0.65, 0.65, 0.65);
        icoMesh.position.set(0, -4.5, -3);
        icoMesh.scale.set(0.6, 0.6, 0.6);
        gyroGroup.position.set(0, 0, -6);
      } else {
        torusKnotMesh.position.set(width > 1400 ? 6.2 : 4.8, 1.8, -2);
        torusKnotMesh.scale.set(1, 1, 1);
        icoMesh.position.set(width > 1400 ? -6.8 : -5.2, -2.8, -1);
        icoMesh.scale.set(1, 1, 1);
        gyroGroup.position.set(2.0, -0.5, -5);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial responsive setup

    // 7. Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Rotate geometries independently
      torusKnotMesh.rotation.x = elapsedTime * 0.15;
      torusKnotMesh.rotation.y = elapsedTime * 0.25;

      innerCoreMesh.rotation.x = -elapsedTime * 0.3;
      innerCoreMesh.rotation.y = elapsedTime * 0.4;

      icoMesh.rotation.x = elapsedTime * 0.12;
      icoMesh.rotation.z = elapsedTime * 0.18;
      icoMesh.position.y = (window.innerWidth < 768 ? -4.5 : -2.8) + Math.sin(elapsedTime * 0.8) * 0.35;

      ringMesh1.rotation.z = elapsedTime * 0.08;
      ringMesh2.rotation.z = -elapsedTime * 0.06;

      // Gentle wave in particles
      particleSystem.rotation.y = elapsedTime * 0.02;

      // Parallax scene tilt & scroll reaction
      sceneGroup.rotation.y = mouse.x * 0.25;
      sceneGroup.rotation.x = -mouse.y * 0.2;

      // Z-depth shift on scroll
      const currentOffset = offsetRef.current;
      sceneGroup.position.z = -currentOffset * 0.015;
      sceneGroup.position.y = currentOffset * 0.008;

      // Fade out on scroll
      const scrollFade = Math.max(0, 1 - currentOffset * 0.0025);
      container.style.opacity = String(scrollFade);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      disposables.forEach(d => {
        try { d.dispose(); } catch {}
      });

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen transition-opacity duration-300"
      style={{ opacity: 1 }}
    />
  );
};

export default HeroWireframeCanvas;
