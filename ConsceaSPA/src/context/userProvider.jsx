import { getEmployee } from '../services/employeeService';
import { useState, useEffect } from 'react';
import UserContext from './userContext';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const fetchCurrentUser = async (userId) => {
    try {
      if (userId) {
        const currentUser = await getEmployee(userId);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error.message);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser(userId);
  }, [userId]);

  const login = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <UserContext.Provider value={{ user, userId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
