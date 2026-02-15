import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, Key, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server error: Unexpected response format. Please ensure the backend is running correctly.");
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            login({ username: data.userName, email }, data.token);
            navigate('/');
        } catch (e) {
            console.error('Login error:', e);
            // Handle different types of errors
            if (e.name === 'TypeError' || e.message.includes('fetch')) {
                setError('Unable to connect to server. Please ensure the backend server is running (npm run dev in /server).');
            } else {
                setError(e.message);
            }
        } finally {
            setIsLoading(false);
        }
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
                {error && (
                    <div style={{ 
                        color: '#d32f2f', 
                        backgroundColor: '#ffebee', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginBottom: '15px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                            <User size={18} /> Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
