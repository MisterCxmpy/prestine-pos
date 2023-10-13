import React from 'react'
import { Outlet } from 'react-router-dom'
import styles from './index.module.css'
import { useNavbar } from '../../contexts/NavbarContext'

export default function MainWrapper ({ children }) {

  const { menuOpen } = useNavbar()

  return (
    <main role="main" id={styles['main']} className={`${!menuOpen ? styles['closed'] : ""}`}>
      {children}
      <Outlet />
    </main>
  )
}
