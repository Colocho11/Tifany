const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas del backend
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const productosRoutes = require('./routes/productosRoutes');
app.use('/api/productos', productosRoutes);

const clientesRoutes = require('./routes/clientesRoutes');
app.use('/api/clientes', clientesRoutes);

const gradosRoutes = require('./routes/gradosRoutes');
app.use('/api/grados', gradosRoutes);

// Servir el frontend como estático
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirige '/' al login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});

