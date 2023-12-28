import React from 'react'
import styles from './index.module.css'
import { useCheckout } from '../../contexts/CheckoutContext'
import { useItem } from '../../contexts/ItemContext'

export default function NewOrderServiceItem({ id, serviceName, servicePrice, additional, tag }) {

  const serviceData = {id: id, name: serviceName, price: servicePrice, additional: additional, tag: tag}

  const { openCheck } = useCheckout()
  const { deleteItem } = useItem()

  return (
    <li className={`${styles['service-item']} ${styles[tag == "press only" ? "pressOnly" : tag]}`} onClick={() => openCheck(serviceData)}>
      <button className={styles['delete-service']} type='button' onClick={(e) => {e.stopPropagation(); deleteItem(serviceData.id)}}>&times;</button>
      <div className={styles['service']}>
        <p>{serviceName}</p>
      </div>
    </li>
  )
}