"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Premium WebGL Fluid Aurora Shader
 * Renders a slow-moving, buttery smooth liquid gradient using Simplex 3D Noise.
 * Extremely high-performance compared to thousands of individual particles.
 */
export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (!isMobile && !prefersReduced && gl) {
      setShouldRender(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldRender || !containerRef.current) return;

    const container = containerRef.current;
    let animationId: number;
    let destroyed = false;

    // ── Renderer Setup ─────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });

    // Lower pixel ratio ensures buttery 60fps even on weak devices
    // because shader math is calculated per-pixel.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    
    // Orthographic camera is perfect for full-screen 2D plane rendering
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // ── The Shader Material ────────────────────────────────
    // Uses 3D Simplex Noise ported to GLSL
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor1; // Meshark Cyan
      uniform vec3 uColor2; // Meshark Purple
      uniform vec3 uColor3; // Dark Blue
      uniform vec3 uBg;     // Deep Void Black
      
      varying vec2 vUv;

      // Ashima's WebGL-noise-3D (Simplex)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        // Adjust coordinates for aspect ratio
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;
        
        // Offset UV to center
        vec2 uv = vUv - 0.5;
        
        // Generate super slow, flowing noise fields
        float time = uTime * 0.15;
        float n1 = snoise(vec3(st * 1.2, time));
        float n2 = snoise(vec3(st * 2.0 + 5.0, time * 1.2));
        float n3 = snoise(vec3(st * 0.8 - 3.0, time * 0.8));
        
        // Mix noise to create a liquid flow map
        float flow = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
        
        // Smooth out the bounds to make sweeping blobs
        flow = smoothstep(-0.2, 0.8, flow);
        
        // Map flow value to gradient colors
        vec3 finalColor = uBg;
        
        // Add layers of color based on flow depth
        float layer1 = smoothstep(0.1, 0.5, flow);
        float layer2 = smoothstep(0.3, 0.7, flow);
        float layer3 = smoothstep(0.6, 0.9, flow);
        
        finalColor = mix(finalColor, uColor3, layer1 * 0.4); // Dark blue base
        finalColor = mix(finalColor, uColor2, layer2 * 0.5); // Purple mid
        finalColor = mix(finalColor, uColor1, layer3 * 0.6); // Cyan bright tip
        
        // Deep Vignette from the edges to focus on center
        float dist = length(uv);
        float vignette = smoothstep(0.8, 0.1, dist);
        finalColor *= vignette;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uColor1: { value: new THREE.Color(0x00e6a4) }, // Meshark Cyan
        uColor2: { value: new THREE.Color(0x7a22e1) }, // Meshark Purple
        uColor3: { value: new THREE.Color(0x0044ff) }, // Deep Blue
        uBg: { value: new THREE.Color(0x050607) },     // Deep Slate Dark
      },
      vertexShader,
      fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // ── Animation Loop ─────────────────────────────────────
    const clock = new THREE.Clock();

    function animate() {
      if (destroyed) return;
      animationId = requestAnimationFrame(animate);
      
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }

    animate();

    // ── Resize Handler ─────────────────────────────────────
    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    }

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      destroyed = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
