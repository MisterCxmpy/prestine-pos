import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { MainWrapper } from './components'
import { Navbar } from './layouts'
import { Customers, NewOrder, Performance, RecentOrders, Tickets } from './pages'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route element={<MainWrapper />}>
            <Route index element={<NewOrder />} />
            <Route path='/customers' element={<Customers />} />
            <Route path='/tickets' element={<Tickets />} />
            <Route path='/recent-orders' element={<RecentOrders />} />
            <Route path='/performance' element={<Performance />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
