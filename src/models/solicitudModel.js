const { getPool, sql } = require("../config/db");

class Solicitud {
  static async create(data) {
    const pool = await getPool();

    await pool.request()
      .input("Id_Equipo", sql.Int, data.Id_Equipo)
      .input("Id_Jugador", sql.Int, data.Id_Jugador)
      .input("Estado", sql.VarChar, "Pendiente")
      .query(`
        INSERT INTO Solicitudes (Id_Equipo, Id_Jugador, Estado)
        VALUES (@Id_Equipo, @Id_Jugador, @Estado)
      `);
  }
}

module.exports = Solicitud;