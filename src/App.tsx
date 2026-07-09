import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Analyze } from "./pages/Analyze";
import { Report } from "./pages/Report";
import { Compare } from "./pages/Compare";
import { Questionnaire } from "./pages/Questionnaire";
import { Pricing } from "./pages/Pricing";
import { Dashboard } from "./pages/Dashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="noise relative min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyse" element={<Analyze />} />
          <Route path="/rapport/:id" element={<Report />} />
          <Route path="/comparateur" element={<Compare />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/tarifs" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}
