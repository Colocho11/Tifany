const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController.js');

// GET /api/clientes
router.get('/', clientesController.obtenerClientes);

module.exports = router;
