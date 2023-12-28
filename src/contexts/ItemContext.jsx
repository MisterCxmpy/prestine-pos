import React, { useState, useContext, createContext } from 'react';
import { useService } from './ServiceContext';

const ItemContext  = createContext();

export const ItemProvider = ({ children }) => {
  const [openClose, setOpenClose] = useState(false);

  const { fetchAllServices } = useService();

  const addItem = (item) => {
    try {
      const response = window.api.addItem(item)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteItem = async (itemId) => {
    try {
      const response = await window.api.deleteItem({ itemId });
      if (response.success) {
        console.log('Item deleted successfully');
        fetchAllServices()
      } else {
        console.error('Error deleting item:', response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <ItemContext.Provider value={{ openClose, setOpenClose, addItem, deleteItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => useContext(ItemContext);