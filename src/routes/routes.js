const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const arbitroController = require('../controllers/arbitroController');

// LOGIN
router.post('/login', loginController.login);

// CREAR
router.post('/createJugador', loginController.crearJugador);
router.post('/createArbitro', loginController.crearArbitro);

router.get('/arbitro/:id', arbitroController.getArbitro);

// UPDATE
router.put('/arbitro/:id', arbitroController.updateArbitro);

// ✅ CREAR LIGA
router.post('/ligas', ligasController.createLiga);

// ✅ OBTENER TODAS
router.get('/ligas', ligasController.getLigas);

// ✅ OBTENER UNA
router.get('/ligas/:id', ligasController.getLigaById);

module.exports = router;