import React from 'react'
import { assets } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { getUserRole } = useAuth()
  const navigate = useNavigate()
  const userRole = getUserRole()

  // Render different headers based on user role
  if (userRole === 'lawyer') {
    return (
      <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-green-600 to-green-700 rounded-lg px-6 md:px-10 lg:px-20'>
        {/* Left Side for Lawyers */}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
           <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
            Manage Your Legal Practice <br /> 
            With Confidence
           </p>
           <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
            <div className='flex -space-x-2'>
              <div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold'>👨‍⚖️</div>
              <div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold'>📊</div>
              <div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold'>💼</div>
            </div>
            <p>Access your consultation requests, manage clients, <br className=' hidden sm:block' />
                track earnings and grow your legal practice.
            </p>
           </div> 

           <button 
             onClick={() => navigate('/lawyer-dashboard')}
             className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'
           >
            View Dashboard <img className='w-3' src={assets.arrow_icon} alt="" />
           </button>

        </div>

        {/* Right Side for Lawyers */}
        <div className='md:w-1/2 relative'>
          <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="Lawyer Dashboard" />
          <div className='absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>4.9★</div>
              <div className='text-sm text-gray-600'>Your Rating</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default header for users (and non-authenticated visitors)
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg px-6 md:px-10 lg:px-20'>
      {/* Left Side for Users */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
         <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Get Expert Legal Advice <br /> 
          From 100+ Trusted Lawyers
         </p>
         <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
          <img className='w-28' src={assets.group_profiles} alt="" />
          <p>Connect with experienced legal professionals for <br className=' hidden sm:block' />
              video, audio, or chat consultations instantly.
          </p>
         </div> 

         <button 
           onClick={() => navigate('/talk-to-lawyer')}
           className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'
         >
          Book Consultation <img className='w-3' src={assets.arrow_icon} alt="" />
         </button>

      </div>

      {/* Right Side for Users */}
      <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg'  src={assets.header_img} alt="" />
      </div>
    </div>
  )
}

export default Header
