import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: username, email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            // Redirect to login page after successful registration
            navigate('/login');
        } catch (e) {
            // Handle different types of errors
            if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                setError('Unable to connect to server. Please ensure the backend server is running on port 5000.');
            } else {
                setError(e.message || 'Registration failed. Please try again.');
            }
            console.error('Registration error:', e);
        }
    };

    return (
        <div className="register">
            <div className="centered-content">
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'white' }}>
                    <UserPlus size={28} />
                    Register
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
                        <label htmlFor="username" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'white' }}>
                            <User size={18} /> Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="email" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'white' }}>
                            <Mail size={18} /> Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="password" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'white' }}>
                            <Lock size={18} /> Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="confirmPassword" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px', color: 'white' }}>
                            <Lock size={18} /> Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Key size={18} /> Register
                    </button>
                    <div style={{ marginTop: '10px', textAlign: 'center', color: 'white' }}>
                        <p>Already have an account?</p>
                        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
