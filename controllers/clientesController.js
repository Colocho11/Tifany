const pool = require('../models/db');
// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT id, nombre, nit, direccion, observacion FROM clientes ORDER BY nombre'
        );
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al traer los clientes:', error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};
