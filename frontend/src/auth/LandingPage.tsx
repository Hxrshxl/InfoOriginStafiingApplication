"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import coding from "@/assets/coding.svg"
import interview from "@/assets/interview.svg"
import { TiltMotion } from "@/components/ui/tilt-motion"

const LandingPage = () => {
  const navigate = useNavigate()

  const handleRoleSelection = (role: string) => {
    navigate(`/login?role=${role}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
 
        <TiltMotion tiltFactor={20} scale={1.05} perspective={1500} transitionDuration={0.3}>
            <Card className="w-full max-w-md bg-white shadow-xl overflow-hidden rounded-[0.75rem] min-h-[400px] min-w-[400px]">
          {/* Candidate Card */}
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="text-center pb-0">
            <h2 className="text-2xl font-bold">Looking for a Job?</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-[300px] h-[300px] relative">
              <img src={coding} alt="Candidate illustration" />
            </div>
            <Button className="h-auto w-48 mt-4" onClick={() => handleRoleSelection("candidate")}>
              Login as Candidate
            </Button>
          </CardContent>
        </Card>
            </Card>
        </TiltMotion>



        <TiltMotion tiltFactor={20} scale={1.05} perspective={1500} transitionDuration={0.3}>
            <Card className="w-full max-w-md bg-white shadow-xl overflow-hidden rounded-[0.75rem] min-h-[400px] min-w-[400px]">
          {/* Recruiter Card */}
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="text-center pb-0">
            <h2 className="text-2xl font-bold">Hiring Talent?</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-[300px] h-[300px] relative mb-4">
              <img src={interview} alt="Recruiter illustration" />
            </div>
            <Button className="h-auto w-48 mt-4" onClick={() => handleRoleSelection("recruiter")}>
              Login as Recruiter
            </Button>
          </CardContent>
        </Card>
            </Card>
        </TiltMotion>
        
      </div>
    </div>
  )
}

export default LandingPage
