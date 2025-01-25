import validator from "validator"
import bcrypt from "bcrypt"
import db from "../models/ServiceCenterModel.js"
import jwt from "jsonwebtoken"



// API for adding serv_center

const addServCenter = async (req,res) => {

  try{

    const {sc_name, sc_email, password, serviceType, city, state} = req.body

    const imageFile = req.file 

    //checking for all data to add service center (validation)
    if (!sc_name || !sc_email || !password || !serviceType || !city || !state ) {

      return res.json({success:false, messgae:"Missing details"})

    }

    //validating email format
    if (!validator.isEmail(sc_email)) {
      return res.json({success:false, messgae:"Enter a valid email!"})
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({success:false, messgae:"Please enter a strong password!"})
    }

    //storing password in encrypted form, in the databse using the bcrypt package using salt (hash)

    //hashing sc password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //uploading image to cloudinary
    //to be completed

    //adding data to database
    const scData = {
      sc_name,
      sc_email,
      password:hashedPassword,
      serviceType,
      city,
      state

    }

    const newServCenter = new db(scData);
    await newServCenter.save();

    res.json({success:true,messgae:"Service center added"});



  } catch (error) {
      console.log(error)
      res.json({success:false,message:"error.message"})
  }

}

//api for admin login
const loginAdmin = async (req,res) => {

  try{

    const {email,password} = req.body

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

      const token = jwt.sign(email+password,process.env.JWT_SECRET)
      res.json({success:true,token})

    } else {
      res.json({success:false,message:"Invalid Credentials"})
    }

  } catch (error) {

    console.log(error)
    res.json({success:false,message:"error.message"})

  }

}

//api to get all serv centers list for admin panel.
const allServCent = async (req,res) => {


  try{

    const servCenters = await db.find({}).select('-password');
    //doesn't include password

    res.json({success:true,servCenters})

  }
  catch (error) {
    console.log(error)
    res.json({success:false,message:"error.message"})

  }
}

export {addServCenter, loginAdmin, allServCent}