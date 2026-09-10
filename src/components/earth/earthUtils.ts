import * as THREE from "three";
import { WORLD_COASTLINES } from "../../assets/worldCoastlinesData";

export interface IncidentHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: "critical" | "elevated" | "watch";
  spillTonnage: string;
  suspect: string;
  confidence: number;
  region: string;
  description: string;
}

export const GLOBAL_INCIDENTS: IncidentHotspot[] = [
  {
    id: "INC-0417",
    name: "Shellcreek Strait",
    lat: 58.42,
    lng: -6.11,
    severity: "critical",
    spillTonnage: "1,240 tonnes",
    suspect: "M/T Nordblom (Panama)",
    confidence: 87,
    region: "North Sea / Hebrides",
    description: "Active crude slick detected by Sentinel-1. AIS gap 38 min during transit.",
  },
  {
    id: "INC-0418",
    name: "Strait of Gibraltar",
    lat: 35.98,
    lng: -5.6,
    severity: "elevated",
    spillTonnage: "310 tonnes",
    suspect: "M/T Kestrel (Marshall Is.)",
    confidence: 61,
    region: "Mediterranean / Atlantic Gate",
    description: "Fuel oil sheen drifting southwest toward coastal fishery boundary.",
  },
  {
    id: "INC-0419",
    name: "Bab-el-Mandeb",
    lat: 12.58,
    lng: 43.33,
    severity: "watch",
    spillTonnage: "Monitoring (<80 t)",
    suspect: "M/T Vale (Liberia)",
    confidence: 34,
    region: "Red Sea Choke Point",
    description: "Low-reflectivity anomalous radar patch under dispersion observation.",
  },
  {
    id: "WATCH-01",
    name: "Strait of Malacca",
    lat: 2.5,
    lng: 101.8,
    severity: "elevated",
    spillTonnage: "Watch Alert",
    suspect: "Unflagged Dark Vessel",
    confidence: 72,
    region: "Southeast Asia",
    description: "Bunkering anomaly with speed reduction and AIS transponder deactivation.",
  },
  {
    id: "WATCH-02",
    name: "Strait of Hormuz",
    lat: 26.5,
    lng: 56.4,
    severity: "critical",
    spillTonnage: "High Risk Area",
    suspect: "Multiple Tankers",
    confidence: 81,
    region: "Arabian Sea Corridor",
    description: "Thermal and SAR cross-analysis flagging unauthorized bilge release.",
  },
];

export interface VesselRoute {
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  color: string;
}

export const VESSEL_ROUTES: VesselRoute[] = [
  {
    from: { lat: 51.9, lng: 4.5, name: "Rotterdam" },
    to: { lat: 58.42, lng: -6.11, name: "Shellcreek (INC-0417)" },
    color: "#f16456",
  },
  {
    from: { lat: 53.5, lng: 9.9, name: "Hamburg" },
    to: { lat: 61.9, lng: 5.15, name: "Nordfjord (INC-0418)" },
    color: "#e8b23d",
  },
  {
    from: { lat: 1.35, lng: 103.8, name: "Singapore" },
    to: { lat: 2.5, lng: 101.8, name: "Malacca Watch" },
    color: "#35d6c4",
  },
  {
    from: { lat: 25.2, lng: 55.3, name: "Dubai" },
    to: { lat: 24.8, lng: 58.5, name: "Gulf of Oman" },
    color: "#f16456",
  },
];

/**
 * Converts Geographic (lat, lng) in degrees to 3D Cartesian coordinates (x, y, z) on a sphere of radius R.
 */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates an elevated 3D great circle arc between two lat/lng coordinates.
 */
export function createCurvedArc(
  startVec: THREE.Vector3,
  endVec: THREE.Vector3,
  altitude: number = 0.25,
  segments: number = 50
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
  const dist = startVec.distanceTo(endVec);
  const midLength = mid.length();

  mid.normalize().multiplyScalar(midLength + dist * altitude);

  const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
  for (let i = 0; i <= segments; i++) {
    points.push(curve.getPoint(i / segments));
  }
  return points;
}

/**
 * Generates an ultra-deep obsidian & oceanic void texture for the underlying globe sphere.
 */
export function generateTacticalEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Deep oceanic void background
  ctx.fillStyle = "#010408";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#01050a");
  grad.addColorStop(0.5, "#020a14");
  grad.addColorStop(1, "#01050a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Builds high-precision 3D vector LineSegments from real Natural Earth coastline data.
 * Rendered directly by the GPU as vector lines — NEVER PIXELATES at any zoom level.
 */
export function createWorldCoastlineGeometry(radius: number): THREE.BufferGeometry {
  const positions: number[] = [];

  for (let l = 0; l < WORLD_COASTLINES.length; l++) {
    const line = WORLD_COASTLINES[l];
    for (let i = 0; i < line.length - 1; i++) {
      const [lng1, lat1] = line[i];
      const [lng2, lat2] = line[i + 1];

      const p1 = latLngToVector3(lat1, lng1, radius);
      const p2 = latLngToVector3(lat2, lng2, radius);

      positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

/**
 * Creates true 3D vector nautical graticule (parallels and meridians).
 */
export function createVectorGraticule(radius: number): THREE.Group {
  const group = new THREE.Group();

  // Parallels (Latitude circles)
  for (let lat = -80; lat <= 80; lat += 20) {
    const pts: THREE.Vector3[] = [];
    const segments = 72;
    for (let s = 0; s <= segments; s++) {
      const lng = (s / segments) * 360 - 180;
      pts.push(latLngToVector3(lat, lng, radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const isEquator = lat === 0;
    const mat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: isEquator ? 0.35 : 0.09,
      linewidth: 1,
    });
    group.add(new THREE.Line(geo, mat));
  }

  // Meridians (Longitude lines)
  for (let lng = -180; lng < 180; lng += 30) {
    const pts: THREE.Vector3[] = [];
    const segments = 48;
    for (let s = 0; s <= segments; s++) {
      const lat = (s / segments) * 160 - 80;
      pts.push(latLngToVector3(lat, lng, radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const isPrime = lng === 0;
    const mat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: isPrime ? 0.3 : 0.09,
      linewidth: 1,
    });
    group.add(new THREE.Line(geo, mat));
  }

  return group;
}

/**
 * Generates an ethereal, semi-transparent cloud / atmospheric weather swirl texture.
 */
export function generateAtmosphereCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Soft atmospheric cloud wisps
  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * canvas.width;
    const cy = 60 + Math.random() * (canvas.height - 120);
    const radius = 35 + Math.random() * 85;

    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    grad.addColorStop(0.4, "rgba(0, 240, 255, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 1.8, radius * 0.65, Math.random() * 0.5 - 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

