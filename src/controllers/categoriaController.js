const Categoria = require("../models/categoriaModel");

// 🔥 CREAR
exports.createCategoria = async (req, res) => {
  try {
    const { Nombre, Estatus, Id_Liga } = req.body;

    if (!Nombre || !Id_Liga) {
      return res.status(400).json({
        ok: false,
        error: "Nombre y Liga son obligatorios",
      });
    }

    const nueva = await Categoria.create({
      Nombre,
      Estatus,
      Id_Liga,
    });

    return res.json({
      ok: true,
      message: "Categoría creada",
      data: nueva,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};

// 🔥 LISTAR
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.getAll();

    return res.json({
      ok: true,
      data: categorias,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};

// 🔥 OBTENER POR ID (como arbitro)
exports.getCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        error: "Categoría no encontrada",
      });
    }

    return res.json({
      ok: true,
      data: categoria,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};

// 🔥 ACTUALIZAR
exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Categoria.update(id, req.body);

    if (!updated) {
      return res.status(404).json({
        ok: false,
        error: "Categoría no encontrada",
      });
    }

    return res.json({
      ok: true,
      message: "Categoría actualizada",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};