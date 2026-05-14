const Partidos = require("../models/partidosModel");

// 🔥 OBTENER MIS PARTIDOS (PRÓXIMO + HISTORIAL)
exports.obtenerMisPartidos = async (req, res) => {
  try {
    const { idEquipo } = req.params;

    const proximo = await Partidos.getProximoPartido(idEquipo);
    const anteriores = await Partidos.getHistorialPartidos(idEquipo);

    res.json({
      ok: true,
      proximo,
      anteriores,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error obteniendo partidos",
    });
  }
};

// 🔥 CREAR PARTIDO
exports.crearPartido = async (req, res) => {
  try {
    const {
      Id_Liga,
      Id_Categoria,
      Id_Equipo_local,
      Id_Equipo_visitante,
      Id_Arbitro,
      Id_Cancha,
      Fecha_Juego,
      Hora_Juego,
      Responsable_Partido,
    } = req.body;

    // VALIDACIÓN
    if (
      Id_Liga == null ||
      Id_Categoria == null ||
      Id_Equipo_local == null ||
      Id_Equipo_visitante == null ||
      Id_Arbitro == null ||
      Id_Cancha == null ||
      !Fecha_Juego ||
      !Hora_Juego ||
      !Responsable_Partido
    ) {
      return res.status(400).json({
        ok: false,
        message: "Faltan datos obligatorios",
        data: req.body,
      });
    }

    const nuevo = await Partidos.crearPartido({
      Id_Liga,
      Id_Categoria,
      Id_Equipo_local,
      Id_Equipo_visitante,
      Id_Arbitro,
      Id_Cancha,
      Fecha_Juego,
      Hora_Juego,
      Responsable_Partido,
    });

    return res.status(201).json({
      ok: true,
      message: "Partido creado correctamente",
      data: nuevo,
    });
  } catch (error) {
    console.log("❌ ERROR CREANDO PARTIDO:", error);

    return res.status(500).json({
      ok: false,
      message: "Error creando partido",
      error: error.message,
    });
  }
};

exports.getPartidos = async (req, res) => {
  try {
    const data = await Partidos.getAllPartidos();

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error obteniendo partidos",
    });
  }
};

exports.getPartidosPorEquipo = async (req, res) => {
  try {
    const { idEquipo } = req.params;
    const { liga, categoria } = req.query;

    const data = await Partidos.getAllPartidosByTeam(idEquipo, liga, categoria);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error filtrando partidos",
    });
  }
};

// 🔥 PARTIDOS POR ÁRBITRO
exports.getPartidosByArbitro = async (req, res) => {
  try {
    const { idArbitro } = req.params;

    const data = await Partidos.getPartidosByArbitro(idArbitro);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Error obteniendo partidos del árbitro",
    });
  }
};

//DE ARBITROS CUANDO TERMINA

exports.finalizarPartido = async (req, res) => {
  try {
    const payload = req.body;
    const data = await Partidos.finalizarPartido(payload);
    res.json({ ok: true, message: "Partido finalizado correctamente", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: "Error finalizando partido" });
  }
};

exports.obtenerPartidosEquipo = async (req, res) => {
  try {
    const { idEquipo } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const partidos = await Partidos.getPartidosEquipoPaginado(
      idEquipo,
      page,
      limit,
    );

    res.json({
      ok: true,
      data: partidos,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error servidor",
    });
  }
};

exports.existePartido = async (req, res) => {
  try {
    const { liga, categoria, fechaInicio, fechaFin } = req.query;

    if (!liga || !categoria || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        ok: false,
        message: "Faltan parámetros",
      });
    }

    const exists = await Partidos.existePartido({
      liga,
      categoria,
      fechaInicio,
      fechaFin,
    });

    console.log(exists);

    res.json({
      ok: true,
      exists,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: "Error verificando partidos",
    });
  }
};
