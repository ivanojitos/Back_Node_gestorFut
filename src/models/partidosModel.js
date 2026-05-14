const { getPool } = require("../config/db");

/*
=========================================
🔥 PRÓXIMO PARTIDO
=========================================
*/
const getProximoPartido = async (idEquipo) => {
  const pool = await getPool();

  const result = await pool.request().input("IdEquipo", idEquipo).query(`
      SELECT TOP 1
        rj.Id,
        rj.Fecha_Juego,
        rj.Hora_Juego,

        c.Nombre AS cancha,

        el.Nombre AS local_nombre,
        el.Logo AS local_logo,

        ev.Nombre AS visitante_nombre,
        ev.Logo AS visitante_logo

      FROM Rol_Juego rj

      INNER JOIN Canchas c
        ON c.Id = rj.Id_Cancha

      INNER JOIN Equipos el
        ON el.Id = rj.Id_Equipo_local

      INNER JOIN Equipos ev
        ON ev.Id = rj.Id_Equipo_visitante

      WHERE 
        (rj.Id_Equipo_local = @IdEquipo
        OR rj.Id_Equipo_visitante = @IdEquipo)
        AND rj.Fecha_Juego >= GETDATE()

      ORDER BY rj.Fecha_Juego ASC
    `);

  return result.recordset[0] || null;
};

/*
=========================================
🔥 HISTORIAL
=========================================
*/
const getHistorialPartidos = async (idEquipo) => {
  const pool = await getPool();

  const result = await pool.request().input("IdEquipo", idEquipo).query(`
      SELECT TOP 10
        rj.Id,
        rj.Fecha_Juego,
        rj.Hora_Juego,

        c.Nombre AS cancha,

        el.Nombre AS local_nombre,
        el.Logo AS local_logo,

        ev.Nombre AS visitante_nombre,
        ev.Logo AS visitante_logo

      FROM Rol_Juego rj

      INNER JOIN Canchas c
        ON c.Id = rj.Id_Cancha

      INNER JOIN Equipos el
        ON el.Id = rj.Id_Equipo_local

      INNER JOIN Equipos ev
        ON ev.Id = rj.Id_Equipo_visitante

      WHERE 
        (rj.Id_Equipo_local = @IdEquipo
        OR rj.Id_Equipo_visitante = @IdEquipo)
        AND rj.Fecha_Juego < GETDATE()

      ORDER BY rj.Fecha_Juego DESC
    `);

  return result.recordset;
};

/*
=========================================
🔥 CREAR PARTIDO
=========================================
*/
const crearPartido = async (data) => {
  const pool = await getPool();

  try {
    const result = await pool
      .request()
      .input("Id_Liga", data.Id_Liga)
      .input("Id_Categoria", data.Id_Categoria)
      .input("Id_Equipo_local", data.Id_Equipo_local)
      .input("Id_Equipo_visitante", data.Id_Equipo_visitante)
      .input("Id_Arbitro", data.Id_Arbitro)
      .input("Id_Cancha", data.Id_Cancha)
      .input("Fecha_Juego", data.Fecha_Juego)
      .input("Hora_Juego", data.Hora_Juego)
      .input("Responsable_Partido", data.Responsable_Partido)
      .input("Estado", "Programado").query(`
      INSERT INTO Rol_Juego (
        Id_Liga,
        Id_Categoria,
        Id_Equipo_local,
        Id_Equipo_visitante,
        Id_Arbitro,
        Id_Cancha,
        Fecha_Juego,
        Hora_Juego,
        Responsable_Partido,
        Estado
      )
      OUTPUT INSERTED.*
      VALUES (
        @Id_Liga,
        @Id_Categoria,
        @Id_Equipo_local,
        @Id_Equipo_visitante,
        @Id_Arbitro,
        @Id_Cancha,
        @Fecha_Juego,
        @Hora_Juego,
        @Responsable_Partido,
        @Estado
      )
    `);

    return result.recordset[0];
  } catch (err) {
    console.error("❌ ERROR SQL INSERT:", err);
    throw err;
  }
};

