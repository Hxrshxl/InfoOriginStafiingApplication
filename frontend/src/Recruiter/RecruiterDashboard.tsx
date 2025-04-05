"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../auth/AuthContext"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Briefcase, Users, LogOut, Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

// Define the Candidate type based on the User model
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

const RecruiterDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("candidates")
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    username: "",
    phoneNumber: "",
    city: "",
    skills: [] as string[],
  })
  const [skillInput, setSkillInput] = useState("")

  // Fetch candidates on component mount
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

  const handleLogout = async () => {
    await logout()
  }

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setViewDialogOpen(true)
  }

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setEditForm({
      fullName: candidate.fullName,
      email: candidate.email,
      username: candidate.username,
      phoneNumber: candidate.phoneNumber.toString(),
      city: candidate.city,
      skills: [...candidate.skills],
    })
    setEditDialogOpen(true)
  }

  const handleDeleteCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setDeleteDialogOpen(true)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (!editForm.skills.includes(newSkill)) {
        setEditForm((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }))
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSaveEdit = async () => {
    if (!selectedCandidate) return

    try {
      // This is a mock implementation since the actual endpoint for updating a candidate by a recruiter
      // is not provided in the backend code. In a real application, you would call the appropriate API.
      toast.success("Candidate updated successfully")
      setEditDialogOpen(false)

      // Refresh the candidates list
      await fetchCandidates()
    } catch (error) {
      console.error("Error updating candidate:", error)
      toast.error("Failed to update candidate")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCandidate) return

    try {
      // This is a mock implementation since the actual endpoint for deleting a candidate by a recruiter
      // is not provided in the backend code. In a real application, you would call the appropriate API.
      toast.success("Candidate deleted successfully")
      setDeleteDialogOpen(false)

      // Remove the candidate from the local state
      setCandidates((prev) => prev.filter((c) => c._id !== selectedCandidate._id))
    } catch (error) {
      console.error("Error deleting candidate:", error)
      toast.error("Failed to delete candidate")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Job Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Welcome, {user?.fullName}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  {/* Candidates */}
                  <Button
                    variant={activeTab === "candidates" ? "default" : "ghost"}
                    className="justify-start rounded-none h-12"
                    onClick={() => setActiveTab("candidates")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Candidates
                  </Button>

                  {/* Job Listings */}
                  <Button
                    variant={activeTab === "jobs" ? "default" : "ghost"}
                    className="justify-start rounded-none h-12"
                    onClick={() => setActiveTab("jobs")}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Job Listings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "jobs" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Job Listings</CardTitle>
                    <CardDescription>Manage your job postings</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500">You haven't posted any jobs yet.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "candidates" && (
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Applications</CardTitle>
                  <CardDescription>Review and manage candidate applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : candidates.length === 0 ? (
                    <p className="text-slate-500">No applications received yet.</p>
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
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* View Candidate Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
            <DialogDescription>View detailed information about this candidate.</DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <div className="mt-1 p-2 bg-slate-50 rounded-md">{selectedCandidate.fullName}</div>
                </div>
                <div className="col-span-4">
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="mt-1 p-2 bg-slate-50 rounded-md">{selectedCandidate.email}</div>
                </div>
                <div className="col-span-4">
                  <Label className="text-sm font-medium">Username</Label>
                  <div className="mt-1 p-2 bg-slate-50 rounded-md">{selectedCandidate.username}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <div className="mt-1 p-2 bg-slate-50 rounded-md">{selectedCandidate.phoneNumber}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">City</Label>
                  <div className="mt-1 p-2 bg-slate-50 rounded-md">{selectedCandidate.city}</div>
                </div>
                <div className="col-span-4">
                  <Label className="text-sm font-medium">Skills</Label>
                  <div className="mt-1 p-2 bg-slate-50 rounded-md min-h-[60px]">
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, index) => (
                        <span key={index} className="bg-slate-200 px-2 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>Make changes to the candidate's information.</DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditFormChange}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-4">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={editForm.username}
                    onChange={handleEditFormChange}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={handleEditFormChange}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={editForm.city} onChange={handleEditFormChange} className="mt-1" />
                </div>
                <div className="col-span-4">
                  <Label htmlFor="skills">Skills (Press Enter to add)</Label>
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="mt-1"
                    placeholder="Add a skill"
                  />
                  {editForm.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editForm.skills.map((skill, index) => (
                        <div key={index} className="bg-slate-100 px-2 py-1 rounded-md flex items-center">
                          <span className="text-sm">{skill}</span>
                          <button
                            type="button"
                            className="ml-1 text-slate-500 hover:text-slate-700"
                            onClick={() => removeSkill(skill)}
                            aria-label={`Remove ${skill}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the candidate
              {selectedCandidate && ` "${selectedCandidate.fullName}"`} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default RecruiterDashboard

