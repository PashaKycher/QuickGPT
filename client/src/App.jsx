import React, { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SideBar from './components/SideBar'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loding from './pages/Loding'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'

const App = () => {
  const { user } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading') return <Loding />

  return (
    <>
      {!isMenuOpen && <img src={assets.menu_icon} alt="menu" className='absolute top-3 left-3
      not-dark:invert md:hidden w-8 h-8 cursor-pointer'
        onClick={() => setIsMenuOpen(true)} />}

      {user ? (
        <div className='dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white'>
          <div className='flex h-screen w-screen'>
            <SideBar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path='/' element={<ChatBox />} />
              <Route path='/credits' element={<Credits />} />
              <Route path='/community' element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className='bg-linear-to-b from-[#242124] to-[#000000] flex
        items-center justify-center h-screen w-screen'>
          <Login />
        </div>
      )}

    </>
  )
}

export default App