const express = require("express");
const router = express.Router();
const upload = require("../uploads/upload");

// CONTROLLERS
const loginController = require("../controllers/loginController");
const arbitroController = require("../controllers/arbitroController");
const ligasController = require("../controllers/ligasController");
const categoriaController = require("../controllers/categoriaController");
const equipoController = require("../controllers/equipoController");
const jugadorController = require("../controllers/jugadorController");
const solicitudController = require("../controllers/solicitudController");
const adminController = require("../controllers/adminController");

// =======================
// AUTH
// =======================
router.post("/login", loginController.login);

// =======================
// JUGADORES
// =======================
router.post("/createJugador", loginController.crearJugador);
router.get("/jugadores/:id", jugadorController.getJugadorById);
router.put("/jugadores/:id", jugadorController.updateJugador);
router.put("/jugadores/:id/salir-equipo", jugadorController.salirEquipo);
router.put("/jugadores/:id", upload.single("Foto"), jugadorController.updateJugador);

// =======================
// ÁRBITROS
// =======================
router.post("/createArbitro", loginController.crearArbitro);
router.get("/arbitro/:id", arbitroController.getArbitro);
router.put("/arbitro/:id", arbitroController.updateArbitro);

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
router.post("/equipos", equipoController.createEquipo);
router.get("/equipos", equipoController.getEquipos);
router.get("/equipos/:id/jugadores", equipoController.getJugadoresByEquipo);
router.get("/equipos/jugador/:id", equipoController.getEquipoByJugador);
router.post("/equipos", upload.single("Logo"), equipoController.createEquipo);

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

module.exports = router;
