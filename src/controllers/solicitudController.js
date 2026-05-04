const Solicitud = require("../models/solicitudModel");

exports.createSolicitud = async (req, res) => {
  try {
    const { Id_Equipo, Id_Jugador } = req.body;

    if (!Id_Equipo || !Id_Jugador) {
      return res.status(400).json({
        ok: false,
        message: "Datos incompletos",
      });
    }

    await Solicitud.create({
      Id_Equipo,
      Id_Jugador,
    });

    res.json({
      ok: true,
      message: "Solicitud enviada",
    });
  } catch (error) {
    console.error("ERROR solicitud:", error);

    res.status(500).json({
      ok: false,
      message: "Error al enviar solicitud",
    });
  }
};

exports.getByJugador = async (req, res) => {
  try {
    const data = await Solicitud.getByJugador(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
