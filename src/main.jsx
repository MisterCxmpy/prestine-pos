import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { NavbarProvider } from './contexts/NavbarContext.jsx'
import { CheckoutProvider } from './contexts/CheckoutContext.jsx'
import { ServiceProvider } from './contexts/ServiceContext.jsx'
import { TicketsProvider } from './contexts/TicketsContext.jsx'
import { UsersProvider } from './contexts/UsersContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <NavbarProvider>
      <CheckoutProvider>
        <ServiceProvider>
          <TicketsProvider>
            <UsersProvider>
              <App />
            </UsersProvider>
          </TicketsProvider>
        </ServiceProvider>
      </CheckoutProvider>
    </NavbarProvider>
  </HashRouter>
)
