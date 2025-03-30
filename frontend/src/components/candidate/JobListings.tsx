// "use client"
// import DashboardLayout from "../layouts/DashboardLayout"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Briefcase, MapPin, Clock, Building, ChevronRight } from "lucide-react"
// import CandidateTabBar from "./CandidateTabBar"

// // Mock data for job listings
// const jobListings = [
//   {
//     id: 1,
//     title: "Senior Frontend Developer",
//     company: "Acme Inc.",
//     location: "Remote",
//     type: "Full-time",
//     salary: "$120k-$150k",
//     posted: "2 days ago",
//     description:
//       "We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern web technologies.",
//     skills: ["React", "TypeScript", "CSS", "HTML", "JavaScript"],
//   },
//   {
//     id: 2,
//     title: "Backend Engineer",
//     company: "Tech Solutions",
//     location: "New York, NY",
//     type: "Full-time",
//     salary: "$130k-$160k",
//     posted: "1 week ago",
//     description: "Join our team to build scalable backend services using Node.js, Express, and MongoDB.",
//     skills: ["Node.js", "Express", "MongoDB", "REST API", "GraphQL"],
//   },
//   {
//     id: 3,
//     title: "Full Stack Developer",
//     company: "Innovate Labs",
//     location: "San Francisco, CA",
//     type: "Contract",
//     salary: "$100/hr",
//     posted: "3 days ago",
//     description: "Looking for a versatile developer who can work on both frontend and backend technologies.",
//     skills: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
//   },
//   {
//     id: 4,
//     title: "UI/UX Designer",
//     company: "Creative Studio",
//     location: "Remote",
//     type: "Part-time",
//     salary: "$80k-$100k",
//     posted: "5 days ago",
//     description: "Design intuitive and beautiful user interfaces for web and mobile applications.",
//     skills: ["Figma", "Adobe XD", "UI Design", "Prototyping", "User Research"],
//   },
// ]

// const JobListings = () => {
//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <CandidateTabBar />

//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Job Listings</h1>
//           <p className="text-muted-foreground">Explore available job opportunities</p>
//         </div>

//         <div className="grid gap-6">
//           {jobListings.map((job) => (
//             <Card key={job.id}>
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle>{job.title}</CardTitle>
//                     <CardDescription className="flex items-center mt-1">
//                       <Building className="h-4 w-4 mr-1" />
//                       {job.company}
//                     </CardDescription>
//                   </div>
//                   <Badge variant="outline" className="ml-2">
//                     {job.type}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="mb-4">{job.description}</p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {job.skills.map((skill, index) => (
//                     <Badge key={index} variant="secondary">
//                       {skill}
//                     </Badge>
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
//                   <div className="flex items-center">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     {job.location}
//                   </div>
//                   <div className="flex items-center">
//                     <Briefcase className="h-4 w-4 mr-1" />
//                     {job.salary}
//                   </div>
//                   <div className="flex items-center">
//                     <Clock className="h-4 w-4 mr-1" />
//                     Posted {job.posted}
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-end">
//                 <Button>
//                   Apply Now
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </DashboardLayout>
//   )
// }

// export default JobListings

import React from 'react'

const JobListings = () => {
  return (
    <div>JobListings</div>
  )
}

export default JobListings