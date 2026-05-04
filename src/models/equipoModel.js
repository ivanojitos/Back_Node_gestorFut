const { sql, getPool } = require("../config/db");

class Equipo {

  // 🔥 CREAR EQUIPO
  static async create(data) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Nombre", sql.VarChar, data.Nombre)
      .input("Id_Liga", sql.Int, data.Id_Liga)
      .input("Id_Categoria", sql.Int, data.Id_Categoria)
      .input("Id_Jugador", sql.Int, data.Id_Jugador)
      .input("Estatus", sql.NVarChar, "activo")
      .input("Logo", sql.VarChar, data.Logo || "")
      .query(`
        INSERT INTO Equipos
        (Nombre, Id_Liga, Id_Categoria, Id_Jugador, Estatus, Logo,
         PJ, PG, PE, PP, GF, GC, Diferencia, PTS)
        OUTPUT INSERTED.*
        VALUES
        (@Nombre, @Id_Liga, @Id_Categoria, @Id_Jugador, @Estatus, @Logo,
         0,0,0,0,0,0,0,0)
      `);

    return result.recordset[0];
  }

  // 🔥 OBTENER EQUIPO POR JUGADOR
  static async getByJugador(id) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Id", sql.Int, id)
      .query(`
        SELECT * 
        FROM Equipos 
        WHERE Id_Jugador = @Id
      `);

    return result.recordset;
  }

  // 🔥 OBTENER JUGADORES DEL EQUIPO
  static async getJugadoresByEquipo(idEquipo) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Id_Equipo", sql.Int, idEquipo)
      .query(`
        SELECT 
          Id,
          NombreCompleto,
          Numero,
          Posicion,
          Foto
        FROM Jugadores
        WHERE Id_Equipo = @Id_Equipo
      `);

    return result.recordset;
  }

}

module.exports = Equipo;