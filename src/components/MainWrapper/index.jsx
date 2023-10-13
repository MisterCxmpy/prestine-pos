import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from './index.module.css'

export default function MainWrapper ({ children }) {
  return (
    <main role="main" id={styles['main']}>
      {children}
      <Outlet />
    </main>
  )
}
