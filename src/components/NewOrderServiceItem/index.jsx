import React from 'react'
import styles from './index.module.css'
import { useCheckout } from '../../contexts/CheckoutContext'

export default function NewOrderServiceItem({ serviceName, servicePrice, additional }) {

  const serviceData = {name: serviceName, price: servicePrice}

  const { addToCheckout } = useCheckout()

  return (
    <li className={styles['service-item']} onClick={() => addToCheckout(serviceData)}>
      <div className={styles['service']}>
        <h1>{serviceName}</h1>
      </div>
    </li>
  )
}