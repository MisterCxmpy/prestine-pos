import React, { useState, useContext, createContext } from 'react';

const ItemContext  = createContext();

export const ItemProvider = ({ children }) => {
  const [openClose, setOpenClose] = useState(false);

  const addItem = (selectedCategory, item) => {
    try {
      const response = window.api.addItem(item)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ItemContext.Provider value={{ openClose, setOpenClose, addItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => useContext(ItemContext);