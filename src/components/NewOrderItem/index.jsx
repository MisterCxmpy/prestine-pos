import React from 'react'
import styles from './index.module.css'
import { BiSolidMinusSquare, BiSolidPlusSquare, BiSolidTrash } from "react-icons/bi"
import { useCheckout } from '../../contexts/CheckoutContext';

export default function NewOrderItem({ itemData }) {

  console.log(itemData)

  const { addToCheckout, removeFromCheckout, removeAllOfType } = useCheckout()

  const handleIncrement = () => {
    addToCheckout(itemData);
  };
  const handleDecrement = () => {
    removeFromCheckout(itemData);
  };

  const handleRemoval = () => {
    removeAllOfType(itemData.id)
  }
  
  return (
    <li className={styles['receipt-item']}>
      <div className={styles['receipt']}>
        <div className={styles['receipt-row']}>
          <p>{itemData.name}</p>
          <p>£{itemData.price.toFixed(2)}</p>
        </div>
        <p>{itemData.additional}</p>
        <div className={styles['receipt-row']} style={{justifyContent: "start", gap: "10px"}}>
          <BiSolidPlusSquare onClick={() => handleIncrement()} />
          <p>{itemData.quantity}</p>
          <BiSolidMinusSquare onClick={() => handleDecrement()} />
          <BiSolidTrash onClick={() => handleRemoval()} />
        </div>
      </div>
    </li>
  )
}