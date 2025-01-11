import express from "express";
import { addServCenter, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";




const adminRouter = express.Router()

adminRouter.post('/add-service-center',authAdmin,upload.single('image'),addServCenter)

adminRouter.post('/login',loginAdmin)

export default adminRouter

