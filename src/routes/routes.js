const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const arbitroController = require('../controllers/arbitroController');

router.post('/login', loginController.login);
router.post('/createJugador', loginController.crearJugador);
router.post('/createArbitro', loginController.crearArbitro);
router.put('/arbitro/:id', arbitroController.updateArbitro);
module.exports = router;