import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import LandingPage from "./pages/LandingPage";
import Incidents from "./pages/Incidents";
import Vessels from "./pages/Vessels";
import DriftModel from "./pages/DriftModel";
import Alerts from "./pages/Alerts";
import ModelHealth from "./pages/ModelHealth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Interactive 3D Earth Landing Portal */}
        <Route path="/" element={<LandingPage />} />

        {/* Operational Command Console */}
        <Route element={<AppShell />}>
          <Route path="/console" element={<Incidents />} />
          <Route path="/app" element={<Navigate to="/console" replace />} />
          <Route path="/vessels" element={<Vessels />} />
          <Route path="/drift" element={<DriftModel />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/health" element={<ModelHealth />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
