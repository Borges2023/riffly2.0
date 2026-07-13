import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [adminUsername, setAdminUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verificar se está logado ao carregar
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUsername = localStorage.getItem('adminUsername');
    if (storedToken && storedUsername) {
      setAdminToken(storedToken);
      setAdminUsername(storedUsername);
      setIsAdminLoggedIn(true);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      setAdminToken(data.token);
      setAdminUsername(data.admin.username);
      setIsAdminLoggedIn(true);

      // Salvar em localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.admin.username);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminToken(null);
    setAdminUsername(null);
    setUsers([]);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
  };

  const fetchUsers = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!response.ok) throw new Error('Erro ao buscar usuários');

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const promoteUserToPremium = async (email) => {
    if (!adminToken) return false;
    try {
      const response = await fetch('http://localhost:3001/api/admin/users/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        // Atualizar lista local
        setUsers(
          users.map((u) =>
            u.email === email ? { ...u, plan: 'premium' } : u
          )
        );
      }
      return data.success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const promoteAllToPremium = async () => {
    if (!adminToken) return false;
    try {
      const response = await fetch('http://localhost:3001/api/admin/users/upgrade-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json();
      if (data.success) {
        // Atualizar lista local
        setUsers(users.map((u) => ({ ...u, plan: 'premium' })));
      }
      return data.success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateUserPlan = async (userId, plan) => {
    if (!adminToken) return false;
    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/users/${userId}/plan`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, plan } : u
          )
        );
      }
      return data.success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const value = {
    isAdminLoggedIn,
    adminToken,
    adminUsername,
    users,
    loading,
    error,
    login,
    logout,
    fetchUsers,
    promoteUserToPremium,
    promoteAllToPremium,
    updateUserPlan,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin deve ser usado dentro de AdminProvider');
  }
  return context;
};
