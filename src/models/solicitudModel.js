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
        AND Estado IN ('Pendiente')
      `);

    if (existe.recordset.length > 0) {
      throw new Error("Ya existe una solicitud activa");
    }

    await pool
      .request()
      .input("Id_Equipo", sql.Int, data.Id_Equipo)
      .input("Id_Jugador", sql.Int, data.Id_Jugador).query(`
        INSERT INTO Solicitudes (Id_Equipo, Id_Jugador, Estado)
        VALUES (@Id_Equipo, @Id_Jugador, 'Pendiente')
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

  // 👑 SOLICITUDES POR EQUIPO (OWNER)
  static async getByEquipo(idEquipo) {
    const pool = await getPool();

    const result = await pool.request().input("Id_Equipo", sql.Int, idEquipo)
      .query(`
      SELECT s.Id, s.Id_Jugador, j.NombreCompleto, j.Posicion
      FROM Solicitudes s
      INNER JOIN Jugadores j ON j.Id = s.Id_Jugador
      WHERE s.Id_Equipo = @Id_Equipo
      AND s.Estado = 'Pendiente'
    `);

    return result.recordset;
  }

  static async updateStatus(id, estado) {
    const pool = await getPool();

    await pool
      .request()
      .input("Id", sql.Int, id)
      .input("Estado", sql.VarChar, estado).query(`
      UPDATE Solicitudes
      SET Estado = @Estado
      WHERE Id = @Id
    `);
  }

  // ✅ ACEPTAR
  static async accept(idSolicitud) {
    const pool = await getPool();

    const sol = await pool.request().input("Id", sql.Int, idSolicitud).query(`
        SELECT * FROM Solicitudes WHERE Id = @Id
      `);

    const data = sol.recordset[0];

    if (!data) throw new Error("Solicitud no encontrada");

    // actualizar solicitud
    await pool.request().input("Id", sql.Int, idSolicitud).query(`
        UPDATE Solicitudes
        SET Estado = 'Aceptado'
        WHERE Id = @Id
      `);

      

    // =========================================
    // BUSCAR JUGADOR
    // =========================================
    const jugador = await pool
      .request()
      .input("Id_Jugador", sql.Int, data.Id_Jugador).query(`
      SELECT Id, Id_Liga
      FROM Jugadores
      WHERE Id = @Id_Jugador
    `);

    if (jugador.recordset.length === 0) {
      throw new Error("Jugador no encontrado");
    }

    const jugadorData = jugador.recordset[0];

    // =========================================
    // SI EL JUGADOR NO TIENE LIGA
    // =========================================
    if (jugadorData.Id_Liga === 0 || jugadorData.Id_Liga === null) {
      // =========================================
      // BUSCAR LIGA DEL EQUIPO
      // =========================================
      const equipo = await pool
        .request()
        .input("Id_Equipo", sql.Int, data.Id_Equipo).query(`
        SELECT Id_Liga
        FROM Equipos
        WHERE Id = @Id_Equipo
      `);

      if (equipo.recordset.length === 0) {
        throw new Error("Equipo no encontrado");
      }

      const idLigaEquipo = equipo.recordset[0].Id_Liga;

      // =========================================
      // ACTUALIZAR JUGADOR
      // =========================================

      await pool
        .request()
        .input("Id_Jugador", sql.Int, data.Id_Jugador)
        .input("Id_Liga", sql.Int, idLigaEquipo).query(`
        UPDATE Jugadores
        SET Id_Liga = @Id_Liga
        WHERE Id = @Id_Jugador
      `);
    }

    // =========================================
    // AQUI ACABA EL NUEVO CAMBIO 
    // =========================================

    // asignar jugador al equipo
    await pool
      .request()
      .input("Id_Jugador", sql.Int, data.Id_Jugador)
      .input("Id_Equipo", sql.Int, data.Id_Equipo).query(`
        UPDATE Jugadores
        SET Id_Equipo = @Id_Equipo,
            Estatus = 'ACTIVO'
        WHERE Id = @Id_Jugador
      `);
  }

  // ❌ RECHAZAR
  static async reject(idSolicitud) {
    const pool = await getPool();

    await pool.request().input("Id", sql.Int, idSolicitud).query(`
        UPDATE Solicitudes
        SET Estado = 'Rechazado'
        WHERE Id = @Id
      `);
  }
}

module.exports = Solicitud;
