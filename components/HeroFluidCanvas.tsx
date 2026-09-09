import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroFluidCanvasProps {
  offset?: number;
}

const HeroFluidCanvas: React.FC<HeroFluidCanvasProps> = ({ offset = 0 }) => {
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
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -1.0, 5.8);
    camera.lookAt(0, 0.25, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2(-10, -10);

    // 2. Custom Hydrodynamic Fluid Wave Shaders
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uMouseVel;
      uniform float uMouseSpeed;
      uniform float uClickTime;
      uniform float uClickImpulse;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying float vElevation;
      varying vec2 vLocalPos;

      // Organic undulating base wave
      float calculateBaseWave(vec2 p, float time) {
        float wave1 = sin(p.x * 1.1 + time * 0.75) * cos(p.y * 0.9 + time * 0.65) * 0.32;
        float wave2 = sin(p.x * 2.2 - time * 0.95 + p.y * 1.4) * 0.16;
        float wave3 = cos(p.y * 2.8 + time * 1.15 - p.x * 1.6) * 0.09;
        return wave1 + wave2 + wave3;
      }

      // Cursor hydrodynamic interaction
      float calculateCursorInteraction(vec2 p, float time) {
        vec2 toVertex = p - uMouse;
        float dist = length(toVertex);

        // 1. Trough depression directly under cursor
        float depression = -exp(-dist * 1.8) * 0.35;

        // 2. Trailing wake crests along cursor velocity
        vec2 normDir = toVertex / (dist + 0.001);
        float velAlignment = dot(normDir, uMouseVel);
        float wakeCrests = sin(dist * 5.5 - time * 4.0) * exp(-dist * 1.15) * (0.22 + velAlignment * 0.35 * uMouseSpeed);

        // 3. Dynamic expanding click impulse shockwave
        float clickDist = dist;
        float waveProgress = uClickTime * 4.5;
        float clickWave = sin((clickDist - waveProgress) * 6.0) * 
                          exp(-abs(clickDist - waveProgress) * 1.2) * 
                          exp(-uClickTime * 1.4) * 
                          uClickImpulse * 0.45;

        return depression + wakeCrests + clickWave;
      }

      float totalElevation(vec2 p, float time) {
        return calculateBaseWave(p, time) + calculateCursorInteraction(p, time);
      }

      void main() {
        vUv = uv;
        vLocalPos = position.xy;

        vec3 pos = position;
        float elevation = totalElevation(pos.xy, uTime);
        vElevation = elevation;
        pos.z += elevation;

        // Accurate normal computation via finite difference
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

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying float vElevation;
      varying vec2 vLocalPos;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Fresnel term (soft glancing light)
        float NdotV = max(dot(normal, viewDir), 0.0);
        float fresnel = pow(1.0 - NdotV, 3.0);

        // Obsidian deep graphite base color
        vec3 baseColor = vec3(0.032, 0.032, 0.038);

        // Key light specular highlight (studio overhead spotlight)
        vec3 lightDir1 = normalize(vec3(0.6, 1.6, 2.2));
        vec3 halfDir1 = normalize(lightDir1 + viewDir);
        float spec1 = pow(max(dot(normal, halfDir1), 0.0), 32.0);

        // Secondary soft rim light
        vec3 lightDir2 = normalize(vec3(-1.2, -0.8, 1.0));
        vec3 halfDir2 = normalize(lightDir2 + viewDir);
        float spec2 = pow(max(dot(normal, halfDir2), 0.0), 16.0);

        // Reactive Cursor Caustic Spotlight
        float distToMouse = length(vLocalPos - uMouse);
        float cursorSpotlight = exp(-distToMouse * 0.95);
        vec3 cursorLightDir = normalize(vec3(uMouse - vLocalPos, 1.4));
        vec3 halfCursor = normalize(cursorLightDir + viewDir);
        float cursorSpec = pow(max(dot(normal, halfCursor), 0.0), 24.0);

        // Subtle Swiss Red ember undertone (#FF3B30) along wave crests and near cursor
        vec3 redEmber = vec3(1.0, 0.23, 0.19);
        float crestFactor = smoothstep(0.1, 0.42, vElevation);

        // Mix composition
        vec3 color = baseColor;
        color += redEmber * (crestFactor * 0.05 + fresnel * 0.035 + cursorSpotlight * 0.06);
        color += vec3(0.9, 0.95, 1.0) * spec1 * 0.35;
        color += vec3(0.6, 0.7, 0.8) * spec2 * 0.15;
        color += vec3(1.0) * fresnel * 0.14;
        color += vec3(1.0, 0.95, 0.9) * cursorSpec * (0.35 + uMouseSpeed * 0.45);

        // Vignette fade towards screen edges
        float edgeVignette = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x) *
                             smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);

        float alpha = clamp((0.45 + vElevation * 0.45 + spec1 * 0.5 + cursorSpotlight * 0.2) * edgeVignette, 0.0, 0.88);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // 3. High-density Plane Geometry & Mesh
    const geometry = new THREE.PlaneGeometry(17, 12, 144, 144);
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
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const planeMesh = new THREE.Mesh(geometry, material);
    planeMesh.rotation.x = -Math.PI * 0.28;
    scene.add(planeMesh);

    // 4. Raycasting & Mouse Events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      ndcMouse.x = (clientX / width) * 2 - 1;
      ndcMouse.y = -(clientY / height) * 2 + 1;

      raycaster.setFromCamera(ndcMouse, camera);
      const intersects = raycaster.intersectObject(planeMesh);

      if (intersects.length > 0) {
        const uv = intersects[0].uv;
        if (uv) {
          // Map UV to plane geometry local coordinates [-8.5 to 8.5, -6 to 6]
          const pX = (uv.x - 0.5) * 17;
          const pY = (uv.y - 0.5) * 12;
          mouseRef.current.targetPlaneX = pX;
          mouseRef.current.targetPlaneY = pY;
        }
      } else {
        // Fallback approximation
        mouseRef.current.targetPlaneX = ndcMouse.x * 6.5;
        mouseRef.current.targetPlaneY = ndcMouse.y * 4.5;
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
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
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

      // Lerp mouse plane coordinates
      const m = mouseRef.current;
      const prevX = m.planeX;
      const prevY = m.planeY;

      m.planeX += (m.targetPlaneX - m.planeX) * 0.12;
      m.planeY += (m.targetPlaneY - m.planeY) * 0.12;

      // Compute physical velocity vector
      const vx = (m.planeX - prevX) / Math.max(delta, 0.001);
      const vy = (m.planeY - prevY) / Math.max(delta, 0.001);
      const speed = Math.sqrt(vx * vx + vy * vy);
      const normVx = speed > 0.01 ? vx / speed : 0;
      const normVy = speed > 0.01 ? vy / speed : 0;

      m.velX += (normVx - m.velX) * 0.15;
      m.velY += (normVy - m.velY) * 0.15;
      m.speed += (Math.min(speed * 0.05, 1.5) - m.speed) * 0.12;

      // Update click impulse timer
      m.clickTime += delta;

      // Update shader uniforms
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uMouse.value.set(m.planeX, m.planeY);
      material.uniforms.uMouseVel.value.set(m.velX, m.velY);
      material.uniforms.uMouseSpeed.value = m.speed;
      material.uniforms.uClickTime.value = m.clickTime;
      material.uniforms.uClickImpulse.value = m.clickImpulse;

      // Gentle plane rotation tracking
      planeMesh.rotation.z = Math.sin(elapsedTime * 0.15) * 0.03 + (m.planeX / 17) * 0.08;

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

  const scrollFade = Math.max(0, 1 - offset * 0.0025);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ opacity: scrollFade }}
      aria-hidden="true"
    />
  );
};

export default HeroFluidCanvas;
