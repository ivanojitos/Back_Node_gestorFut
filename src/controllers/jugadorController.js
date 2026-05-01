const Jugador = require("../models/jugadorModel");

exports.getJugadorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "ID requerido",
      });
    }

    const jugador = await Jugador.findById(id);

    if (!jugador) {
      return res.status(404).json({
        ok: false,
        message: "Jugador no encontrado",
      });
    }

    res.json({
      ok: true,
      data: jugador,
    });

  } catch (error) {
    console.error("Error getJugadorById:", error);

    res.status(500).json({
      ok: false,
      message: "Error del servidor",
    });
  }
};