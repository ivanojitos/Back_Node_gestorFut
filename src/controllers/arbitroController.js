const Arbitro = require("../models/arbitroModel");

exports.updateArbitro = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Arbitro.update(req.body, {
      where: { Id: id }, // ⚠️ usa el nombre real de tu columna
    });

    if (!updated) {
      return res.status(404).json({
        ok: false,
        error: "Árbitro no encontrado",
        data: req.body,
      });
    }

    res.json({
      ok: true,
      message: "Árbitro actualizado",
      data: arbitroActualizado,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};

exports.getArbitro = async (req, res) => {
  try {
    const { id } = req.params;

    const arbitro = await Arbitro.findById(id); // ✅ CORRECTO

    if (!arbitro) {
      return res.status(404).json({ error: "Árbitro no encontrado" });
    }

    res.json(arbitro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
};
