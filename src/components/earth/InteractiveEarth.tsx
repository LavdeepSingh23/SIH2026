import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  GLOBAL_INCIDENTS,
  VESSEL_ROUTES,
  latLngToVector3,
  createCurvedArc,
  createWorldCoastlineGeometry,
  createVectorGraticule,
  type IncidentHotspot,
} from "./earthUtils";

interface InteractiveEarthProps {
  selectedIncident: IncidentHotspot | null;
  onSelectIncident: (incident: IncidentHotspot) => void;
  showSARLayer?: boolean;
  showAISLayer?: boolean;
  showDriftLayer?: boolean;
}

export function InteractiveEarth({
  selectedIncident,
  onSelectIncident,
  showSARLayer = true,
  showAISLayer = true,
  showDriftLayer = true,
}: InteractiveEarthProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredIncident, setHoveredIncident] = useState<IncidentHotspot | null>(null);

  // Scene references to preserve during animation loops
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const sarSatelliteRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);

  // Interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.3, y: -0.6 });
  const currentRotationRef = useRef({ x: 0.3, y: -0.6 });
  const cameraDistanceRef = useRef(7.5);
  const targetDistanceRef = useRef(7.5);
  const autoRotateRef = useRef(true);


  // Fly to incident when selectedIncident changes
  const flyToIncident = useCallback((incident: IncidentHotspot) => {
    // Lat / Lng to target spherical rotation
    const phi = (incident.lat * Math.PI) / 180;
    const theta = (incident.lng * Math.PI) / 180;

    // Set rotation to face the camera
    targetRotationRef.current = {
      x: phi * 0.8,
      y: -theta - Math.PI / 2,
    };
    targetDistanceRef.current = 5.2; // Zoom in
    autoRotateRef.current = false;
  }, []);

  useEffect(() => {
    if (selectedIncident) {
      flyToIncident(selectedIncident);
    }
  }, [selectedIncident, flyToIncident]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistanceRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x35d6c4, 2.0);
    dirLight1.position.set(15, 10, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4fa3e8, 1.0);
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    // 3. Earth Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const GLOBE_RADIUS = 2.5;

    // Globe Mesh: Deep obsidian void ocean
    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x01050e,
      roughness: 0.9,
      metalness: 0.15,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // True 3D Vector Coastlines
    const coastlineGeo = createWorldCoastlineGeometry(GLOBE_RADIUS * 1.002);
    const coastlineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
    });
    globeGroup.add(new THREE.LineSegments(coastlineGeo, coastlineMat));

    // Continental Shelf Bathymetry
    const shelfGeo = createWorldCoastlineGeometry(GLOBE_RADIUS * 1.0008);
    const shelfMat = new THREE.LineBasicMaterial({
      color: 0x005577,
      transparent: true,
      opacity: 0.35,
    });
    globeGroup.add(new THREE.LineSegments(shelfGeo, shelfMat));

    // Vector Graticule
    globeGroup.add(createVectorGraticule(GLOBE_RADIUS * 1.001));

    // Atmosphere Glow Mesh
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.04, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
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
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.208, 0.839, 0.769, 1.0) * intensity * 1.3;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Subtle outer bathymetry wireframe ring
    const gridGeometry = new THREE.RingGeometry(GLOBE_RADIUS * 1.18, GLOBE_RADIUS * 1.2, 64);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x1b3247,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const gridRing = new THREE.Mesh(gridGeometry, gridMaterial);
    gridRing.rotation.x = Math.PI / 2;
    globeGroup.add(gridRing);

    // 4. Incident Markers & Pulsing Beacons
    const markersGroup = new THREE.Group();
    globeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const markerMeshes: { mesh: THREE.Mesh; incident: IncidentHotspot; ring: THREE.Mesh }[] = [];

    GLOBAL_INCIDENTS.forEach((incident) => {
      const pos = latLngToVector3(incident.lat, incident.lng, GLOBE_RADIUS * 1.01);
      const color = incident.severity === "critical" ? 0xf16456 : incident.severity === "elevated" ? 0xe8b23d : 0x35d6c4;

      // Center sphere pin
      const pinGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { incident };
      markersGroup.add(pinMesh);

      // Radiating wave ring
      const ringGeo = new THREE.RingGeometry(0.07, 0.12, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0)); // Align with surface normal
      markersGroup.add(ringMesh);

      markerMeshes.push({ mesh: pinMesh, incident, ring: ringMesh });
    });

    // 5. AIS Vessel Trajectory Arcs
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    const arcPulses: { curve: THREE.Vector3[]; progress: number; pulseMesh: THREE.Mesh }[] = [];

    VESSEL_ROUTES.forEach((route) => {
      const startVec = latLngToVector3(route.from.lat, route.from.lng, GLOBE_RADIUS * 1.01);
      const endVec = latLngToVector3(route.to.lat, route.to.lng, GLOBE_RADIUS * 1.01);
      const arcPoints = createCurvedArc(startVec, endVec, 0.18, 40);

      const curveGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(route.color),
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5,
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcsGroup.add(arcLine);

      // Light pulse particle that travels along the arc
      const pulseGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(route.color),
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

    // 6. Orbital Sentinel-1 SAR Satellite with Scanning Radar Cone
    const satelliteGroup = new THREE.Group();
    globeGroup.add(satelliteGroup);
    sarSatelliteRef.current = satelliteGroup;

    const satBodyGeo = new THREE.BoxGeometry(0.08, 0.05, 0.12);
    const satBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(0.35, 0.005, 0.08);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x35d6c4 });
    const panels = new THREE.Mesh(panelGeo, panelMat);
    satBody.add(panels);

    // Radar scan cone projected toward earth
    const coneGeo = new THREE.ConeGeometry(0.4, 0.9, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x35d6c4,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(0, -0.45, 0);
    satBody.add(cone);

    satBody.position.set(0, 0, GLOBE_RADIUS * 1.5);
    satelliteGroup.add(satBody);

    // 7. Raycasting for Pin Click & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle dragging rotation
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x += deltaY * 0.005;

        // Clamp latitude rotation to avoid flipping
        targetRotationRef.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, targetRotationRef.current.x));

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      } else {
        // Raycast hover check
        raycaster.setFromCamera(mouse, camera);
        const clickablePins = markerMeshes.map((m) => m.mesh);
        const intersects = raycaster.intersectObjects(clickablePins);

        if (intersects.length > 0) {
          container.style.cursor = "pointer";
          const hitPin = intersects[0].object;
          setHoveredIncident(hitPin.userData.incident as IncidentHotspot);
        } else {
          container.style.cursor = "grab";
          setHoveredIncident(null);
        }
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaMoved = Math.hypot(
          e.clientX - previousMousePositionRef.current.x,
          e.clientY - previousMousePositionRef.current.y
        );
        isDraggingRef.current = false;

        // If it was a clean click without major drag
        if (deltaMoved < 4) {
          const rect = container.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(markerMeshes.map((m) => m.mesh));
          if (intersects.length > 0) {
            const selected = intersects[0].object.userData.incident as IncidentHotspot;
            onSelectIncident(selected);
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      autoRotateRef.current = false;
      targetDistanceRef.current += e.deltaY * 0.004;
      // Clamp zoom distance between 3.6 and 11
      targetDistanceRef.current = Math.max(3.6, Math.min(11, targetDistanceRef.current));
    };

    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    container.addEventListener("wheel", handleWheel, { passive: false });

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera zoom interpolation
      cameraDistanceRef.current += (targetDistanceRef.current - cameraDistanceRef.current) * 0.08;
      camera.position.z = cameraDistanceRef.current;

      // Auto rotation when idle
      if (autoRotateRef.current) {
        targetRotationRef.current.y += 0.0018;
      }

      // Smooth globe rotation interpolation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      globeGroup.rotation.x = currentRotationRef.current.x;
      globeGroup.rotation.y = currentRotationRef.current.y;

      // Animate pulsing incident rings
      markerMeshes.forEach(({ ring }, idx) => {
        const pulsePhase = (elapsedTime * 2.5 + idx * 0.8) % Math.PI;
        const scale = 1 + Math.sin(pulsePhase) * 0.8;
        ring.scale.set(scale, scale, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 - Math.sin(pulsePhase) * 0.7);
      });

      // Animate AIS route pulses
      if (arcsGroupRef.current) {
        arcsGroupRef.current.visible = showAISLayer;
        arcPulses.forEach((ap) => {
          ap.progress = (ap.progress + 0.008) % 1;
          const pointIdx = Math.floor(ap.progress * (ap.curve.length - 1));
          if (ap.curve[pointIdx]) {
            ap.pulseMesh.position.copy(ap.curve[pointIdx]);
          }
        });
      }

      // Animate Sentinel-1 orbit
      if (sarSatelliteRef.current) {
        sarSatelliteRef.current.visible = showSARLayer;
        sarSatelliteRef.current.rotation.y = elapsedTime * 0.45;
        sarSatelliteRef.current.rotation.x = Math.sin(elapsedTime * 0.25) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      container.removeEventListener("wheel", handleWheel);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectIncident, showAISLayer, showSARLayer, showDriftLayer]);

  return (
    <div className="relative w-full h-full min-h-[440px] select-none">
      {/* 3D Canvas mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover tooltip for incident markers */}
      {hoveredIncident && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-panel/95 backdrop-blur-md border border-border-soft rounded-lg px-3.5 py-2.5 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                hoveredIncident.severity === "critical"
                  ? "bg-red animate-ping"
                  : hoveredIncident.severity === "elevated"
                  ? "bg-amber"
                  : "bg-teal"
              }`}
            />
            <span className="text-[13px] font-bold text-text">{hoveredIncident.name}</span>
            <span className="text-[10px] font-mono text-text-faint">{hoveredIncident.id}</span>
          </div>
          <div className="text-[11.5px] text-teal font-semibold mt-1">
            {hoveredIncident.region} · {hoveredIncident.spillTonnage}
          </div>
          <div className="text-[10.5px] text-text-muted mt-0.5 max-w-[240px]">{hoveredIncident.description}</div>
        </div>
      )}
    </div>
  );
}
