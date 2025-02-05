const express = require("express");
const { addServCenter, allServCent, loginAdmin } = require("../controllers/adminController");
const upload = require("../middlewares/multer");
const authAdmin = require("../middlewares/authAdmin");
const { changeAvailability } = require("../controllers/ServiceCenterController");

const adminRouter = express.Router();

adminRouter.post('/add-service-center', authAdmin, upload.single('image'), addServCenter);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-service-centers', authAdmin, allServCent);
adminRouter.post('/change-availability', authAdmin, changeAvailability);

module.exports = adminRouter;
