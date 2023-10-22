import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { MainWrapper } from './components'
import { Navbar } from './layouts'
import { Customers, NewOrder, RecentOrders, Tickets } from './pages'

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
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
