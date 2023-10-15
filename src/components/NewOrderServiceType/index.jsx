import React from 'react'
import styles from './index.module.css'
import { useService } from '../../contexts/ServiceContext'

export default function NewOrderServiceType({ serviceName, id }) {

  const { changeService } = useService()

  return (
    <li className={styles['service-type']} onClick={() => changeService(id)}>
      <div className={styles['service']}>
        <h1>{serviceName}</h1>
      </div>
    </li>
  )
}