import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { GLOBAL_INCIDENTS, type IncidentHotspot } from "./earthUtils";
import { AlertTriangle, RefreshCw, Layers } from "lucide-react";

interface GoogleEarthMapProps {
  selectedIncident: IncidentHotspot | null;
  onSelectIncident: (incident: IncidentHotspot) => void;
  showDriftLayer?: boolean;
}

export function GoogleEarthMap({
  selectedIncident,
  onSelectIncident,
  showDriftLayer = true,
}: GoogleEarthMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const driftPolygonRef = useRef<google.maps.Polygon | null>(null);
  const onSelectRef = useRef(onSelectIncident);
  useEffect(() => {
    onSelectRef.current = onSelectIncident;
  }, [onSelectIncident]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const [loading, setLoading] = useState<boolean>(() => Boolean(apiKey));
  const [error, setError] = useState<string | null>(() =>
    apiKey ? null : "No Google API Key detected in environment configuration."
  );

  useEffect(() => {
    if (!apiKey) return;

    let isMounted = true;

    async function initGoogleMaps() {
      try {
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        const { Map } = await importLibrary("maps");

        if (!isMounted || !mapRef.current) return;

        const defaultCenter = selectedIncident
          ? { lat: selectedIncident.lat, lng: selectedIncident.lng }
          : { lat: 58.42, lng: -6.11 };

        const map = new Map(mapRef.current, {
          center: defaultCenter,
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          tilt: 55,
          heading: 65,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          backgroundColor: "#081420",
        });

        googleMapRef.current = map;

        // Clear previous markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        GLOBAL_INCIDENTS.forEach((inc) => {
          const isSelected = selectedIncident?.id === inc.id;
          const marker = new google.maps.Marker({
            position: { lat: inc.lat, lng: inc.lng },
            map,
            title: `${inc.id} · ${inc.name}`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: isSelected ? 10 : 7,
              fillColor: inc.severity === "critical" ? "#F16456" : "#35D6C4",
              fillOpacity: 0.95,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          });

          marker.addListener("click", () => {
            onSelectRef.current(inc);
          });

          markersRef.current.push(marker);
        });

        // Add mock oil spill dispersion polygon for the primary incident
        if (showDriftLayer) {
          const spillCoords = [
            { lat: 58.42, lng: -6.11 },
            { lat: 58.48, lng: -6.02 },
            { lat: 58.45, lng: -5.9 },
            { lat: 58.39, lng: -6.04 },
          ];

          const polygon = new google.maps.Polygon({
            paths: spillCoords,
            strokeColor: "#35D6C4",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#F16456",
            fillOpacity: 0.35,
          });

          polygon.setMap(map);
          driftPolygonRef.current = polygon;
        }

        setLoading(false);
      } catch (err: unknown) {
        console.error("Google Maps Load Error:", err);
        const errMsg = err instanceof Error ? err.message : "Failed to load Google Maps API.";
        setError(`Failed to initialize Google Earth / Maps API: ${errMsg}`);
        setLoading(false);
      }
    }

    initGoogleMaps();

    return () => {
      isMounted = false;
      markersRef.current.forEach((m) => m.setMap(null));
      if (driftPolygonRef.current) {
        driftPolygonRef.current.setMap(null);
      }
    };
  }, [apiKey, selectedIncident, showDriftLayer]);

  // Pan to incident when selection changes
  useEffect(() => {
    if (googleMapRef.current && selectedIncident) {
      googleMapRef.current.panTo({ lat: selectedIncident.lat, lng: selectedIncident.lng });
      googleMapRef.current.setZoom(12);
    }
  }, [selectedIncident]);

  if (error) {
    return (
      <div className="w-full h-full min-h-[440px] flex flex-col items-center justify-center p-6 bg-panel-soft border border-border-soft rounded-xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-wash border border-red/30 flex items-center justify-center text-red mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-text mb-1">Google Earth API Notice</h4>
        <p className="text-xs text-text-muted max-w-md mb-4">{error}</p>
        <div className="text-[11px] text-text-faint font-mono bg-panel px-3 py-2 rounded border border-border">
          API Key: {apiKey ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}` : "Missing"}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[440px] bg-panel-soft overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-panel/90 backdrop-blur-sm">
          <RefreshCw className="w-6 h-6 text-teal animate-spin mb-2" />
          <span className="text-xs font-semibold text-text-muted font-mono">LOADING GOOGLE SATELLITE 3D VIEW...</span>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full min-h-[440px]" />

      {/* Google Earth HUD watermark */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-panel/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-border-soft text-[11px] text-text-muted font-mono">
        <Layers className="w-3.5 h-3.5 text-teal" />
        <span>GOOGLE EARTH 3D SATELLITE TILES · ACTIVE TILT 55°</span>
      </div>
    </div>
  );
}
