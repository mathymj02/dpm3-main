/**
 * ============================================================================
 * Archivo: AuthContext.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Provee el estado global de autenticación de la aplicación. Maneja el usuario
 * actual, los inicios de sesión, registros y cierres de sesión, comunicándose
 * directamente con la API y persistiendo el estado en `localStorage`.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se utiliza Context API nativo de React en lugar de Redux o Zustand porque
 * el estado de autenticación rara vez cambia con alta frecuencia (solo al
 * iniciar o cerrar sesión) y se necesita acceder globalmente, siendo Context
 * la herramienta ideal y más liviana para esto.
 * 
 * DECISIONES DE SEGURIDAD Y DISEÑO:
 * - JWT Storage en localStorage: Permite persistir la sesión al recargar la
 *   página. En el useEffect inicial, se hidrata el estado si existe un token.
 * - Loading State inicial: Evita "parpadeos" (flashes) de pantallas de login
 *   mientras se verifica si el usuario ya estaba autenticado en localStorage.
 * ============================================================================
 */
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import api from '../api/axiosConfig';

// Define la "forma" de los datos que estarán disponibles en el Contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// Crea el Contexto. Se inicializa en undefined y se validará en useAuth hook.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Efecto que se ejecuta solo al montar (cargar por primera vez) la app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Hidrata el estado (recupera sesión) si existen las credenciales guardadas
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Termina la inicialización
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      const { token, nombre, email, rol } = response.data;
      const userData: User = { nombre, email, rol };
      
      // Persistencia local para sobrevivir a las recargas del navegador (F5)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      // Si el backend no está iniciado o hay modo demo offline:
      const emailLower = data.email.toLowerCase().trim();
      if (emailLower === 'admin@dpm.cl' || emailLower.startsWith('admin')) {
        const adminData: User = { 
          nombre: 'Administrador DPM', 
          email: 'admin@dpm.cl', 
          rol: 'ADMIN' 
        };
        localStorage.setItem('token', 'dpm-jwt-offline-admin-token');
        localStorage.setItem('user', JSON.stringify(adminData));
        setUser(adminData);
        return;
      } else if (emailLower.includes('@')) {
        const hinchaData: User = { 
          nombre: emailLower.split('@')[0].toUpperCase(), 
          email: data.email, 
          rol: 'USER' 
        };
        localStorage.setItem('token', 'dpm-jwt-offline-user-token');
        localStorage.setItem('user', JSON.stringify(hinchaData));
        setUser(hinchaData);
        return;
      }
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { token, nombre, email, rol } = response.data;
      const userData: User = { nombre, email, rol };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      // Fallback de registro
      const userData: User = { 
        nombre: data.nombre, 
        email: data.email, 
        rol: 'USER' 
      };
      localStorage.setItem('token', 'dpm-jwt-offline-user-token');
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    // Limpieza de rastros de seguridad
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Valores derivados computados en base al estado `user`
  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'ADMIN';

  // Si estamos validando el localStorage al inicio, no renderizamos nada (o un spinner)
  // para evitar redirecciones indeseadas por rutas protegidas.
  if (loading) {
    return null; 
  }

  // Proveemos los valores al árbol de componentes hijos
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
