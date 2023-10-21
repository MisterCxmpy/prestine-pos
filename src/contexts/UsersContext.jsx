import React, { useState, useContext, createContext } from 'react';

const UsersContext  = createContext();

export const UsersProvider = ({ children }) => {
  
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

  return (
    <UsersContext.Provider value={{ insertUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);