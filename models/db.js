const { Pool } = require('pg');

// Configuración de la base de datos usando variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,        // Usuario de la base de datos
    host: process.env.DB_HOST,        // Host de la base de datos (no localhost)
    database: process.env.DB_NAME,    // Nombre de la base de datos
    password: process.env.DB_PASS,    // Contraseña
    port: process.env.DB_PORT,        // Puerto, normalmente 5432
    ssl: { rejectUnauthorized: false } // Necesario para Render PostgreSQL
});

// Exporta el pool para usar en los controllers
module.exports = pool;

