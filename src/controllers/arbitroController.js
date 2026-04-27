const Arbitro = require("../models/arbitroModel");

exports.updateArbitro = async (req, res) => {
  try {
    const { id } = req.params;

    const arbitroActualizado = await Arbitro.update(id, req.body);

    res.json({
      ok: true,
      data: arbitroActualizado,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};