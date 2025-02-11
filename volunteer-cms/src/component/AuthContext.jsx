import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // เพิ่มฟังก์ชันตรวจสอบ token (คงไว้เหมือนเดิม)
  const isValidToken = (token) => {
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) return false;
      return true;
    } catch {
      return false;
    }
  };

  // ตรวจสอบ token เมื่อ component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!isValidToken(storedToken)) {
      logout();
    }
  }, []);

  // auto logout effect 
  useEffect(() => {
    let inactivityTimer;
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (token && isValidToken(token)) {
        inactivityTimer = setTimeout(() => {
          logout();
          window.location.href = '/login';
        }, 10 * 60 * 1000);
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    const handleUnload = () => {
      logout();
    };
    
    window.addEventListener('beforeunload', handleUnload);
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [token]);

  // localStorage effects 
  useEffect(() => {
    if (token && isValidToken(token)) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      if (token) setToken(null);
    }
  }, [token]);

  useEffect(() => {
    if (user && token && isValidToken(token)) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      if (user) setUser(null);
    }
  }, [user, token]);

  // แก้ไขฟังก์ชัน login
  const login = (userData, userToken) => {
    // Save to localStorage first
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Then update state
    setUser(userData);
    setToken(userToken);
  };

  // logout function 
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    token,
    user,
    login,
    logout,
    isValidToken,
    isAuthenticated: !!(token && isValidToken(token) && user)
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;