import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VetProvider } from "./context/VetContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import MedicalRecords from "./pages/MedicalRecords";
import VetDashboard from "./pages/VetDashboard";
import VetLogin from "./pages/VetLogin";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function AppContent() {
  const location = useLocation();
  // Hide navbar di vet-login dan vet-dashboard page
  const hideNavbar =
    location.pathname === "/vet-login" ||
    location.pathname === "/vet-dashboard";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/vet-login" element={<VetLogin />} />
          <Route path="/vet-dashboard" element={<VetDashboard />} />
        </Routes>
      </main>
      {!hideNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
      <AuthProvider>
        <VetProvider>
          <ThemeProvider>
            <Router>
              <AppContent />
            </Router>
          </ThemeProvider>
        </VetProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
