// "use client"

// import type React from "react"
// import { useAuth } from "../../context/AuthContext"
// import { Button } from "@/components/ui/button"
// import { useNavigate } from "react-router-dom"
// import { User, LogOut, Home, Briefcase, Users, FileText } from "lucide-react"

// interface DashboardLayoutProps {
//   children: React.ReactNode
// }

// const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()

//   const isCandidate = user?.role === "candidate"

//   const handleLogout = async () => {
//     await logout()
//   }

//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
//       {/* Sidebar */}
//       <div className="hidden w-64 flex-shrink-0 bg-white dark:bg-gray-800 md:flex md:flex-col">
//         <div className="flex flex-col flex-grow overflow-y-auto">
//           <div className="flex h-16 items-center justify-center border-b px-4">
//             <h1 className="text-xl font-bold">Job Portal</h1>
//           </div>
//           <div className="flex flex-col flex-grow p-4">
//             <nav className="flex-1 space-y-2">
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start"
//                 onClick={() => navigate(isCandidate ? "/candidate-dashboard" : "/recruiter-dashboard")}
//               >
//                 <Home className="mr-2 h-5 w-5" />
//                 Dashboard
//               </Button>

//               {isCandidate ? (
//                 <>
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start"
//                     onClick={() => navigate("/candidate-requirements")}
//                   >
//                     <Briefcase className="mr-2 h-5 w-5" />
//                     Job Listings
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start"
//                     onClick={() => navigate("/candidate-profile")}
//                   >
//                     <User className="mr-2 h-5 w-5" />
//                     My Profile
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/addrequirements")}>
//                     <FileText className="mr-2 h-5 w-5" />
//                     Post Job
//                   </Button>
//                   <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/all-candidate")}>
//                     <Users className="mr-2 h-5 w-5" />
//                     Candidates
//                   </Button>
//                 </>
//               )}
//             </nav>
//           </div>
//           <div className="border-t p-4">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <User className="h-8 w-8 rounded-full bg-gray-200 p-1" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium">{user?.fullName}</p>
//                 <p className="text-xs text-gray-500">{user?.email}</p>
//               </div>
//             </div>
//             <Button
//               variant="ghost"
//               className="mt-4 w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
//               onClick={handleLogout}
//             >
//               <LogOut className="mr-2 h-5 w-5" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Top navbar */}
//         <header className="bg-white shadow dark:bg-gray-800">
//           <div className="flex h-16 items-center justify-between px-4">
//             <div className="flex items-center md:hidden">
//               <Button variant="ghost" size="icon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </Button>
//             </div>
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold md:hidden">Job Portal</h1>
//             </div>
//             <div className="flex items-center">
//               <Button variant="ghost" size="icon" className="md:hidden" onClick={handleLogout}>
//                 <LogOut className="h-6 w-6" />
//               </Button>
//             </div>
//           </div>
//         </header>

//         {/* Main content area */}
//         <main className="flex-1 overflow-auto p-4">{children}</main>
//       </div>
//     </div>
//   )
// }

// export default DashboardLayout

import React from 'react'

const DashboardLayout = () => {
  return (
    <div>DashboardLayout</div>
  )
}

export default DashboardLayout