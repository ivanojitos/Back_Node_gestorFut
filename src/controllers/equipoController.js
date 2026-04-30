const Equipo = require("../models/equipoModel");

exports.createEquipo = async (req, res) => {
  const existing = await Equipo.getByJugador(req.body.Id_Jugador);

  if (existing.length > 0) {
    return res.status(400).json({
      ok: false,
      error: "Ya tiene equipo",
    });
  }

  const data = await Equipo.create(req.body);

  res.json({
    ok: true,
    data,
  });
};

exports.getEquipoByJugador = async (req, res) => {
  const data = await Equipo.getByJugador(req.params.id);

  res.json({
    ok: true,
    data,
  });
};