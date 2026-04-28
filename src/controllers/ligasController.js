const Liga = require("../models/ligasModel");

// 🔥 CREAR
const fs = require("fs");
const path = require("path");

exports.createLiga = async (req, res) => {
  try {
    const data = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // ✅ VALIDACIÓN
    if (!data || !data.Nombre || !data.Nombre.trim()) {
      return res.status(400).json({
        ok: false,
        error: "El nombre es obligatorio dicen",
      });
    }

    const nombre = data.Nombre.trim();
    const folderName = nombre.replace(/\s+/g, "").toLowerCase();

    // ✅ CREAR CARPETA DINÁMICA
    const uploadPath = path.join(__dirname, "../../imagenes", folderName);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // ✅ LOGO PATH
    const logoPath = req.file
      ? `/imagenes/${folderName}/${req.file.filename}`
      : null;

    data.Logo = logoPath;

    const nuevaLiga = await Liga.create(data);

    res.status(201).json({
      ok: true,
      message: "Liga creada correctamente",
      data: nuevaLiga,
    });
  } catch (error) {
    console.error("ERROR CREATE LIGA:", error);

    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

// 🔥 OBTENER TODAS
exports.getLigas = async (req, res) => {
  try {
    const ligas = await Liga.getAll();

    res.json({
      ok: true,
      data: ligas,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};

// 🔥 OBTENER UNA
exports.getLigaById = async (req, res) => {
  try {
    const { id } = req.params;

    const liga = await Liga.getById(id);

    if (!liga) {
      return res.status(404).json({
        ok: false,
        error: "Liga no encontrada",
      });
    }

    res.json({
      ok: true,
      data: liga,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
};
