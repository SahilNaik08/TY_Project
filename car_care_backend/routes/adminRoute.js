import express from "express";
import { addServCenter, allServCent, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/ServiceCenterController.js";




const adminRouter = express.Router();

adminRouter.post('/add-service-center',authAdmin,upload.single('image'),addServCenter);

adminRouter.post('/login',loginAdmin);

adminRouter.post('/all-service-centers',authAdmin,allServCent);

adminRouter.post('/change-availability',authAdmin,changeAvailability);

export default adminRouter;

