const Liga = require("../models/ligasModel");

// 🔥 CREAR
exports.createLiga = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 ruta del archivo guardado
    const logoPath = req.file
      ? `/imagenes/${Nombre.replace(/\s+/g, "").toLowerCase()}/${req.file.filename}`
      : null;

    const nuevaLiga = await Liga.create(data);

    res.status(201).json({
      ok: true,
      message: "Liga creada correctamente",
      data: nuevaLiga,
    });
  } catch (error) {
    console.error(error);
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
