// arbitroController.js

const Arbitro = require("../models/arbitroModel");

exports.getArbitroById = async (req, res) => {
  try {
    const arbitro = await Arbitro.findById(req.params.id);

    if (!arbitro) {
      return res.status(404).json({ message: "Árbitro no encontrado" });
    }

    res.json(arbitro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};