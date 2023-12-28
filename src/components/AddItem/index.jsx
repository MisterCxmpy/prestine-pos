import React, { useEffect, useState } from 'react';
import styles from './index.module.css'
import { useItem } from '../../contexts/ItemContext';
import { useService } from '../../contexts/ServiceContext';

const AddItemModal = () => {

  const { setOpenClose, addItem } = useItem()
  const { allServices, fetchAllServices } = useService()

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({
    cleaning: false,
    'press-only': false,
    household: false,
    alterations: false,
    repairs: false,
  });

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = Object.fromEntries(
        Object.keys(prevCategories).map((key) => [key, false])
      );
      
      newCategories[category] = !prevCategories[category];
      
      return newCategories;
    });
  };
  

  const handleAddItem = () => {
    const highestId = Math.max(...allServices.map(item => item.id), 0);

    const selectedCategory = Object.keys(selectedCategories).find(
      (category) => selectedCategories[category]
    );

    if (!selectedCategory) {
      return;
    }

    const newItem = {
      id: highestId + 1,
      name: itemName,
      price: itemPrice,
      additional: selectedCategory == "press-only" ? "Press Only" : selectedCategory,
      tag: selectedCategory.replace('-', ' '),
    };

    addItem({category: selectedCategory, item: newItem})

    setOpenClose(false);
    setItemName('');
    setItemPrice('');
    setSelectedCategories({
      cleaning: false,
      'press-only': false,
      household: false,
      alterations: false,
      repairs: false,
    });

    fetchAllServices()
  };

  return (
    <div className={styles['overlay']}>
      <div className={styles['outer']}>
        <div className={styles['form']}>
          <span className={styles['close-btn']} onClick={() => setOpenClose(false)}>
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
          <div className={`${styles['form-input']} ${styles['category-types']}`}>
            {Object.keys(selectedCategories).map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories[category]}
                  onChange={() => handleCheckboxChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
          <div className={styles['form-buttons']}>
            <button onClick={handleAddItem}>Add Item</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
