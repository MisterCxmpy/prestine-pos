import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { MainWrapper } from './components'
import { Navbar } from './layouts'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route element={<MainWrapper />}>
            
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
