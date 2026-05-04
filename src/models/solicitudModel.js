const { getPool, sql } = require("../config/db");

class Solicitud {
  static async create(data) {
    const pool = await getPool();

    // ❌ evitar duplicado
    const existe = await pool
      .request()
      .input("Id_Equipo", sql.Int, data.Id_Equipo)
      .input("Id_Jugador", sql.Int, data.Id_Jugador).query(`
      SELECT 1 FROM Solicitudes
      WHERE Id_Equipo = @Id_Equipo
      AND Id_Jugador = @Id_Jugador
      AND Estado IN ('Pendiente','Abierta')
    `);

    if (existe.recordset.length > 0) {
      throw new Error("Ya existe una solicitud activa");
    }

    await pool
      .request()
      .input("Id_Equipo", sql.Int, data.Id_Equipo)
      .input("Id_Jugador", sql.Int, data.Id_Jugador).query(`
      INSERT INTO Solicitudes (Id_Equipo, Id_Jugador)
      VALUES (@Id_Equipo, @Id_Jugador)
    `);
  }

  static async getByJugador(idJugador) {
    const pool = await getPool();

    const result = await pool.request().input("Id_Jugador", sql.Int, idJugador)
      .query(`
      SELECT Id, Id_Equipo, Estado
      FROM Solicitudes
      WHERE Id_Jugador = @Id_Jugador
    `);

    return result.recordset;
  }
}

module.exports = Solicitud;
