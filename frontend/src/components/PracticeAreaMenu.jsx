import React from 'react'
import { practiceAreaData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { FaBuilding, FaGavel, FaHeart, FaHome, FaBriefcase, FaPassport } from 'react-icons/fa'

const PracticeAreaMenu = () => {
    const practiceAreaIcons = {
        'Corporate Law': FaBuilding,
        'Criminal Law': FaGavel,
        'Family Law': FaHeart,
        'Real Estate Law': FaHome,
        'Employment Law': FaBriefcase,
        'Immigration Law': FaPassport
    };

    return (
        <div id='practice-areas' className='flex flex-col items-center gap-4 py-16 text-gray-800'>
            <h1 className='text-3xl font-medium'>Find by Practice Area</h1>
            <p className='text-sm text-center sm:w-1/3'>Browse through our extensive list of trusted lawyers by their legal expertise,
                schedule your consultation hassle-free.
            </p>

            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
                {practiceAreaData.map((item, index) => {
                    const IconComponent = practiceAreaIcons[item.practiceArea];
                    return (
                        <Link onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/lawyers/${encodeURIComponent(item.practiceArea)}`}>
                            <div className='w-16 sm:w-20 h-16 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2 hover:bg-blue-200 transition-colors'>
                                {IconComponent && <IconComponent className='text-2xl sm:text-3xl text-blue-600' />}
                            </div>
                            <p className='text-center font-medium'>{item.practiceArea}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default PracticeAreaMenu
