import React, { useEffect, useState } from 'react';
import styles from './index.module.css'
import { useItem } from '../../contexts/ItemContext';
import { useService } from '../../contexts/ServiceContext';
import useShortcut from '../../hooks/useShortcut';

const UpdateItemModal = () => {

  useShortcut([
    { keyCombo: { key: "Escape" }, action: () => {setOpenClose(false)} },
  ]);

  const { setOpenCloseUpdate, updateItem, selectedItem, setSelectedItem } = useItem()

  const [itemName, setItemName] = useState(selectedItem.name);
  const [itemPrice, setItemPrice] = useState(selectedItem.price);

  const handleUpdateItem = () => {
    updateItem({ ...selectedItem, name: itemName, price: itemPrice });

    setOpenCloseUpdate(false);
    setSelectedItem({})
};


  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <div className={styles['form']}>
          <span className={styles['close-btn']} onClick={() => setOpenCloseUpdate(false)}>
            &times;
          </span>
          <div className={styles['form-input']}>
            <label htmlFor="itemName">Item Name:</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className={styles['form-input']}>
            <label htmlFor="itemPrice">Item Price:</label>
            <input
              type="text"
              id="itemPrice"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </div>
          <div className={styles['form-buttons']}>
            <button onClick={handleUpdateItem}>Update Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateItemModal;
