import React from 'react'
import Header from '../components/Header'
import PracticeAreaMenu from '../components/PracticeAreaMenu'
import TopLawyers from '../components/TopLawyers'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
     <Header/>
     <PracticeAreaMenu/>
     <TopLawyers/>
     <Banner/>
    </div>
  )
}

export default Home
