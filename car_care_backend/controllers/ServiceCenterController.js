import db from "../models/ServiceCenterModel.js"

const changeAvailability = async (req,res) => {

  try{

    const {scId} = req.body

    const scData = await db.findById(scId)

    await db.findByIdAndUpdate(scId,{available: !scData.available})

    res.json({success:true, message:"Availability changed"})

  }  catch (error) {

    console.log(error)
    res.json({success:false,message:"error.message"})

  }

}

export {changeAvailability}