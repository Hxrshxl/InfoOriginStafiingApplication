"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import AddCandidateDialog from "./add-candidate-dialog"
import ViewCandidateDialog from "./view-candidate-dialog"
import EditCandidateDialog from "./edit-candidate-dialog"
import DeleteCandidateDialog from "./delete-candidate-dialog"

interface Candidate {
  _id: string
  fullName: string
  email: string
  username: string
  phoneNumber: number
  city: string
  skills: string[]
  role: "candidate"
}

export default function CandidatesTab() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3000/api/v1/user/recruiter/candidates", {
        withCredentials: true,
      })

      if (response.data.success) {
        setCandidates(response.data.candidates)
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
      toast.error("Failed to fetch candidates")
    } finally {
      setLoading(false)
    }
  }

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setViewDialogOpen(true)
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setEditDialogOpen(true)
  }

  const handleDeleteCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setDeleteDialogOpen(true)
  }

  const handleCandidateAdded = () => {
    fetchCandidates()
    setAddDialogOpen(false)
  }

  const handleCandidateUpdated = () => {
    fetchCandidates()
    setEditDialogOpen(false)
  }

  const handleCandidateDeleted = (deletedId: string) => {
    setCandidates(candidates.filter((c) => c._id !== deletedId))
    setDeleteDialogOpen(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Candidates</h2>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : candidates.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No candidates found.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate._id}>
                    <TableCell className="font-medium">{candidate.fullName}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.city}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 2).map((skill, index) => (
                          <span key={index} className="bg-slate-100 text-xs px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 2 && (
                          <span className="bg-slate-100 text-xs px-2 py-1 rounded-full">
                            +{candidate.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewCandidate(candidate)}
                          title="View candidate"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditCandidate(candidate)}
                          title="Edit candidate"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteCandidate(candidate)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete candidate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Dialogs */}
      <AddCandidateDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCandidateAdded={handleCandidateAdded}
      />

      {selectedCandidate && (
        <>
          <ViewCandidateDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} candidate={selectedCandidate} />

          <EditCandidateDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            candidate={selectedCandidate}
            onCandidateUpdated={handleCandidateUpdated}
          />

          <DeleteCandidateDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            candidate={selectedCandidate}
            onCandidateDeleted={handleCandidateDeleted}
          />
        </>
      )}
    </Card>
  )
}

