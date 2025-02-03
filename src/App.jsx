import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AddItemModal, MainWrapper, UpdateItemModal } from './components'
import { Navbar } from './layouts'
import { Customers, NewOrder, Performance, RecentOrders, Tickets } from './pages'
import { useItem } from './contexts/ItemContext';


function App() {

  const { openClose, openCloseUpdate } = useItem()

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
      {openClose ? <AddItemModal /> : null}
      {openCloseUpdate ? <UpdateItemModal /> : null}
    </>
  )
}

export default App
