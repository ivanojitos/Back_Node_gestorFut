const express = require("express");
const router = express.Router();
const upload = require("../uploads/upload");

const loginController = require("../controllers/loginController");
const arbitroController = require("../controllers/arbitroController");
const ligasController = require("../controllers/ligasController");

// LOGIN
router.post("/login", loginController.login);

// CREAR
router.post("/createJugador", loginController.crearJugador);
router.post("/createArbitro", loginController.crearArbitro);

router.get("/arbitro/:id", arbitroController.getArbitro);

// UPDATE
router.put("/arbitro/:id", arbitroController.updateArbitro);

// ✅ CREAR LIGA

// ✅ OBTENER TODAS
router.get("/ligas", ligasController.getLigas);

// ✅ OBTENER UNA
router.get("/ligas/:id", ligasController.getLigaById);

router.post("/ligas", upload.single("Logo"), ligasController.createLiga);

const adminController = require("../controllers/adminController");

// 🔥 ADMINS
router.get("/admins", adminController.getAdmins);
router.post("/admins", adminController.createAdmin);

//CATEGORIAS
router.post("/categorias", categoriaController.createCategoria);
router.get("/categorias", categoriaController.getCategorias);



module.exports = router;
