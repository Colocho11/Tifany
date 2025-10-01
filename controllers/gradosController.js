const pool = require('../models/db');
exports.obtenerGrados = async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT id, nombre FROM grados ORDER BY id'
        );
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al traer los grados:', error);
        res.status(500).json({ error: 'Error al obtener los grados' });
    }
};