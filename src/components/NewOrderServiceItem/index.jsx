import React from 'react'
import styles from './index.module.css'
import { useCheckout } from '../../contexts/CheckoutContext'

export default function NewOrderServiceItem({ serviceName, servicePrice, additional, tag }) {

  const serviceData = {id: serviceName, name: serviceName, price: servicePrice, additional: additional, tag: tag}

  const { openCheck } = useCheckout()

  return (
    <li className={`${styles['service-item']} ${styles[tag == "press only" ? "pressOnly" : tag]}`} onClick={() => openCheck(serviceData)}>
      {console.log(tag)}
      <div className={styles['service']}>
        <p>{serviceName}</p>
      </div>
    </li>
  )
}