import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
            <div className='text-center text-2xl text-gray-500 pt-10 ' >
              <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
            </div>
            
            <div className='flex my-10 justify-center flex-col md:flex-row gap-10 mb-28 text-sm '>
                 <img className='w-full md:max-w-[360px]'      src={assets.contact_image} alt="" />

                 <div className='flex flex-col justify-center gap-6 items-start '>
                     <p className='font-semibold text-gray-600'>Our OFFICE</p>
                     <p className=' text-gray-500'>B-boys Hostel IET-DAVV <br />
                      Indore Khandwa Road, Indore, MP</p>
                     <p className=' text-gray-500'  >Tel: +91 98765 43210 <br />
                      Email: contact@legalsathi.com   </p>
                     <p className='font-semibold text-gray-600'>Careers at LEGAL SATHI</p>
                     <p className=' text-gray-500'>Join our team of legal professionals and help us provide accessible legal services.</p>
                    <button className='border border-black text-sm px-8 py-4 hover:text-white hover:bg-black transition-all duration-500' > Explore Jobs </button>
                 </div>
            </div>

    </div>
  )
}

export default Contact
