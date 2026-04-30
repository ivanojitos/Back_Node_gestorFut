const { getPool } = require("../config/db");

class Equipo {
  static async create(data) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Nombre", data.Nombre)
      .input("Id_Liga", data.Id_Liga)
      .input("Id_Categoria", data.Id_Categoria)
      .input("Id_Jugador", data.Id_Jugador)
      .input("Estatus", "activo")
      .input("Logo", data.Logo || "")
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

  static async getByJugador(id) {
    const pool = await getPool();

    const result = await pool.request()
      .input("Id", id)
      .query(`SELECT * FROM Equipos WHERE Id_Jugador = @Id`);

    return result.recordset;
  }
}

module.exports = Equipo;