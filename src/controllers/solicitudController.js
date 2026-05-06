const Solicitud = require("../models/solicitudModel");

exports.createSolicitud = async (req, res) => {
  try {
    await Solicitud.create(req.body);

    res.json({
      ok: true,
      message: "Solicitud enviada",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      ok: false,
      message: error.message,
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

// 👑 NUEVO: solicitudes por equipo (OWNER)
exports.getByEquipo = async (req, res) => {
  try {
    const data = await Solicitud.getByEquipo(req.params.id);

    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ✅ aceptar
exports.accept = async (req, res) => {
  try {
    await Solicitud.accept(req.params.id);

    res.json({
      ok: true,
      message: "Jugador aceptado",
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// ❌ rechazar
exports.reject = async (req, res) => {
  try {
    await Solicitud.reject(req.params.id);

    res.json({
      ok: true,
      message: "Solicitud rechazada",
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
