import validator from "validator"
import bcrypt from "bcrypt"



// API for adding serv_center

const addServCenter = async () => {

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

    



  } catch (error) {

  }

}

export {addServCenter}