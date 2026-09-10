import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  GLOBAL_INCIDENTS,
  VESSEL_ROUTES,
  latLngToVector3,
  createCurvedArc,
  createWorldCoastlineGeometry,
  createVectorGraticule,
  generateAtmosphereCloudsTexture,
} from "./earthUtils";

interface ScrollyGlobeBackgroundProps {
  scrollProgress: number; // 0.0 (top) to 1.0 (bottom)
  activeStage: number; // 0: Orbit, 1: Pinpoint INC-0417, 2: Drift, 3: AIS, 4: Global
}

export function ScrollyGlobeBackground({ scrollProgress, activeStage }: ScrollyGlobeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to keep across renders
  const targetRotationRef = useRef({ x: 0.25, y: -0.5 });
  const currentRotationRef = useRef({ x: 0.25, y: -0.5 });
  const targetDistanceRef = useRef(7.5);
  const currentDistanceRef = useRef(7.5);
  const activeStageRef = useRef(activeStage);

  const bloomRef = useRef(0);

  // Update target orientation based on scroll progress and active stage
  useEffect(() => {
    activeStageRef.current = activeStage;
    // Shellcreek coordinates: lat 58.42, lng -6.11
    const shellcreekPhi = (58.42 * Math.PI) / 180;
    const shellcreekTheta = (-6.11 * Math.PI) / 180;

    const shellcreekRotX = shellcreekPhi * 0.8;
    const shellcreekRotY = -shellcreekTheta - Math.PI / 2;

    if (scrollProgress < 0.15) {
      // Stage 0: High Orbit Overview (Original cinematic large globe scale)
      targetRotationRef.current = { x: 0.25, y: -0.5 + scrollProgress * 0.6 };
      targetDistanceRef.current = 7.5 - scrollProgress * 3.5;
      bloomRef.current = 0;
    } else if (scrollProgress >= 0.15 && scrollProgress < 0.42) {
      // Stage 1: Dive down to Shellcreek Pinpoint (Balanced zoom: 4.75 so no clipping!)
      targetRotationRef.current = { x: shellcreekRotX, y: shellcreekRotY };
      targetDistanceRef.current = 4.75;
      bloomRef.current = 1.0;
    } else if (scrollProgress >= 0.42 && scrollProgress < 0.68) {
      // Stage 2: Oblique perspective on Hydrodynamic Drift Plume
      targetRotationRef.current = { x: shellcreekRotX - 0.1, y: shellcreekRotY + 0.2 };
      targetDistanceRef.current = 4.9;
      bloomRef.current = 0.8;
    } else if (scrollProgress >= 0.68 && scrollProgress < 0.88) {
      // Stage 3: Pull back to AIS Corridors
      targetRotationRef.current = { x: 0.48, y: -shellcreekTheta - 1.0 };
      targetDistanceRef.current = 5.6;
      bloomRef.current = 0.4;
    } else {
      // Stage 4: Tactical Command Pull-back
      targetRotationRef.current = { x: 0.35, y: -0.7 };
      targetDistanceRef.current = 7.0;
      bloomRef.current = 0.2;
    }
  }, [scrollProgress, activeStage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene with pure #000000 background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, currentDistanceRef.current);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Multi-Depth Starfield in Pure Black Space
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 100;
      starPositions[i + 1] = (Math.random() - 0.5) * 100;
      starPositions[i + 2] = -10 - Math.random() * 50;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xc8e6f5,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
    keyLight.position.set(15, 12, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.0);
    rimLight.position.set(-15, -10, -10);
    scene.add(rimLight);

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 2.5;

    // Earth Oceanic Base Sphere (Deep obsidian void ocean)
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x01050e,
      roughness: 0.9,
      metalness: 0.15,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // True 3D Vector Coastlines (Real Natural Earth vector data — NEVER PIXELATES AT ANY ZOOM!)
    const coastlineGeo = createWorldCoastlineGeometry(GLOBE_RADIUS * 1.002);
    const coastlineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
    });
    const coastlinesMesh = new THREE.LineSegments(coastlineGeo, coastlineMat);
    globeGroup.add(coastlinesMesh);

    // Continental Shelf Bathymetry Vector Depth Halo
    const shelfGeo = createWorldCoastlineGeometry(GLOBE_RADIUS * 1.0008);
    const shelfMat = new THREE.LineBasicMaterial({
      color: 0x005577,
      transparent: true,
      opacity: 0.35,
    });
    const shelfMesh = new THREE.LineSegments(shelfGeo, shelfMat);
    globeGroup.add(shelfMesh);

    // True 3D Vector Nautical Graticule (Parallels & Meridians)
    const graticule = createVectorGraticule(GLOBE_RADIUS * 1.001);
    globeGroup.add(graticule);

    // Atmospheric Rayleigh Scattering Glow Shader (Laser Electric Cyan #00f0ff)
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.6);
          gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 1.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // Weather / Atmospheric Swirl Layer (Adds 3D Parallax Depth)
    const cloudsTexture = generateAtmosphereCloudsTexture();
    const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 48, 48);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);

    // Sentinel-1 Orbital Trail Path
    const orbitPts: THREE.Vector3[] = [];
    const ORBIT_RADIUS = 3.65;
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      orbitPts.push(
        new THREE.Vector3(
          Math.cos(theta) * ORBIT_RADIUS,
          Math.sin(theta * 1.4) * 0.9,
          Math.sin(theta) * ORBIT_RADIUS
        )
      );
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
    const orbitMat = new THREE.LineDashedMaterial({
      color: 0x00f0ff,
      dashSize: 0.18,
      gapSize: 0.14,
      transparent: true,
      opacity: 0.28,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.computeLineDistances();
    scene.add(orbitLine);

    // 7. Tactical Pinpoint Reticles (NO GIANT DOTS / CLUSTERS!)
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);

    interface ReticleItem {
      pinMesh: THREE.Mesh;
      sonarRing: THREE.LineLoop;
      diamondReticle: THREE.LineLoop;
      brackets?: THREE.LineSegments;
      isShellcreek: boolean;
      color: number;
    }
    const reticleItems: ReticleItem[] = [];

    // Helper: create fine circle line loop
    const createCircleLine = (radius: number, segments: number, color: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
        linewidth: 1,
      });
      return new THREE.LineLoop(geo, mat);
    };

    // Helper: create fine tactical diamond loop
    const createDiamond = (size: number, color: number) => {
      const pts = [
        new THREE.Vector3(0, size, 0),
        new THREE.Vector3(size, 0, 0),
        new THREE.Vector3(0, -size, 0),
        new THREE.Vector3(-size, 0, 0),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
      });
      return new THREE.LineLoop(geo, mat);
    };

    // Helper: create 4 corner targeting brackets [ + ]
    const createCornerBrackets = (size: number, len: number, color: number) => {
      const pts: THREE.Vector3[] = [
        // Top-left
        new THREE.Vector3(-size, size - len, 0),
        new THREE.Vector3(-size, size, 0),
        new THREE.Vector3(-size, size, 0),
        new THREE.Vector3(-size + len, size, 0),
        // Top-right
        new THREE.Vector3(size - len, size, 0),
        new THREE.Vector3(size, size, 0),
        new THREE.Vector3(size, size, 0),
        new THREE.Vector3(size, size - len, 0),
        // Bottom-right
        new THREE.Vector3(size, -size + len, 0),
        new THREE.Vector3(size, -size, 0),
        new THREE.Vector3(size, -size, 0),
        new THREE.Vector3(size - len, -size, 0),
        // Bottom-left
        new THREE.Vector3(-size + len, -size, 0),
        new THREE.Vector3(-size, -size, 0),
        new THREE.Vector3(-size, -size, 0),
        new THREE.Vector3(-size, -size + len, 0),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
      });
      return new THREE.LineSegments(geo, mat);
    };

    GLOBAL_INCIDENTS.forEach((inc) => {
      const pos = latLngToVector3(inc.lat, inc.lng, GLOBE_RADIUS * 1.012);
      const isShellcreek = inc.id === "INC-0417";
      const color = inc.severity === "critical" ? 0xff3b30 : inc.severity === "elevated" ? 0xf59e0b : 0x00f0ff;

      // Micro-pinpoint center dot (hairline precision)
      const pinGeo = new THREE.SphereGeometry(isShellcreek ? 0.008 : 0.006, 8, 8);
      const pinMat = new THREE.MeshBasicMaterial({ color: isShellcreek ? 0x00f0ff : color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinsGroup.add(pinMesh);

      // Fine tactical diamond reticle
      const diamondReticle = createDiamond(isShellcreek ? 0.05 : 0.03, isShellcreek ? 0x00f0ff : color);
      diamondReticle.position.copy(pos);
      diamondReticle.lookAt(new THREE.Vector3(0, 0, 0));
      pinsGroup.add(diamondReticle);

      // Fine sonar pulse line loop
      const sonarRing = createCircleLine(isShellcreek ? 0.075 : 0.045, 36, color);
      sonarRing.position.copy(pos);
      sonarRing.lookAt(new THREE.Vector3(0, 0, 0));
      pinsGroup.add(sonarRing);

      let brackets: THREE.LineSegments | undefined;
      if (isShellcreek) {
        brackets = createCornerBrackets(0.085, 0.025, 0x00f0ff);
        brackets.position.copy(pos);
        brackets.lookAt(new THREE.Vector3(0, 0, 0));
        pinsGroup.add(brackets);
      }

      reticleItems.push({ pinMesh, sonarRing, diamondReticle, brackets, isShellcreek, color });
    });

    // 8. Subtle Translucent Oil Spill Radar Slick on Sea Surface (Clean hydrodynamic ellipse)
    const spillSheenPos = latLngToVector3(58.42, -6.11, GLOBE_RADIUS * 1.008);
    const sheenPoints: THREE.Vector3[] = [];
    const sheenSegments = 48;
    for (let i = 0; i < sheenSegments; i++) {
      const t = (i / sheenSegments) * Math.PI * 2;
      const rx = 0.09;
      const ry = 0.035;
      sheenPoints.push(new THREE.Vector3(Math.cos(t) * rx, Math.sin(t) * ry, 0));
    }
    const sheenLineGeo = new THREE.BufferGeometry().setFromPoints(sheenPoints);
    const sheenLineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.55,
    });
    const spillSheen = new THREE.LineLoop(sheenLineGeo, sheenLineMat);
    spillSheen.position.copy(spillSheenPos);
    spillSheen.lookAt(new THREE.Vector3(0, 0, 0));
    spillSheen.rotateZ(0.65);
    globeGroup.add(spillSheen);

    // 9. AIS Vessel Routes with Traveling Light Pulses
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);

    const arcPulses: { curve: THREE.Vector3[]; progress: number; pulseMesh: THREE.Mesh }[] = [];

    VESSEL_ROUTES.forEach((route) => {
      const startVec = latLngToVector3(route.from.lat, route.from.lng, GLOBE_RADIUS * 1.01);
      const endVec = latLngToVector3(route.to.lat, route.to.lng, GLOBE_RADIUS * 1.01);
      const arcPoints = createCurvedArc(startVec, endVec, 0.15, 36);

      const curveGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(route.color === "#f16456" ? "#ff3b30" : "#00f0ff"),
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcsGroup.add(arcLine);

      // Sleek micro-photon beacon (no bulky solid sphere)
      const pulseGeo = new THREE.SphereGeometry(0.009, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(route.color === "#f16456" ? "#ff3b30" : "#00f0ff"),
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(arcPoints[0]);
      arcsGroup.add(pulseMesh);

      arcPulses.push({
        curve: arcPoints,
        progress: Math.random(),
        pulseMesh,
      });
    });

    // 10. REAL SATELLITE RADAR SCANNING ENGINE
    // The satellite orbits Earth and its radar cone continuously projects straight down onto Earth's surface!
    const satellitePivot = new THREE.Group();
    scene.add(satellitePivot);

    const satCraft = new THREE.Group();
    satellitePivot.add(satCraft);

    // Satellite Bus Body with aerospace gold Kapton MLI foil insulation
    const satBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.06, 0.14),
      new THREE.MeshStandardMaterial({
        color: 0xdfa037,
        metalness: 0.85,
        roughness: 0.25,
      })
    );
    satCraft.add(satBody);

    // Sentinel-1 12-meter deployable SAR antenna array (underside pointing at Earth)
    const sarAntennaGeo = new THREE.BoxGeometry(0.035, 0.012, 0.28);
    const sarAntennaMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x004455,
    });
    const sarAntenna = new THREE.Mesh(sarAntennaGeo, sarAntennaMat);
    sarAntenna.position.set(0, -0.035, 0.02);
    satCraft.add(sarAntenna);

    // Solar array wings (deep space silicon blue/cyan)
    const satPanels = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.006, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x00c4e6,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x001a26,
      })
    );
    satCraft.add(satPanels);

    // Blinking telemetry LED on satellite
    const beaconGeo = new THREE.SphereGeometry(0.016, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.set(0, 0.038, 0);
    satCraft.add(beaconMesh);

    // Dedicated Radar Scanning Cone that spans from satellite directly to Earth!
    // Satellite is at radius 3.65. Earth surface is at radius 2.5. Distance = 1.15.
    const BEAM_HEIGHT = 1.15;
    const radarConeGeo = new THREE.ConeGeometry(0.42, BEAM_HEIGHT, 24, 1, true);
    // Rotate cone so apex is at satellite (z = 0) and wide base touches Earth surface (z = BEAM_HEIGHT)
    radarConeGeo.rotateX(-Math.PI / 2);
    radarConeGeo.translate(0, 0, BEAM_HEIGHT / 2);

    const radarConeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.16,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const radarCone = new THREE.Mesh(radarConeGeo, radarConeMat);
    satCraft.add(radarCone);

    // Traveling microwave radar pulses along the beam
    const pulseCount = 3;
    const beamPulseMeshes: THREE.LineLoop[] = [];
    for (let p = 0; p < pulseCount; p++) {
      const ringGeo = new THREE.BufferGeometry();
      const ringPts: THREE.Vector3[] = [];
      const segs = 32;
      for (let s = 0; s < segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0));
      }
      ringGeo.setFromPoints(ringPts);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.7,
      });
      const pulseLoop = new THREE.LineLoop(ringGeo, ringMat);
      satCraft.add(pulseLoop);
      beamPulseMeshes.push(pulseLoop);
    }

    // Ground Radar Footprint on Earth's surface under the satellite
    const groundSwathGeo = new THREE.RingGeometry(0.02, 0.42, 36);
    const groundSwathMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const groundSwath = new THREE.Mesh(groundSwathGeo, groundSwathMat);
    scene.add(groundSwath);

    // Fine scanning sweep line on ground footprint
    const sweepLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.4, 0, 0),
    ]);
    const sweepLineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.95 });
    const sweepLine = new THREE.Line(sweepLineGeo, sweepLineMat);
    groundSwath.add(sweepLine);

    // 11. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera distance interpolation
      currentDistanceRef.current += (targetDistanceRef.current - currentDistanceRef.current) * 0.06;
      camera.position.z = currentDistanceRef.current;

      // Smooth globe rotation interpolation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.06;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.06;

      globeGroup.rotation.x = currentRotationRef.current.x;
      globeGroup.rotation.y = currentRotationRef.current.y;

      // Rotate ethereal weather clouds for 3D parallax
      cloudsMesh.rotation.y = elapsedTime * 0.022;
      cloudsMesh.rotation.x = Math.sin(elapsedTime * 0.01) * 0.04;

      // Blink satellite beacon LED (red / cyan)
      beaconMat.color.setHex(Math.sin(elapsedTime * 8) > 0 ? 0xff3b30 : 0x00f0ff);

      // Only show global vessel route arcs during Stage 0 (Orbit) and Stage 3/4 (AIS/Console)
      arcsGroup.visible = activeStageRef.current !== 1 && activeStageRef.current !== 2;

      // Animate Hairline Reticles (NO CLIPPING, NO GIANT DISCS!)
      const bloom = bloomRef.current;
      reticleItems.forEach(({ sonarRing, diamondReticle, brackets, isShellcreek }, idx) => {
        const speed = isShellcreek ? 2.6 : 1.8;
        const phase = (elapsedTime * speed + idx * 0.7) % Math.PI;

        // Sonar ring pulses outward delicately
        const scale = 1 + Math.sin(phase) * (isShellcreek ? 0.6 : 0.35);
        sonarRing.scale.set(scale, scale, 1);
        (sonarRing.material as THREE.LineBasicMaterial).opacity = Math.max(0, 0.85 - Math.sin(phase) * 0.8);

        // Tactical diamond reticle rotates slowly
        diamondReticle.rotation.z = elapsedTime * (isShellcreek ? 0.5 : 0.25);
        const diamondScale = 1 + bloom * 0.25;
        diamondReticle.scale.set(diamondScale, diamondScale, 1);

        // Corner brackets breathe gently on target lock
        if (brackets) {
          brackets.rotation.z = -elapsedTime * 0.2;
          const bracketPulse = 1 + Math.sin(elapsedTime * 3) * 0.08;
          brackets.scale.set(bracketPulse, bracketPulse, 1);
        }
      });

      // Animate Oil Spill Sheen
      const sheenPulse = 1 + Math.sin(elapsedTime * 1.5) * 0.1;
      spillSheen.scale.set(sheenPulse, sheenPulse, 1);

      // Animate AIS traveling pulses
      arcPulses.forEach((ap) => {
        ap.progress = (ap.progress + 0.007) % 1;
        const ptIdx = Math.floor(ap.progress * (ap.curve.length - 1));
        if (ap.curve[ptIdx]) {
          ap.pulseMesh.position.copy(ap.curve[ptIdx]);
        }
      });

      // REAL ORBIT & SURFACE RADAR SCANNING COMPUTATION:
      // The satellite flies along an inclined orbit
      const orbitSpeed = 0.35;
      const orbitAngle = elapsedTime * orbitSpeed;
      const ORBIT_RADIUS = 3.65;

      const satX = Math.cos(orbitAngle) * ORBIT_RADIUS;
      const satZ = Math.sin(orbitAngle) * ORBIT_RADIUS;
      const satY = Math.sin(orbitAngle * 1.4) * 0.9;

      satCraft.position.set(satX, satY, satZ);
      // Look directly at the center of the Earth!
      satCraft.lookAt(0, 0, 0);

      // Pulse the radar scanning cone
      (radarCone.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(elapsedTime * 4) * 0.06;

      // Animate traveling microwave radar pulses along the beam down to Earth
      beamPulseMeshes.forEach((mesh, idx) => {
        const progress = (elapsedTime * 0.9 + idx / pulseCount) % 1;
        const zPos = progress * BEAM_HEIGHT;
        const radius = (zPos / BEAM_HEIGHT) * 0.42;
        mesh.position.set(0, 0, zPos);
        mesh.scale.set(radius, radius, 1);
        (mesh.material as THREE.LineBasicMaterial).opacity = Math.sin(progress * Math.PI) * 0.8;
      });

      // Position the ground footprint on the Earth's surface directly beneath the satellite
      const subSatVector = satCraft.position.clone().normalize().multiplyScalar(GLOBE_RADIUS * 1.006);
      groundSwath.position.copy(subSatVector);
      // Align ground footprint tangent to Earth's surface
      groundSwath.lookAt(subSatVector.clone().multiplyScalar(2));

      // Rotate ground sweep line inside footprint
      sweepLine.rotation.z = elapsedTime * 4.5;
      const swathPulse = 1 + Math.sin(elapsedTime * 3) * 0.15;
      groundSwath.scale.set(swathPulse, swathPulse, 1);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#000000] overflow-hidden"
    />
  );
}
