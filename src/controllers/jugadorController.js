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

exports.updateJugador = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findById(id);

    if (!jugador) {
      return res.status(404).json({ msg: "Jugador no existe" });
    }

    // 🔥 si viene archivo, usarlo
    console.log("FILE:", req.file);
    const foto = req.file
      ? `/imagenes/jugadores/${req.file.filename}`
      : req.body.Foto;

    const data = {
      ...req.body,
      Foto: foto,
    };

    const actualizado = await Jugador.update(id, data);

    res.json({
      ok: true,
      data: actualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando jugador" });
  }
};

exports.salirEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    const jugador = await Jugador.findById(id);

    if (!jugador) {
      return res.status(404).json({
        ok: false,
        message: "Jugador no encontrado",
      });
    }

    await Jugador.salirEquipo(id);

    res.json({
      ok: true,
      message: "Jugador salió del equipo",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error al salir del equipo",
    });
  }
};

exports.getJugador = async (req, res) => {
  try {
   
    const jugadores = await Jugador.findAll();

    if (!jugadores) {
      return res.status(404).json({
        ok: false,
        message: "Jugadores no encontrados",
      });
    }

    res.json({
      ok: true,
      data: jugadores,
    });
  } catch (error) {
    console.error("Error getJugadores:", error);

    res.status(500).json({
      ok: false,
      message: "Error del servidor",
    });
  }
};
