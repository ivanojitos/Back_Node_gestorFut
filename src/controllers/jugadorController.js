const db = require("../db"); // o tu conexión

exports.getJugadorById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM jugadores WHERE Id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Jugador no encontrado" });
    }

    res.json({
      ok: true,
      data: rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error servidor" });
  }
};