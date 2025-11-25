import { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Para no mostrar nada hasta verificar sesión

    // Función para cargar los datos del usuario usando el token
    const fetchUserProfile = async () => {
        try {
            const response = await axiosClient.get('/Auth/perfil');
            setUser(response.data); // Guardamos ID, Email y ROLES
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error cargando perfil", error);
            logout(); // Si el token no sirve, cerramos sesión
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        // Al setear el token, el useEffect se dispara y carga el perfil
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);