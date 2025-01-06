import express from "express";
import { addServCenter } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";

const adminRouter = express.Router()

adminRouter.post('/add-service-center',upload.single('image'),addServCenter)

export default adminRouter

