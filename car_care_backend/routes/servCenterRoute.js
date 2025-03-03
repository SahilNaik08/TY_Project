const express = require('express');
const upload = require('../middlewares/multer');
const { centerList, loginServCenter } = require('../controllers/ServiceCenterController');
const { addServCenter } = require('../controllers/adminController');
//const { allServCent } = require('../controllers/adminController'); 



const centerRouter = express.Router();

// Route to upload an image
centerRouter.post('/upload-image', upload.single('service_center_image'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
      message: "Image uploaded successfully",
      filePath: `/uploads/${req.file.filename}`  // Relative path to access the image
  });
});

// Existing route
centerRouter.get("/service-center-list", centerList);

centerRouter.post("/add-service-center", addServCenter);

centerRouter.post('/login',loginServCenter)

//centerRouter.post("/list", allServCent)

module.exports = centerRouter;
