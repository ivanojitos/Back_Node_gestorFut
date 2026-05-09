const express = require("express");
const router = express.Router();
const upload = require("../uploads/upload");
const uploadEquipo = require("../uploads/uploadEquipo");

// CONTROLLERS
const loginController = require("../controllers/loginController");
const arbitroController = require("../controllers/arbitroController");
const ligasController = require("../controllers/ligasController");
const categoriaController = require("../controllers/categoriaController");
const equipoController = require("../controllers/equipoController");
const jugadorController = require("../controllers/jugadorController");
const solicitudController = require("../controllers/solicitudController");
const adminController = require("../controllers/adminController");
const partidosController = require("../controllers/partidosController");

// =======================
// AUTH
// =======================
router.post("/login", loginController.login);

// =======================
// JUGADORES
// =======================
router.post(
  "/createJugador",
  upload.single("Foto"), // 🔥 FALTA ESTO
  loginController.crearJugador,
);
router.get("/jugadores/:id", jugadorController.getJugadorById);
router.put("/jugadores/:id/salir-equipo", jugadorController.salirEquipo);
router.put(
  "/jugadores/:id",
  upload.single("Foto"),
  jugadorController.updateJugador,
);

// =======================
// ÁRBITROS
// =======================
router.post("/createArbitro", loginController.crearArbitro);
router.get("/arbitro/:id", arbitroController.getArbitro);
router.put("/arbitro/:id", arbitroController.updateArbitro);
// NUEVO
router.get("/arbitros", arbitroController.getArbitros);

// =======================
// LIGAS
// =======================
router.get("/ligas", ligasController.getLigas);
router.get("/ligas/:id", ligasController.getLigaById);
router.post("/ligas", upload.single("Logo"), ligasController.createLiga);

// =======================
// CATEGORÍAS
// =======================
router.post("/categorias", categoriaController.createCategoria);
router.get("/categorias", categoriaController.getCategorias);


// =======================
// EQUIPOS
// =======================

router.get("/equipos", equipoController.getEquipos);
router.get("/equipos/:id/jugadores", equipoController.getJugadoresByEquipo);
router.get("/equipos/jugador/:id", equipoController.getEquipoByJugador);
router.post(
  "/equipos",
  uploadEquipo.single("Logo"),
  equipoController.createEquipo,
);
router.get("/tabla", equipoController.getTabla);
// =======================
// ADMIN
// =======================
router.get("/admins", adminController.getAdmins);
router.post("/admins", adminController.createAdmin);

// =======================
// SOLICITUDES
// =======================
router.post("/solicitudes", solicitudController.createSolicitud);
router.get("/solicitudes/jugador/:id", solicitudController.getByJugador);

// 👑 NUEVO: dueño del equipo ve solicitudes
router.get("/solicitudes/equipo/:id", solicitudController.getByEquipo);

// ✅ aceptar jugador
router.put("/solicitudes/aceptar/:id", solicitudController.accept);

// ❌ rechazar jugador
router.put("/solicitudes/rechazar/:id", solicitudController.reject);

// =======================
// MIS PARTIDOS
// =======================

// 🔥 obtener próximos + historial
router.get("/mis-partidos/:idEquipo", partidosController.obtenerMisPartidos);

// =======================
// ADMINISTRADOR
// =======================

//PROGRAMAR PARTIDOS
router.post("/partidos", partidosController.crearPartido);
router.get("/partidosFull", partidosController.getPartidos);
router.get(
  "/partidos/equipo/:idEquipo",
  partidosController.getPartidosPorEquipo,
);
router.get(
  "/partidos/arbitro/:idArbitro",
  partidosController.getPartidosByArbitro,
);

// =======================
// ARBITRO
// =======================
router.post("/partidos/finalizar", partidosController.finalizarPartido);

router.get(
  "/partidos-equipo/:idEquipo",
  partidosController.obtenerPartidosEquipo,
);

module.exports = router;
