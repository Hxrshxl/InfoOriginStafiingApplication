import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async(req,res)=>{
    try{
      const userId = req.id;
      const jobId = req.params.id;
      if(!jobId){
         return res.status(400).json({
            message:"job id is required",
            success:false
         })
      };
    
     const existingApplication = await Application.findOne({job:jobId,applicant:userId});
     if(existingApplication){
        return res.status(400).json({
            message:" you have already applied for this jobs",
            success:false
        })
     };
     const job = await Job.findById(jobId);
     if(!job){
        return res.status(404).json({
            message:"job not found",
            success:false
        })
     }
 

   const newApplication = await Application.create({
    job:jobId,
    applicant:userId,
   });
   job.applications.push(newApplication._id);
   await job.save();
   return res.status(201).json({
    message:"job applied successfully.",
    success:true
   })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Error applying for job",
            success: false
        });
    }
};

export const getAppliedJobs = async(req,res)=>{
  try{
    const userId = req.id;
    
    // First check if userId exists
    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing, authentication may have failed",
        success: false
      });
    }
    
    // Then run the query
    const applications = await Application.find({applicant:userId})
      .sort({createdAt:-1})
      .populate({
        path:'job',
        options:{sort:{createdAt:-1}}
      })
      .populate({
        path:'applicant'
      });
    
    if(!applications || applications.length === 0){
      return res.status(404).json({
          message:"No Applications Found",
          success:false
      })
    };
    
    return res.status(200).json({
      applications,
      success:true
    });
  } catch(error) {
      console.log("Error details:", error);
      return res.status(500).json({
          message: `Error fetching applied jobs: ${error.message}`,
          success: false
      });
  }
};

//admin dekehega kitne user ne apply kiya hai  
export const getApplicants = async(req,res)=>{
  try{
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path:'applications',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant'
        }
    });

    if(!job){
        return res.status(404).json({
            message:"job not found",
            success:false
        })
    };

    return res.status(200).json({
        job,
        success:true
    });

  }catch(error){
      console.log(error);
      return res.status(500).json({
          message: "Error fetching applicants",
          success: false
      });
  }
};

export const updateStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const applicationId = req.params.id;
  
      if (!status) {
        return res.status(400).json({
          message: "Status is required",
          success: false,
        });
      }
  
      const validStatuses = ["pending", "accepted", "rejected"];
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({
          message: "Invalid status value",
          success: false,
        });
      }
  
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({
          message: "Application not found",
          success: false,
        });
      }
  
      application.status = status.toLowerCase();
      await application.save();
  
      return res.status(200).json({
        message: "Status updated successfully",
        success: true,
        application,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", success: false });
    }
  };