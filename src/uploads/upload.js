// middlewares/upload.js

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const liga = req.body.Nombre || "default";

    // 🔥 limpiar nombre (importante)
    const folderName = liga.replace(/\s+/g, "").toLowerCase();

    const dir = path.join(__dirname, "../imagenes", folderName);

    // 🔥 crear carpeta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "logo" + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;