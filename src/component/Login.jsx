import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, Key, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate a small delay for the loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        login();
        setIsLoading(false);
        navigate('/');
    };

    return (
        <div className="login">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-box">
                        <Loader2 size={48} className="animate-spin" />
                        <span className="loading-text">Authenticating...</span>
                    </div>
                </div>
            )}
            <div className="centered-content">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <LogIn size={28} />
                    Login
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="username" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                            <User size={18} /> Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px' }}
                            disabled={isLoading}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                            <Lock size={18} /> Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px' }}
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{ padding: '10px 20px', fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                <Key size={18} /> Login
                            </>
                        )}
                    </button>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <p>Don't have an account?</p>
                        <Link 
                            to="/register" 
                            style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                padding: '10px 20px', 
                                fontSize: '16px', 
                                cursor: 'pointer',
                                backgroundColor: '#28a745',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                marginTop: '10px'
                            }}
                        >
                            <UserPlus size={18} /> Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
