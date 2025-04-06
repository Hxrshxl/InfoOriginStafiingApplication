"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CandidatesTab from "./users/candidates-tab"
import JobListingsTab from "./jobs/job-listings-tab"


export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState("candidates")

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
      </div>

      <Tabs defaultValue="candidates" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates">
          <CandidatesTab />
        </TabsContent>

        <TabsContent value="jobs">
          <JobListingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