const getAllPartidos = async () => {
  const pool = await getPool();

  const result = await pool.request().query(`
    SELECT 
      rj.Id,
      rj.Fecha_Juego,
      rj.Hora_Juego,
      rj.Estado,
      rj.Id_Cancha,

      l.Nombre AS Liga,
      cat.Nombre AS Categoria,

      el.Nombre AS local,
      ev.Nombre AS visitante,

      el.Logo AS local_logo,
      ev.Logo AS visitante_logo,

      c.Nombre AS Cancha,
      a.Nombre AS Arbitro

    FROM Rol_Juego rj

LEFT JOIN Ligas l ON l.Id = rj.Id_Liga
LEFT JOIN Categorias cat ON cat.Id = rj.Id_Categoria
LEFT JOIN Equipos el ON el.Id = rj.Id_Equipo_local
LEFT JOIN Equipos ev ON ev.Id = rj.Id_Equipo_visitante
LEFT JOIN Canchas c ON c.Id = rj.Id_Cancha
LEFT JOIN Arbitros a ON a.Id = rj.Id_Arbitro

WHERE LTRIM(RTRIM(LOWER(rj.Estado))) = 'programado'

    ORDER BY rj.Fecha_Juego DESC
  `);

  return result.recordset;
};

const getAllPartidosByTeam = async (idEquipo, liga, categoria) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("IdEquipo", idEquipo)
    .input("Liga", liga)
    .input("Categoria", categoria).query(`
SELECT 
  rj.Id,
  rj.Fecha_Juego,
  rj.Hora_Juego,
  rj.Estado,

  l.Nombre AS Liga,
  cat.Nombre AS Categoria,

  el.Nombre AS local,
  ev.Nombre AS visitante,

  el.Logo AS local_logo,
  ev.Logo AS visitante_logo,

  c.Nombre AS Cancha,
  a.Nombre AS Arbitro

FROM Rol_Juego rj

LEFT JOIN Ligas l ON l.Id = rj.Id_Liga
LEFT JOIN Categorias cat ON cat.Id = rj.Id_Categoria
LEFT JOIN Equipos el ON el.Id = rj.Id_Equipo_local
LEFT JOIN Equipos ev ON ev.Id = rj.Id_Equipo_visitante
LEFT JOIN Canchas c ON c.Id = rj.Id_Cancha
LEFT JOIN Arbitros a ON a.Id = rj.Id_Arbitro

WHERE 
(
  rj.Id_Equipo_local = @IdEquipo
  OR rj.Id_Equipo_visitante = @IdEquipo
)
AND l.Nombre = @Liga
AND cat.Nombre = @Categoria
AND LTRIM(RTRIM(LOWER(rj.Estado))) = 'programado'

ORDER BY rj.Fecha_Juego DESC
    `);

  return result.recordset;
};

/*
=========================================
🔥 PARTIDOS POR ÁRBITRO
=========================================
*/
const getPartidosByArbitro = async (idArbitro) => {
  const pool = await getPool();

  const result = await pool.request().input("IdArbitro", idArbitro).query(`
SELECT 
  rj.Id,
  rj.Fecha_Juego,
  rj.Hora_Juego,
  rj.Estado,
  rj.Id_Equipo_local,
  rj.Id_Equipo_visitante,
  rj.Goles_Local,
  rj.Goles_Visitante,
  rj.Id_Cancha,

  el.Posicion AS Posicion_Local,
  ev.Posicion AS Posicion_Visitante,

  l.Nombre AS Liga,
  cat.Nombre AS Categoria,

  el.Nombre AS local,
  ev.Nombre AS visitante,

  el.Logo AS local_logo,
  ev.Logo AS visitante_logo,

  c.Nombre AS Cancha,
  a.Nombre AS Arbitro

FROM Rol_Juego rj

LEFT JOIN Ligas l 
  ON l.Id = rj.Id_Liga

LEFT JOIN Categorias cat 
  ON cat.Id = rj.Id_Categoria

LEFT JOIN Equipos el 
  ON el.Id = rj.Id_Equipo_local

LEFT JOIN Equipos ev 
  ON ev.Id = rj.Id_Equipo_visitante

LEFT JOIN Canchas c 
  ON c.Id = rj.Id_Cancha

LEFT JOIN Arbitros a 
  ON a.Id = rj.Id_Arbitro

WHERE rj.Id_Arbitro = @IdArbitro

ORDER BY rj.Fecha_Juego DESC
`);

  return result.recordset;
};

