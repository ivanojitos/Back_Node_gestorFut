const Equipo = require("../models/equipoModel");
const { getPool, sql } = require("../config/db"); // 🔥 necesario para update

const fs = require("fs");
const path = require("path");
// 🔥 CREAR EQUIPO
exports.createEquipo = async (req, res) => {
  try {
    const { Id_Jugador, Nombre } = req.body;

    if (!Id_Jugador) {
      return res.status(400).json({
        ok: false,
        error: "Id_Jugador requerido",
      });
    }

    // 🔥 validar duplicado
    const existing = await Equipo.getByJugador(Id_Jugador);

    if (existing.length > 0) {
      return res.status(400).json({
        ok: false,
        error: "Ya tiene equipo",
      });
    }

    // 🔥 carpeta dinámica igual que ligas
    const folderName = Nombre.replace(/\s+/g, "").toLowerCase();

    const uploadPath = path.join(
      __dirname,
      "../imagenes/equipos",
      folderName,
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // 🔥 LOGO
    const logoPath = req.file
      ? `/imagenes/equipos/${folderName}/${req.file.filename}`
      : null;

    const equipo = await Equipo.create({
      ...req.body,
      Logo: logoPath,
    });

    const pool = await getPool();

    await pool
      .request()
      .input("Id_Equipo", sql.Int, equipo.Id)
      .input("Id_Jugador", sql.Int, Id_Jugador).query(`
        UPDATE Jugadores
        SET Id_Equipo = @Id_Equipo
        WHERE Id = @Id_Jugador
      `);

    res.json({
      ok: true,
      data: equipo,
    });
  } catch (error) {
    console.error(error);
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

exports.getEquipos = async (req, res) => {
  try {
    const { Id_Liga, Id_Categoria } = req.query;

    const equipos = await Equipo.getEquipos({
      Id_Liga,
      Id_Categoria,
    });

    res.json({
      ok: true,
      data: equipos,
    });
  } catch (error) {
    console.error("ERROR getEquipos:", error);

    res.status(500).json({
      ok: false,
      message: "Error al obtener equipos",
    });
  }
};

//PARA MI TABLA DE EQUIPOS

exports.getTabla = async (req, res) => {
  try {
    const { Id_Liga, Id_Categoria } = req.query;

    if (!Id_Liga || !Id_Categoria) {
      return res.status(400).json({
        ok: false,
        message: "Faltan parámetros",
      });
    }

    const tabla = await Equipo.getTabla(Id_Liga, Id_Categoria);

    res.json({
      ok: true,
      data: tabla,
    });
  } catch (error) {
    console.error("ERROR getTabla:", error);
    res.status(500).json({
      ok: false,
      message: "Error servidor",
    });
  }
};
