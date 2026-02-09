import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Logout() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        setIsLoading(true);
        // Simulate a small delay for the loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        logout();
        setIsLoading(false);
        navigate('/login');
    };

    return (
        <div className="logout">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-box">
                        <Loader2 size={48} className="animate-spin" />
                        <span className="loading-text">Logging out...</span>
                    </div>
                </div>
            )}
            <div className="centered-content">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <LogOut size={28} />
                    Logout
                </h3>
                <p>Are you sure you want to logout?</p>
                <button 
                    onClick={handleLogout} 
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Logging out...
                        </>
                    ) : (
                        <>
                            <LogOut size={18} /> Logout
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default Logout;
