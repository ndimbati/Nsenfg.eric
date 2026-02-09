import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        try {
            return localStorage.getItem('isAuthenticated') === 'true';
        } catch (e) {
            console.warn('Unable to access localStorage for auth flag', e);
            return false;
        }
    });

    const login = () => {
        try {
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
        } catch (e) {
            console.warn('Unable to access localStorage for auth flag', e);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('isAuthenticated');
            setIsAuthenticated(false);
        } catch (e) {
            console.warn('Unable to access localStorage to clear auth flag', e);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
