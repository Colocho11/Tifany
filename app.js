const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Importa las rutas relativas a la carpeta backend
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Importa las rutas de productos 
const productosRoutes = require('./routes/productosRoutes');
app.use('/api/productos', productosRoutes);

// Importa las rutas de clientes
const clientesRoutes = require('./routes/clientesRoutes');
app.use('/api/clientes', clientesRoutes);

// Importa las rutas de grados
const gradosRoutes = require('./routes/gradosRoutes');
app.use('/api/grados', gradosRoutes);

// Sirve el frontend como estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirige '/' al login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});

