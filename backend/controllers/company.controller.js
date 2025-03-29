import {Company} from "../models/company.model.js";

export const registerCompany = async(req,res)=>{
    try{
       const {name} = req.body;
       if(!name){
        return res.status(400).json({
            message:"Company name is required",
            success:false
        });
       }
       let company = await Company.findOne({name:name});
       if(company){
        return res.status(400).json({
            message:"you can't register same company",
            success:false
        })
       };
     company= await Company.create({
        name:name,
        userId:req.id
     })

     return res.status(201).json({
        message:"company registered successfully",
        company,
        success:true
     })

    }catch(error){
        console.log(error);
    }
}

export const getCompany = async(req,res)=>{
    try{
         const userId = req.id;
         const companies = await Company.find({userId});
         if(!companies){
            return res.status(404).json({
                message:"companies not found",
                success:false
            })
         }
         return res.status(200).json({
            companies,
            success:true
         })
    }catch(error){
        console.log(error);
    };
}

export const getCompanyById = async(req,res)=>{
    try{
      const companyId = req.params.id;
      const company = await Company.findById(companyId);
      if(!company){
        return res.status(404).json({
            message:"company not found",
            success:false
        })
      }
      return res.status(200).json({
        company,
        success:true
      })
    }catch(error){
        console.log(error);
    }
}

export const updateCompany = async (req, res) => {
    try {
      const { name, description, website, location } = req.body;
      const file = req.file; // This is where the logo would be if uploaded as a single file.
  
      let logo;
      if (file) {
        logo = file.path; // Assuming `file.path` contains the path to the uploaded logo.
      }
  
      const updateData = { name, description, website, location };
      if (logo) {
        updateData.logo = logo; // Add logo to the updateData only if it exists.
      }
  
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!company) {
        return res.status(404).json({
          message: "Company not found",
          success: false,
        });
      }
  
      return res.status(200).json({
        message: "Company information updated",
        company,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred",
        success: false,
      });
    }
  };
  