const { sql, getPool } = require("../config/db");

class Equipo {
  // 🔥 CREAR EQUIPO
  static async create(data) {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("Nombre", sql.VarChar, data.Nombre)
      .input("Id_Liga", sql.Int, data.Id_Liga)
      .input("Id_Categoria", sql.Int, data.Id_Categoria)
      .input("Id_Jugador", sql.Int, data.Id_Jugador)
      .input("Estatus", sql.NVarChar, "activo")
      .input("Logo", sql.VarChar, data.Logo || "").query(`
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

    const result = await pool.request().input("Id", sql.Int, id).query(`
      SELECT e.*, l.Nombre AS Liga, c.Nombre AS Categoria
      FROM Jugadores j
      INNER JOIN Equipos e ON j.Id_Equipo = e.Id
      LEFT JOIN Ligas l ON e.Id_Liga = l.Id
      LEFT JOIN Categorias c ON e.Id_Categoria = c.Id
      WHERE j.Id = @Id
    `);

    return result.recordset;
  }

  // 🔥 OBTENER JUGADORES DEL EQUIPO
  static async getJugadoresByEquipo(idEquipo) {
    const pool = await getPool();

    const result = await pool.request().input("Id_Equipo", sql.Int, idEquipo)
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

  static async getEquipos(filters) {
    const pool = await getPool();

    let query = `
    SELECT 
      e.*, 
      l.Nombre AS Liga, 
      c.Nombre AS Categoria,
      (SELECT COUNT(*) FROM Jugadores j WHERE j.Id_Equipo = e.Id) AS TotalJugadores
    FROM Equipos e
    LEFT JOIN Ligas l ON e.Id_Liga = l.Id
    LEFT JOIN Categorias c ON e.Id_Categoria = c.Id
    WHERE 1=1
  `;

    const request = pool.request();

    if (filters.Id_Liga) {
      query += " AND e.Id_Liga = @Id_Liga";
      request.input("Id_Liga", sql.Int, filters.Id_Liga);
    }

    if (filters.Id_Categoria) {
      query += " AND e.Id_Categoria = @Id_Categoria";
      request.input("Id_Categoria", sql.Int, filters.Id_Categoria);
    }

    const result = await request.query(query);

    return result.recordset;
  }
}

module.exports = Equipo;
