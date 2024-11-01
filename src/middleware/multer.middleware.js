/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 01-11-2024
 * Description: This middleware handles file uploads for temporary storage. It utilizes multer to save uploaded files to a temporary directory. Files are saved with their original names in the 'public/temp' folder.
 */

const multer = require("multer");

// Configure storage options for multer
const storage = multer.diskStorage({
  // Define destination directory for uploaded files
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // Preserve original file name for the uploaded file
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize multer with defined storage configuration
const tempUpload = multer({ storage: storage });

module.exports = { tempUpload };
