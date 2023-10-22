import React, { useState, useContext, createContext, useEffect } from 'react';

const UsersContext  = createContext();

export const UsersProvider = ({ children }) => {

  const [users, setUsers] = useState([]);
  
  const insertUser = (userData) => {
    const apiUrl = 'http://localhost:3000/users';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('User inserted successfully:', data);
    })
    .catch(error => {
      console.error('Error inserting ticket:', error);
    });
  }

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data.data);
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