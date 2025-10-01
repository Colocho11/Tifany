const pool = require('../models/db');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    const { usuario, password } = req.body;

    // Validación de campos vacíos
    if (!usuario || !password) {
        console.log('[LOGIN] Datos incompletos: usuario o contraseña vacíos');
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    try {
        console.log(`[LOGIN] Buscando usuario: "${usuario}"...`);
        const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);

        if (result.rows.length === 0) {
            console.log(`[LOGIN] Usuario "${usuario}" NO encontrado`);
            return res.status(401).json({ error: 'Usuario no existe' });
        }

        const user = result.rows[0];
        console.log(`[LOGIN] Usuario "${usuario}" encontrado. Verificando contraseña...`);

        // Permite comparar contra hash o texto plano
        let passwordMatch = false;
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
            // Es un hash bcrypt
            passwordMatch = await bcrypt.compare(password, user.password);
        } else {
            // Contraseña en texto plano (solo para pruebas)
            passwordMatch = password === user.password;
        }

        if (!passwordMatch) {
            console.log(`[LOGIN] Contraseña incorrecta para usuario "${usuario}"`);
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        console.log(`[LOGIN] Usuario "${usuario}" autenticado correctamente`);
        res.json({ success: true, usuario: user.usuario, rol: user.rol });

    } catch (error) {
        console.error('[LOGIN] Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
