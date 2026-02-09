import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from "./component/Header";
import Home from "./component/Home";
import About from "./component/About";
import Team from "./component/Team";
import Contact from "./component/Contact";
import Logout from "./component/Logout";
import Login from "./component/Login";
import Register from "./component/Register";
import NavBar from "./component/NavBar";
import NotFound from "./component/NotFound";
import Footer from "./component/Footer";
import ErrorBoundary from "./component/ErrorBoundary";
import ProtectedRoute from "./component/ProtectedRoute";
import { useAuth } from './context/AuthContext';
import './App.css'

function App() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const showHeaderAndNav = isAuthenticated && (location.pathname === '/' || location.pathname === '/about' || location.pathname === '/team' || location.pathname === '/contact' || location.pathname === '/logout');

    const headerData = {
        title: "GARDEN TSS",
        subtitle: "Technical Secondary School"
    };

    const homeData = {
        welcome: "Welcome to GARDEN TSS",
        description: "Empowering students through technical excellence and academic innovation."
    };

    const aboutData = {
        title: "About GARDEN TSS",
        description: "Garden Technical Secondary School is a premier institution dedicated to technical education and vocational training, fostering innovation and skills for the future."
    };

    const teamData = {
        title: "Our Administration & Faculty",
        description: "Meet our dedicated team of educators and administrators committed to providing top-tier technical education."
    };

    const contactData = {
        title: "Contact GARDEN TSS",
        description: "Reach out to us for admissions, inquiries, or partnerships. We are located in the heart of the community."
    };

    return (
        <div className={`app-container ${showHeaderAndNav ? 'with-header' : ''}`}>
            {showHeaderAndNav && <Header data={headerData} />}
            {showHeaderAndNav && (
                <ErrorBoundary>
                    <NavBar />
                </ErrorBoundary>
            )}
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<ProtectedRoute><Home data={homeData} /></ProtectedRoute>} />
                    <Route path="/about" element={<ProtectedRoute><About data={aboutData} /></ProtectedRoute>} />
                    <Route path="/team" element={<ProtectedRoute><Team data={teamData} /></ProtectedRoute>} />
                    <Route path="/contact" element={<ProtectedRoute><Contact data={contactData} /></ProtectedRoute>} />
                    <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
                    <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
export default App
