// Authentication context and utilities
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and verify token
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const signup = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save token and user
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