/*
=========================================
🔥 PARTIDOS FINALIZADOS POR EL ARBITRO
=========================================
*/

/*
=========================================
🔥 RECALCULAR POSICIONES
=========================================
*/

const recalcularPosiciones = async (transaction, idLiga, idCategoria) => {
  // 🔥 OBTENER TABLA ORDENADA
  const result = await transaction
    .request()
    .input("IdLiga", idLiga)
    .input("IdCategoria", idCategoria).query(`
      SELECT
        Id,
        PTS,
        Diferencia,
        GF,
        PJ,
        PP
      FROM Equipos
      WHERE
        Id_Liga = @IdLiga
        AND Id_Categoria = @IdCategoria

      ORDER BY
        ISNULL(PTS,0) DESC,
        ISNULL(Diferencia,0) DESC,
        ISNULL(GF,0) DESC,
        ISNULL(PJ,0) ASC,
        ISNULL(PP,0) ASC
    `);

  const equipos = result.recordset;

  // 🔥 ACTUALIZAR POSICIÓN
  for (let i = 0; i < equipos.length; i++) {
    await transaction
      .request()
      .input("EquipoId", equipos[i].Id)
      .input("Posicion", i + 1).query(`
        UPDATE Equipos
        SET Posicion = @Posicion
        WHERE Id = @EquipoId
      `);
  }
};

const finalizarPartido = async (payload) => {
  const pool = await getPool();
  const transaction = pool.transaction();
  try {
    await transaction.begin();
    // =====================================================
    // DATOS //
    // =====================================================
    const local = payload.equipoLocal;
    const visitante = payload.equipoVisitante;
    const golesLocal = local.estadisticas.goles;
    const golesVisitante = visitante.estadisticas.goles;
    // ===================================================== //
    // 🔥 ACTUALIZAR GOLES JUGADORES //
    // =====================================================
    const actualizarGolesJugadores = async (goleadores) => {
      for (const jugador of goleadores) {
        await transaction
          .request()
          .input("IdJugador", jugador.id)
          .input("Goles", jugador.goals)
          .query(
            ` UPDATE Jugadores SET Goles = ISNULL(Goles,0) + @Goles WHERE Id = @IdJugador `,
          );
      }
    };
    await actualizarGolesJugadores(local.goleadores);
    await actualizarGolesJugadores(visitante.goleadores);
    // ===================================================== //
    // 🔥 ACTUALIZAR EQUIPOS //
    // =====================================================
    const actualizarEquipo = async ({
      equipoId,
      golesFavor,
      golesContra,
      gano,
      perdio,
      empato,
    }) => {
      let puntos = 0;
      if (gano) puntos = 3;
      if (empato) puntos = 1;
      await transaction
        .request()
        .input("EquipoId", equipoId)
        .input("GF", golesFavor)
        .input("GC", golesContra)
        .input("Diferencia", golesFavor - golesContra)
        .input("PG", gano ? 1 : 0)
        .input("PP", perdio ? 1 : 0)
        .input("PE", empato ? 1 : 0)
        .input("PTS", puntos).query(` 
            UPDATE Equipos SET PJ = ISNULL(PJ,0) + 1, 
            PG = ISNULL(PG,0) + @PG, 
            PE = ISNULL(PE,0) + @PE, 
            PP = ISNULL(PP,0) + @PP, 
            GF = ISNULL(GF,0) + @GF, 
            GC = ISNULL(GC,0) + @GC, 
            Diferencia = ISNULL(Diferencia,0) + @Diferencia, 
            PTS = ISNULL(PTS,0) + @PTS 
            WHERE Id = @EquipoId `);
    };
    // ===================================================== //
    // 🔥 LOCAL GANA //
    // =====================================================
    if (golesLocal > golesVisitante) {
      await actualizarEquipo({
        equipoId: local.id,
        golesFavor: golesLocal,
        golesContra: golesVisitante,
        gano: true,
        perdio: false,
        empato: false,
      });
      await actualizarEquipo({
        equipoId: visitante.id,
        golesFavor: golesVisitante,
        golesContra: golesLocal,
        gano: false,
        perdio: true,
        empato: false,
      });
    }
    // ===================================================== //
    // 🔥 VISITANTE GANA //
    //  =====================================================
    else if (golesVisitante > golesLocal) {
      await actualizarEquipo({
        equipoId: visitante.id,
        golesFavor: golesVisitante,
        golesContra: golesLocal,
        gano: true,
        perdio: false,
        empato: false,
      });
      await actualizarEquipo({
        equipoId: local.id,
        golesFavor: golesLocal,
        golesContra: golesVisitante,
        gano: false,
        perdio: true,
        empato: false,
      });
    }
    // ===================================================== //
    // 🔥 EMPATE // =====================================================
    else {
      await actualizarEquipo({
        equipoId: local.id,
        golesFavor: golesLocal,
        golesContra: golesVisitante,
        gano: false,
        perdio: false,
        empato: true,
      });
      await actualizarEquipo({
        equipoId: visitante.id,
        golesFavor: golesVisitante,
        golesContra: golesLocal,
        gano: false,
        perdio: false,
        empato: true,
      });
    }
    // ===================================================== //
    // 🔥 ACTUALIZAR ESTADO DEL PARTIDO //
    // =====================================================
    await transaction
      .request()
      .input("IdPartido", payload.partido.id)
      .input("GolesLocal", golesLocal)
      .input("GolesVisitante", golesVisitante)
      .query(` UPDATE Rol_Juego SET Estado = 'Jugado',
        Goles_Local = @GolesLocal, Goles_Visitante = @GolesVisitante 
        WHERE Id = @IdPartido `);

    // =====================================================
    // 🔥 RECALCULAR TABLA
    // =====================================================

    console.log(payload.partido);

    await recalcularPosiciones(
      transaction,
      payload.partido.idLiga,
      payload.partido.idCategoria,
    );

    // =====================================================
    // // COMMIT //
    // =====================================================
    await transaction.commit();
    return { success: true };
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    throw error;
  }
};

