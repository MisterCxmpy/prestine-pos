import React, { useState, useContext, createContext } from 'react';
import { useService } from './ServiceContext';

const ItemContext  = createContext();

export const ItemProvider = ({ children }) => {
  const [openClose, setOpenClose] = useState(false);
  const [openCloseUpdate, setOpenCloseUpdate] = useState(false);

  const [selectedItem, setSelectedItem] = useState({})

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

  const updateItem = async (item) => {
    try {
      const response = await window.api.updateItem({ item });
      if (response.success) {
        console.log('Item updated successfully');
        fetchAllServices()
      } else {
        console.error('Error updating item:', response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <ItemContext.Provider value={{ openClose, setOpenClose, setOpenCloseUpdate, openCloseUpdate, addItem, deleteItem, updateItem, setSelectedItem, selectedItem }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItem = () => useContext(ItemContext);