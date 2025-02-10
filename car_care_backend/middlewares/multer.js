const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

// Setting up storage configuration for storing images locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
    console.log(req.body); // The folder where images will be saved
  },
  filename: (req, file, cb) => {
    console.log('working');
    
    console.log({reqBody: req.body})
    let serviceCenterName = req.body.sc_name || 'default_name';
  
    // Removing spaces and special characters from the name to avoid issues
    serviceCenterName = serviceCenterName.replace(/[^a-zA-Z0-9]/g, '_');

    // Generating a filename using the service center name + timestamp
    cb(null, `${serviceCenterName}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
   
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

module.exports = upload;
