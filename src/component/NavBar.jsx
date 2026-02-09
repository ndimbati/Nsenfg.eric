import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Info, Users, Mail, LogOut, Loader2 } from 'lucide-react';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingPath, setLoadingPath] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
        setLoadingPath(null);
    }, [location]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNavClick = async (e, path) => {
        e.preventDefault();
        if (loadingPath) return;
        
        setLoadingPath(path);
        // Simulate a small delay for navigation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setIsOpen(false);
        navigate(path);
    };

    const navLinks = [
        { path: '/', label: 'Home', icon: <Home size={18} /> },
        { path: '/about', label: 'About', icon: <Info size={18} /> },
        { path: '/team', label: 'Team', icon: <Users size={18} /> },
        { path: '/contact', label: 'Contact', icon: <Mail size={18} /> },
        { path: '/logout', label: 'Logout', icon: <LogOut size={18} /> },
    ];

    return (
        <>
            {loadingPath && (
                <div className="loading-overlay">
                    <div className="loading-box">
                        <Loader2 size={48} className="animate-spin" />
                        <span className="loading-text">
                            Navigating to {navLinks.find(l => l.path === loadingPath)?.label}...
                        </span>
                    </div>
                </div>
            )}
            <div className="nav" ref={menuRef}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <button onClick={() => setIsOpen(!isOpen)} className="hamburger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
                        {navLinks.map((link) => (
                            <a 
                                key={link.path}
                                href={link.path} 
                                onClick={(e) => handleNavClick(e, link.path)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    opacity: loadingPath && loadingPath !== link.path ? 0.5 : 1,
                                    cursor: loadingPath ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {link.icon}
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default NavBar;


