const Equipo = require("../models/equipoModel");
const { getPool, sql } = require("../config/db"); // 🔥 necesario para update

// 🔥 CREAR EQUIPO
exports.createEquipo = async (req, res) => {
  try {
    const { Id_Jugador } = req.body;

    if (!Id_Jugador) {
      return res.status(400).json({
        ok: false,
        error: "Id_Jugador requerido",
      });
    }

    // 🔥 VALIDAR SI YA TIENE EQUIPO
    const existing = await Equipo.getByJugador(Id_Jugador);

    if (existing.length > 0) {
      return res.status(400).json({
        ok: false,
        error: "Ya tiene equipo",
      });
    }

    // 🔥 CREAR EQUIPO
    const equipo = await Equipo.create(req.body);

    // 🔥 ASIGNAR EQUIPO AL JUGADOR (CLAVE 🔥)
    const pool = await getPool();

    await pool.request()
      .input("Id_Equipo", sql.Int, equipo.Id)
      .input("Id_Jugador", sql.Int, Id_Jugador)
      .query(`
        UPDATE Jugadores
        SET Id_Equipo = @Id_Equipo
        WHERE Id = @Id_Jugador
      `);

    res.json({
      ok: true,
      data: equipo,
    });

  } catch (error) {
    console.error("ERROR createEquipo:", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear equipo",
    });
  }
};


// 🔥 OBTENER EQUIPO POR JUGADOR
exports.getEquipoByJugador = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.getByJugador(id);

    res.json({
      ok: true,
      data: equipo || [],
    });

  } catch (error) {
    console.error("ERROR getEquipoByJugador:", error);
    res.status(500).json({
      ok: false,
      message: "Error servidor",
    });
  }
};


// 🔥 OBTENER JUGADORES POR EQUIPO
exports.getJugadoresByEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "Id de equipo requerido",
      });
    }

    const jugadores = await Equipo.getJugadoresByEquipo(id);

    res.json({
      ok: true,
      data: jugadores || [],
    });

  } catch (error) {
    console.error("ERROR getJugadoresByEquipo:", error);
    res.status(500).json({
      ok: false,
      message: "Error servidor",
    });
  }
};