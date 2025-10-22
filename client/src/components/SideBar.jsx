import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from 'moment'

const SideBar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { chats, setSelectedChat, theme, setTheme, user, navigate } = useAppContext()
  const [search, setSearch] = useState('')

  return (
    <div className={`flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124] to-[#000000]
    border-r border-[#80609F]/30 bakddrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1
    ${!isMenuOpen && 'max-md:-translate-x-full'} bg-white`}>
      {/* Logo */}
      <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="logo" className='w-full max-w-48' />

      {/* New Chat and Dark Mode */}
      <div className='flex justify-between items-center mt-8'>
        {/* New Chat Button */}
          <button className='flex justify-center items-center p-2 px-7  text-white bg-linear-to-r
          from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer'>
            <span className='mr-2 text-xl'>+</span>New Chat
          </button>

        {/* Dark Mode Toggle */}
        <div className='flex items-center gap-2 p-2 px-4 h-11 border border-gray-300 dark:border-white/15 rounded-md
        cursor-pointer' onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark') }}>
          <div className='flex items-center gap-2 text-sm'>
            <img src={assets.theme_icon} className='w-4 not-dark:invert' alt="" />
            <p>{theme === 'dark' ? 'Light' : 'Dark'}</p>
          </div>
        </div>
      </div>
      {/* Search Conversation */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>
        <img src={assets.search_icon} alt="search" className='w-4 not-dark:invert' />
        <input type="text" placeholder='Search Conversation' className='text-sm placeholder:text-gray-400
        outline-none' onChange={(e) => setSearch(e.target.value)} value={search} />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className='mt-4 text-sm'>Recent Chats</p>}
      <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
        {
          chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
            : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
              <div key={chat._id} className='p-2 px-4 dark:bg-[#57317C]/10 border  rounded-md
              dark:border-[#80609F]/15 cursor-poiter flex justify-between group border-gray-300' 
              onClick={() => {navigate("/"); setSelectedChat(chat); setIsMenuOpen(false)}}>
                <div>
                  <p className='truncate w-full'>
                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-[#B1A6C0]'>{moment(chat.updatedAt).fromNow()}</p>
                </div>
                <img src={assets.bin_icon} alt="D" className='hidden group-hover:block w-4 cursor-pointer
                not-dark:invert'  />
              </div>
            ))
        }
      </div>

      {/* Community Images */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md
      cursor-pointer hover:scale-103 transition-all' onClick={() => { navigate("/community"); setIsMenuOpen(false) }}>
        <img src={assets.gallery_icon} alt="" className='w-4.5 not-dark:invert' />
        <div className='flex flex-col text-sm'>
          <p>Community Images</p>
        </div>
      </div>

      {/* Credit Purchases Option */}
      <div className='flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md
      cursor-pointer hover:scale-103 transition-all' onClick={() => { navigate("/credits"); setIsMenuOpen(false) }}>
        <img src={assets.diamond_icon} alt="" className='w-4.5 dark:invert' />
        <div className='flex flex-col text-sm'>
          <p>Credits : {user?.credits}</p>
          <p className='text-xs text-gray-400'>Purchase credits to use QuickGpt</p>
        </div>
      </div>

      {/* User Account */}
      <div className='flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md
      cursor-pointer group' >
        <img src={assets.user_icon} alt="" className='w-7 rounded-full' />
        <p className='flex-1 text-sm dark:text-primary truncate'>{user ? user.name : "Login you account"}</p>
        {user && <img src={assets.logout_icon} alt="" className='h-5 cursor-pointer not-dark:invert hidden group-hover:block' />}
      </div>

      {/* Close SideBar on mobile */}
      <img src={assets.close_icon} className='w-5 h-5 cursor-pointer absolute top-3 right-3 not-dark:invert md:hidden'
        onClick={() => setIsMenuOpen(false)} alt="Close" />
    </div>
  )
}

export default SideBar