const getPartidosEquipoPaginado = async (idEquipo, page = 1, limit = 10) => {
  const pool = await getPool();

  const offset = (page - 1) * limit;

  const result = await pool.request().input("IdEquipo", idEquipo).query(`
    SELECT
      rj.Id,
      rj.Fecha_Juego,
      rj.Hora_Juego,
      rj.Estado,
      rj.Id_Cancha,
      rj.Goles_Local,
      rj.Goles_Visitante,
      el.Logo,
      
      el.Nombre AS local_nombre,
      ev.Nombre AS visitante_nombre,
      

    FROM Rol_Juego rj

    INNER JOIN Equipos el
      ON el.Id = rj.Id_Equipo_local

    INNER JOIN Equipos ev
      ON ev.Id = rj.Id_Equipo_visitante

    WHERE
      rj.Id_Equipo_local = @IdEquipo
      OR rj.Id_Equipo_visitante = @IdEquipo

    ORDER BY rj.Fecha_Juego DESC
  `);

  return result.recordset;
};

const existePartido = async ({ liga, categoria, fechaInicio, fechaFin }) => {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("Liga", Number(liga))
    .input("Categoria", Number(categoria))
    .input("FechaInicio", fechaInicio)
    .input("FechaFin", fechaFin).query(`
      SELECT TOP 1 Id
      FROM Rol_Juego

      WHERE
        Id_Liga = @Liga
        AND Id_Categoria = @Categoria
        AND Fecha_Juego BETWEEN @FechaInicio AND @FechaFin
    `);

  return result.recordset.length > 0;
};

module.exports = {
  crearPartido,
  getProximoPartido,
  getHistorialPartidos,
  getAllPartidos,
  getAllPartidosByTeam,
  getPartidosByArbitro,
  finalizarPartido, // 👈 AGREGA ESTE
  getPartidosEquipoPaginado,
  existePartido, // 👈 agregar
};
