import { useState } from 'react';
import logo from '../assets/logo.png';
import moon from '../assets/icon-moon.svg';
import sun from '../assets/icon-sun.svg';
import profile from '../assets/image-avatar.svg'

import useDarkMode from '../hooks/useDarkMode';
import { motion } from 'framer-motion';

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(colorTheme === 'light' ? true : false);

  const toggleDarkMode = () => {
    setTheme(colorTheme);
    setDarkSide((state) => !state);
  };

  return (
    <div>
      {/* Header */}
      <header className='lg:hidden h-[80px] z-50 duration-300 ease-in-out p-4 dark:bg-[#295e52] bg-[#295e52] flex items-center justify-end'>
        {/* Logo Image */}
        <img src={logo} alt="logo" className='h-[80px] absolute top-0 left-0' />

        {/* Right Side */}
        <div className='flex items-center'>
          {/* DarkMode Button */}
          {darkSide ? (
            <motion.img 
              src={sun}
              className='cursor-pointer ml-8 h-6'
              onClick={toggleDarkMode}
              whileTap={{ scale: 0.9 }}
            />
          ) : (
            <motion.img 
              src={moon}
              className='cursor-pointer ml-8 h-6'
              onClick={toggleDarkMode}
              whileTap={{ scale: 0.9 }}
            />
          )}

          {/* Dotted Line */}
          <div className=' h-[80px] border-solid border border-l border-[#f8f8fb] mx-6'></div>

          <div className=' relative'>
              <img src={profile} alt="profile" className=' rounded-full h-[30px]' />
          </div>

        </div>
      </header>

      {/* SideBar */}
      <div className=' z-50 hidden lg:block'>
        <div className=' fixed z-50 w-[100px] rounded-r-3xl flex flex-col top-0 left-0 h-screen dark:bg-[#295e52] bg-[#295e52]'>
          <div className='h-full w-full flex flex-col justify-between items-center'>
            {/* Logo */}
            <img src={logo} className='relative' />

            {/* Bottom Side */}
            <div className='flex flex-col items-center'>
              {darkSide ? (
                <motion.img 
                  src={sun}
                  className='cursor-pointer h-6'
                  onClick={toggleDarkMode}
                  whileTap={{ scale: 0.9, rotate: 15 }}
                />
              ) : (
                <motion.img 
                  src={moon}
                  className='cursor-pointer h-6'
                  onClick={toggleDarkMode}
                  whileTap={{ scale: 0.9, rotate: 15 }}
                />
              )}

              <div className='w-[100px] border-solid border border-l border-[#f8f8fb] my-6'></div>

              <div className='relative mb-4'>
                <img src={profile} alt="profile" className='cursor-pointer h-[30px] rounded-full' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
