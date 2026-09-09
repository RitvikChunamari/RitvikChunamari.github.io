import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobalFluidCanvasProps {
  scrollProgress?: number;
  scrollVelocity?: number;
}

const GlobalFluidCanvas: React.FC<GlobalFluidCanvasProps> = ({
  scrollProgress = 0,
  scrollVelocity = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({
    screenX: 0,
    screenY: 0,
    planeX: 0,
    planeY: 0,
    targetPlaneX: 0,
    targetPlaneY: 0,
    velX: 0,
    velY: 0,
    speed: 0,
    clickTime: 999.0,
    clickImpulse: 0,
    scrollProgress: 0,
    scrollVel: 0,
  });

  // Keep ref updated with latest props without re-initializing Three.js
  useEffect(() => {
    mouseRef.current.scrollProgress = scrollProgress;
    mouseRef.current.scrollVel = scrollVelocity;
  }, [scrollProgress, scrollVelocity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -1.2, 6.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2(-10, -10);

    // 2. Custom Hydrodynamic Fluid Wave Shaders with Continuous Scroll Dynamics
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uMouseVel;
      uniform float uMouseSpeed;
      uniform float uClickTime;
      uniform float uClickImpulse;
      uniform float uScrollProgress;
      uniform float uScrollVel;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying float vElevation;
      varying vec2 vLocalPos;
      varying float vHeroWeight;

      // Base undulating liquid wave with continuous flow
      float calculateBaseWave(vec2 p, float time) {
        // Base harmonic undulations
        float wave1 = sin(p.x * 1.05 + time * 0.7) * cos(p.y * 0.85 + time * 0.6) * 0.35;
        float wave2 = sin(p.x * 2.1 - time * 0.9 + p.y * 1.3) * 0.18;
        float wave3 = cos(p.y * 2.6 + time * 1.1 - p.x * 1.5) * 0.1;

        // Scroll hydrodynamic current: creates trailing wake when user scrolls
        float scrollCurrent = sin(p.y * 2.2 + time * 1.8) * clamp(uScrollVel * 0.008, -0.4, 0.4);

        return wave1 + wave2 + wave3 + scrollCurrent;
      }

      // Cursor hydrodynamic interaction
      float calculateCursorInteraction(vec2 p, float time) {
        vec2 toVertex = p - uMouse;
        float dist = length(toVertex);

        // 1. Trough depression directly under cursor
        float depression = -exp(-dist * 1.7) * 0.38;

        // 2. Trailing wake crests along cursor velocity
        vec2 normDir = toVertex / (dist + 0.001);
        float velAlignment = dot(normDir, uMouseVel);
        float wakeCrests = sin(dist * 5.2 - time * 3.8) * exp(-dist * 1.1) * (0.2 + velAlignment * 0.35 * uMouseSpeed);

        // 3. Dynamic expanding click shockwave
        float clickDist = dist;
        float waveProgress = uClickTime * 4.6;
        float clickWave = sin((clickDist - waveProgress) * 5.8) * 
                          exp(-abs(clickDist - waveProgress) * 1.15) * 
                          exp(-uClickTime * 1.3) * 
                          uClickImpulse * 0.5;

        return depression + wakeCrests + clickWave;
      }

      float totalElevation(vec2 p, float time) {
        return calculateBaseWave(p, time) + calculateCursorInteraction(p, time);
      }

      void main() {
        vUv = uv;
        vLocalPos = position.xy;
        vHeroWeight = clamp(1.0 - uScrollProgress * 3.0, 0.0, 1.0);

        vec3 pos = position;
        float elevation = totalElevation(pos.xy, uTime);
        vElevation = elevation;
        pos.z += elevation;

        // Finite difference for surface normal
        float delta = 0.04;
        float elevX = totalElevation(pos.xy + vec2(delta, 0.0), uTime);
        float elevY = totalElevation(pos.xy + vec2(0.0, delta), uTime);
        vec3 tangentX = vec3(delta, 0.0, elevX - elevation);
        vec3 tangentY = vec3(0.0, delta, elevY - elevation);
        vec3 calculatedNormal = normalize(cross(tangentX, tangentY));

        vNormal = normalMatrix * calculatedNormal;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;

        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseSpeed;
      uniform float uScrollProgress;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying float vElevation;
      varying vec2 vLocalPos;
      varying float vHeroWeight;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Fresnel term (soft glancing light along wave slopes)
        float NdotV = max(dot(normal, viewDir), 0.0);
        float fresnel = pow(1.0 - NdotV, 3.2);

        // Obsidian deep graphite base color
        vec3 baseColor = vec3(0.026, 0.026, 0.032);

        // Studio overhead key spotlight
        vec3 lightDir1 = normalize(vec3(0.5, 1.5, 2.0));
        vec3 halfDir1 = normalize(lightDir1 + viewDir);
        float spec1 = pow(max(dot(normal, halfDir1), 0.0), 28.0);

        // Secondary soft rim light
        vec3 lightDir2 = normalize(vec3(-1.0, -0.6, 1.2));
        vec3 halfDir2 = normalize(lightDir2 + viewDir);
        float spec2 = pow(max(dot(normal, halfDir2), 0.0), 16.0);

        // Reactive Cursor Caustic Spotlight
        float distToMouse = length(vLocalPos - uMouse);
        float cursorSpotlight = exp(-distToMouse * 0.92);
        vec3 cursorLightDir = normalize(vec3(uMouse - vLocalPos, 1.3));
        vec3 halfCursor = normalize(cursorLightDir + viewDir);
        float cursorSpec = pow(max(dot(normal, halfCursor), 0.0), 22.0);

        // Swiss Red ember undertone (#FF3B30) along wave crests and near cursor
        vec3 redEmber = vec3(1.0, 0.23, 0.19);
        float crestFactor = smoothstep(0.08, 0.44, vElevation);

        // Transition depth: Hero is brightly focused, work section is velvety obsidian
        float sectionDim = mix(0.72, 1.0, vHeroWeight);

        vec3 color = baseColor;
        color += redEmber * (crestFactor * 0.055 + fresnel * 0.03 + cursorSpotlight * 0.065);
        color += vec3(0.92, 0.95, 1.0) * spec1 * (0.32 * sectionDim);
        color += vec3(0.65, 0.75, 0.85) * spec2 * 0.14;
        color += vec3(1.0) * fresnel * (0.13 * sectionDim);
        color += vec3(1.0, 0.96, 0.92) * cursorSpec * (0.34 + uMouseSpeed * 0.4);

        // Edge vignette fade
        float edgeVignette = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x) *
                             smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

        float alpha = clamp((0.42 + vElevation * 0.4 + spec1 * 0.45 + cursorSpotlight * 0.2) * edgeVignette, 0.0, 0.88);

        // Smooth fade as user reaches the white About section (uScrollProgress > 0.65)
        float aboutFade = smoothstep(0.85, 0.6, uScrollProgress);
        alpha *= aboutFade;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // 3. High-density Plane Geometry & Mesh
    const geometry = new THREE.PlaneGeometry(18, 13, 160, 140);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uMouseSpeed: { value: 0 },
        uClickTime: { value: 999.0 },
        uClickImpulse: { value: 0 },
        uScrollProgress: { value: 0 },
        uScrollVel: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const planeMesh = new THREE.Mesh(geometry, material);
    planeMesh.rotation.x = -Math.PI * 0.26;
    scene.add(planeMesh);

    // 4. Global Raycasting & Mouse Events
    const handleMouseMove = (e: MouseEvent) => {
      ndcMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndcMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(ndcMouse, camera);
      const intersects = raycaster.intersectObject(planeMesh);

      if (intersects.length > 0) {
        const uv = intersects[0].uv;
        if (uv) {
          const pX = (uv.x - 0.5) * 18;
          const pY = (uv.y - 0.5) * 13;
          mouseRef.current.targetPlaneX = pX;
          mouseRef.current.targetPlaneY = pY;
        }
      } else {
        mouseRef.current.targetPlaneX = ndcMouse.x * 7.0;
        mouseRef.current.targetPlaneY = ndcMouse.y * 5.0;
      }
    };

    const handleClick = () => {
      mouseRef.current.clickTime = 0.0;
      mouseRef.current.clickImpulse = 1.0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    // 5. Resize Handling
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const m = mouseRef.current;

      // Smooth mouse plane coordinates
      const prevX = m.planeX;
      const prevY = m.planeY;
      m.planeX += (m.targetPlaneX - m.planeX) * 0.12;
      m.planeY += (m.targetPlaneY - m.planeY) * 0.12;

      // Physical velocity vector
      const vx = (m.planeX - prevX) / Math.max(delta, 0.001);
      const vy = (m.planeY - prevY) / Math.max(delta, 0.001);
      const speed = Math.hypot(vx, vy);
      const normVx = speed > 0.01 ? vx / speed : 0;
      const normVy = speed > 0.01 ? vy / speed : 0;

      m.velX += (normVx - m.velX) * 0.14;
      m.velY += (normVy - m.velY) * 0.14;
      m.speed += (Math.min(speed * 0.05, 1.6) - m.speed) * 0.12;

      // Update click shockwave
      m.clickTime += delta;

      // Update shader uniforms
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uMouse.value.set(m.planeX, m.planeY);
      material.uniforms.uMouseVel.value.set(m.velX, m.velY);
      material.uniforms.uMouseSpeed.value = m.speed;
      material.uniforms.uClickTime.value = m.clickTime;
      material.uniforms.uClickImpulse.value = m.clickImpulse;
      material.uniforms.uScrollProgress.value = m.scrollProgress;
      material.uniforms.uScrollVel.value = m.scrollVel;

      // Continuous spatial travel: plane subtly responds to scroll depth & tilt
      planeMesh.position.y = -m.scrollProgress * 2.2;
      planeMesh.rotation.z = Math.sin(elapsedTime * 0.12) * 0.02 + (m.planeX / 18) * 0.06;
      planeMesh.rotation.x = -Math.PI * 0.26 + (m.scrollVel * 0.0004);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    />
  );
};

export default GlobalFluidCanvas;
