"use client"

import type { User } from "../../lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface CandidateViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: User
}

export function CandidateViewDialog({ open, onOpenChange, candidate }: CandidateViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Candidate Profile</DialogTitle>
          <DialogDescription>View detailed information about {candidate.fullName}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Personal Information</h3>
              <Separator className="my-2" />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Full Name</dt>
                  <dd>{candidate.fullName || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd>{candidate.email || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Phone Number</dt>
                  <dd>{candidate.phoneNumber || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Role</dt>
                  <dd className="capitalize">{candidate.role || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Date of Birth</dt>
                  <dd>{candidate.profile?.date_of_birth || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Location</dt>
                  <dd>
                    {[candidate.profile?.city, candidate.profile?.state, candidate.profile?.country]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium">Bio</h3>
              <Separator className="my-2" />
              <p className="text-sm">{candidate.profile?.bio || "No bio provided"}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium">Education</h3>
              <Separator className="my-2" />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Degree</dt>
                  <dd>{candidate.profile?.education?.degree || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Institution</dt>
                  <dd>{candidate.profile?.education?.institution || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Year of Passing</dt>
                  <dd>{candidate.profile?.education?.year_of_passing || "Not provided"}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium">Experience</h3>
              <Separator className="my-2" />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Company</dt>
                  <dd>{candidate.profile?.experience?.company_name || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Position</dt>
                  <dd>{candidate.profile?.experience?.position || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Duration</dt>
                  <dd>{candidate.profile?.experience?.duration || "Not provided"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-muted-foreground">Description</dt>
                  <dd>{candidate.profile?.experience?.description || "Not provided"}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium">Skills</h3>
              <Separator className="my-2" />
              <dl className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Technical Skills</dt>
                  <dd>{candidate.profile?.technical_skills?.join(", ") || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Soft Skills</dt>
                  <dd>{candidate.profile?.soft_skills?.join(", ") || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Languages</dt>
                  <dd>{candidate.profile?.languages_known?.join(", ") || "Not provided"}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium">Links & Documents</h3>
              <Separator className="my-2" />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">Resume</dt>
                  <dd>
                    {candidate.profile?.resume ? (
                      <a
                        href={candidate.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {candidate.profile.resumeOriginalName || "View Resume"}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Portfolio</dt>
                  <dd>
                    {candidate.profile?.portfolio ? (
                      <a
                        href={candidate.profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Portfolio
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">LinkedIn</dt>
                  <dd>
                    {candidate.profile?.linkedin_profile ? (
                      <a
                        href={candidate.profile.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">GitHub</dt>
                  <dd>
                    {candidate.profile?.github_profile ? (
                      <a
                        href={candidate.profile.github_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        GitHub Profile
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

