import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import AdminProtectedRoute from "./component/admin/AdminProtectedRoute";
import AdminLogin from "./component/admin/AdminLogin";
import AdminDashboard from "./component/admin/AdminDashboard";
import Search from "./component/Search";
import { useAuth } from './context/AuthContext';
import './App.css'

function App() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const isAdminRoute = location.pathname.startsWith('/admin');
    const showHeaderAndNav = !isAdminRoute && isAuthenticated && (location.pathname === '/' || location.pathname === '/about' || location.pathname === '/team' || location.pathname === '/contact' || location.pathname === '/search');

    useEffect(() => {
        fetch('/api/content/global')
            .then(res => res.json())
            .then(data => {
                if (data.background?.bgImage) {
                    document.body.style.backgroundImage = `url(${data.background.bgImage})`;
                }
            })
            .catch(err => console.error('Error fetching background:', err));
    }, []);

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

    const showFooter = !isAdminRoute && 
                       location.pathname !== '/logout' && 
                       location.pathname !== '/login' && 
                       location.pathname !== '/register' && 
                       (location.pathname === '/' || 
                        location.pathname === '/about' || 
                        location.pathname === '/team' || 
                        location.pathname === '/contact' || 
                        location.pathname === '/search');

    return (
        <div className={`app-container ${showHeaderAndNav ? 'with-header' : ''} ${isOpen ? 'menu-open' : ''}`}>
            {showHeaderAndNav && <Header data={headerData} />}
            {showHeaderAndNav && (
                <ErrorBoundary>
                    <NavBar isOpen={isOpen} setIsOpen={setIsOpen} />
                </ErrorBoundary>
            )}
            <div className="main-content">
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    } />
                    
                    {/* User Routes */}
                    <Route path="/" element={<ProtectedRoute><Home data={homeData} /></ProtectedRoute>} />
                    <Route path="/about" element={<ProtectedRoute><About data={aboutData} /></ProtectedRoute>} />
                    <Route path="/team" element={<ProtectedRoute><Team data={teamData} /></ProtectedRoute>} />
                    <Route path="/contact" element={<ProtectedRoute><Contact data={contactData} /></ProtectedRoute>} />
                    <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                    <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
                    <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                </Routes>
            </div>
            {showFooter && <Footer />}
        </div>
    );
}
export default App
