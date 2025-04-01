"use client"

import { useState, useEffect } from "react"
import { Eye, Pencil, Trash2, Search, ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { toast } from "sonner"
import RecuiterTabbar from "./RecuiterTabbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { User } from "../../lib/types"
import { CandidateViewDialog } from "./candidate-view-dialog"
import { Badge } from "@/components/ui/badge"

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null)
  const itemsPerPage = 10

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      setLoading(true)
      setError(null)

      // Using direct fetch instead of getAllCandidates since there's an issue with the endpoint
      const response = await fetch(`http://localhost:3000/api/v1/user/recruiter/candidates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch candidates: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch candidates")
      }

      setCandidates(data.candidates || [])
      setTotalPages(Math.ceil((data.candidates?.length || 0) / itemsPerPage))
    } catch (err: any) {
      console.error("Error fetching candidates:", err)
      setError(err.message || "Failed to fetch candidates")
      toast.error(err.message || "Failed to fetch candidates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleViewCandidate = (candidate: User) => {
    setSelectedCandidate(candidate)
    setViewDialogOpen(true)
  }

  const handleUpdateCandidate = (candidate: User) => {
    // To be implemented later
    toast.info(` will be implemented later`)
  }

  const handleDeleteCandidate = (candidate: User) => {
    // To be implemented later
    toast.info(` will be implemented later`)
  }

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phoneNumber.toString().includes(searchTerm),
  )

  // Paginate candidates
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <RecuiterTabbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">All Candidates</h1>
            <div className="flex items-center w-full md:w-auto space-x-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search candidates..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {error && (
            <Card className="mb-4 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? `No candidates matching "${searchTerm}"` : "There are no candidates in the system yet."}
              </p>
            </div>
          )}

          {!loading && !error && filteredCandidates.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Skills
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCandidates.map((candidate) => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {candidate.profile?.profile_picture ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={candidate.profile.profile_picture || "/placeholder.svg"}
                                  alt={candidate.fullName}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  {candidate.fullName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{candidate.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{candidate.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {candidate.profile?.technical_skills?.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {skill}
                              </Badge>
                            ))}
                            {(candidate.profile?.technical_skills?.length || 0) > 3 && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                                +{(candidate.profile?.technical_skills?.length || 0) - 3} more
                              </Badge>
                            )}
                            {(!candidate.profile?.technical_skills ||
                              candidate.profile.technical_skills.length === 0) && (
                              <span className="text-sm text-gray-500">No skills listed</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleViewCandidate(candidate)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-600 hover:text-amber-800"
                              onClick={() => handleUpdateCandidate(candidate)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteCandidate(candidate)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedCandidate && (
        <CandidateViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} candidate={selectedCandidate} />
      )}
    </>
  )
}

