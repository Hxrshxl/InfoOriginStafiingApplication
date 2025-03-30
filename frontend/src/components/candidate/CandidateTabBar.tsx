import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";



export function CandidateTabBar() {


  return (
    <div className="w-full ">
      <div className="container  h-16 items-center px-4 sm:px-6">
      <div>
      <h1 className="text-3xl font-bold tracking-tight mt-9">Candidate Profile</h1>
       </div>
      </div>
      <div className="flex ml-9 gap-9">

        <Button variant={"outline"} asChild>
          <Link to="/candidate-dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Candidate Dashboard
          </Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link to="/job-listings">
            <Briefcase className="h-4 w-4" />
            Job Listings
          </Link>
        </Button>
      </div>
    </div>
  );
}