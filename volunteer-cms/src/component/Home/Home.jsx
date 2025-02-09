import React from 'react'
import MainLayout from '../../layout/NavigationBar/MainLayout'
import Main from './Main'
import PlanActivity from './PlanActivity'
import Volunteernetwork from './Volunteernetwork'
import BorrowerDetails from './BorrowerDetails'

function Home() {
  return (
    <div>
         <Main />
         <PlanActivity />
         <Volunteernetwork />
         <BorrowerDetails />
    </div>
  )
}

export default Home