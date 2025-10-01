const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Obtener TODOS los productos
router.get('/', productosController.getTodosLosProductos);

// Obtener productos por módulo
router.get('/modulo/:moduloId', productosController.getProductosPorModulo);

// AGREGAR producto
router.post('/', productosController.agregarProducto);

// EDITAR producto
router.put('/:id', productosController.editarProducto);

// ELIMINAR producto
router.delete('/:id', productosController.eliminarProducto);

// PUT /api/productos/:id (para totalizar o editar producto)
router.put('/:id', productosController.actualizarProducto);

module.exports = router;
