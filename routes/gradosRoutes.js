const express = require('express');
const router = express.Router();
const gradosController = require('../controllers/gradosController');

// GET /api/grados
router.get('/', gradosController.obtenerGrados);

module.exports = router;
