import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { Briefcase, LayoutDashboard, User } from 'lucide-react'

const RecuiterTabbar = () => {
  return (
    <>
    <div className="w-full ">
      <div className="container  h-16 items-center px-4 sm:px-6">
      <div>
      <h1 className="text-3xl font-bold tracking-tight mt-9">Recruiter Dashboard</h1>
       </div>
      </div>
      <div className="flex ml-9 gap-9">

        <Button variant={"outline"} asChild>
          <Link to="/recruiter-dashboard">
            <User className="h-4 w-4" />
             All Candidate 
          </Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link to="/recruiter-job-listings">
            <Briefcase className="h-4 w-4" />
            Job Listings
          </Link>
        </Button>
      </div>
    </div>
    </>
  )
}

export default RecuiterTabbar