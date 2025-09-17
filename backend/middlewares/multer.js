import multer from 'multer'

// Storage configuration
const storage = multer.diskStorage({
  // Where to store the uploaded files
  destination: function (req, file, callback) {
    callback(null, 'uploads/')   // Files will be saved inside the "uploads" folder
  },
  // How the file should be named
  filename: function (req, file, callback) {
    callback(null, file.originalname) // Keep the original file name
  }
}) 

// Upload middleware
const upload = multer({ storage })

export default upload
