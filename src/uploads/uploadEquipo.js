const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.Nombre.replace(/\s+/g, "").toLowerCase();

    const uploadPath = path.join(
      __dirname,
      "../../imagenes/equipos",
      folderName
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadEquipo = multer({ storage });

module.exports = uploadEquipo;