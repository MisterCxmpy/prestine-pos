import React, { useState, useContext, createContext, useEffect } from 'react';

const UsersContext  = createContext();

export const UsersProvider = ({ children }) => {

  const [users, setUsers] = useState([]);
  
  const insertUser = (userData) => {
    const response = window.api.insertUser(userData)
  }

  const getUsers = async () => {
    try {
      const response = await window.api.getAllUsers();
      setUsers(response)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ insertUser, users, getUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);