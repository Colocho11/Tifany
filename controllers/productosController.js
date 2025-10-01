const pool = require('../models/db');

// Obtener TODOS los productos
exports.getTodosLosProductos = async (req, res) => {
    console.log('\n[API] ===== INICIO PETICIÓN GET /api/productos =====');
    try {
        console.log('[API] Lanzando consulta: SELECT * FROM productos');
        const result = await pool.query(
            'SELECT id, descripcion, cantidad, precio_unitario, modulo_id FROM productos ORDER BY id'
        );
        console.log('[API] Consulta exitosa. Cantidad de productos obtenidos:', result.rows.length);
        res.json(result.rows);
        console.log('[API] Respuesta enviada al cliente (JSON con productos)');
        console.log('[API] ===== FIN PETICIÓN GET /api/productos =====\n');
    } catch (error) {
        console.error('[ERROR] Al obtener todos los productos:', error);
        res.status(500).json({ mensaje: 'Error al traer productos' });
        console.log('[API] ===== FIN PETICIÓN GET /api/productos (con error) =====\n');
    }
};

// Obtener productos por módulo
exports.getProductosPorModulo = async (req, res) => {
    const moduloId = req.params.moduloId;
    console.log(`\n[API] ===== INICIO PETICIÓN GET /api/productos/modulo/${moduloId} =====`);
    try {
        console.log(`[API] Lanzando consulta: SELECT * FROM productos WHERE modulo_id = ${moduloId}`);
        const result = await pool.query(
            'SELECT id, descripcion, cantidad, precio_unitario, modulo_id FROM productos WHERE modulo_id = $1 ORDER BY id',
            [moduloId]
        );
        console.log(`[API] Consulta exitosa. Productos obtenidos para módulo ${moduloId}:`, result.rows.length);
        res.json(result.rows);
        console.log('[API] Respuesta enviada al cliente (JSON con productos por módulo)');
        console.log(`[API] ===== FIN PETICIÓN GET /api/productos/modulo/${moduloId} =====\n`);
    } catch (error) {
        console.error('[ERROR] Al obtener productos por módulo:', error);
        res.status(500).json({ mensaje: 'Error al traer productos por módulo' });
        console.log(`[API] ===== FIN PETICIÓN GET /api/productos/modulo/${moduloId} (con error) =====\n`);
    }
};

// AGREGAR producto
exports.agregarProducto = async (req, res) => {
    const { cantidad, descripcion, precio_unitario, modulo_id } = req.body;
    console.log('\n[API] ===== INICIO PETICIÓN POST /api/productos =====');
    console.log('[API] Datos recibidos en el body:', req.body);
    try {
        console.log(`[API] Lanzando consulta: INSERT INTO productos (cantidad, descripcion, precio_unitario, modulo_id) VALUES (${cantidad}, "${descripcion}", ${precio_unitario}, ${modulo_id})`);
        const result = await pool.query(
            `INSERT INTO productos (cantidad, descripcion, precio_unitario, modulo_id)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [cantidad, descripcion, precio_unitario, modulo_id]
        );
        console.log('[SUCCESS] Producto agregado exitosamente:', result.rows[0]);
        res.status(201).json({ success: true, producto: result.rows[0] });
        console.log('[API] Respuesta enviada al cliente (producto agregado)');
        console.log('[API] ===== FIN PETICIÓN POST /api/productos =====\n');
    } catch (error) {
        console.error('[ERROR] Al agregar producto:', error);
        res.status(500).json({ mensaje: 'Error al agregar producto' });
        console.log('[API] ===== FIN PETICIÓN POST /api/productos (con error) =====\n');
    }
};

// EDITAR producto
exports.editarProducto = async (req, res) => {
    const id = req.params.id;
    let { cantidad, descripcion, precio_unitario } = req.body;

    // Permitir cantidad null
    if (cantidad === "" || cantidad === undefined) cantidad = null;

    console.log(`\n[API] ===== INICIO PETICIÓN PUT /api/productos/${id} =====`);
    console.log('[API] Datos recibidos para editar:', { cantidad, descripcion, precio_unitario });
    try {
        console.log(`[API] Lanzando consulta: UPDATE productos SET cantidad = ${cantidad}, descripcion = "${descripcion}", precio_unitario = ${precio_unitario} WHERE id = ${id}`);
        const result = await pool.query(
            `UPDATE productos 
            SET cantidad = $1, descripcion = $2, precio_unitario = $3 
            WHERE id = $4 RETURNING *`,
            [cantidad, descripcion, precio_unitario, id]
        );
        if (result.rows.length === 0) {
            console.warn(`[WARN] Producto con id ${id} no encontrado para editar`);
            res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
        } else {
            console.log('[SUCCESS] Producto actualizado:', result.rows[0]);
            res.json({ success: true, mensaje: 'Producto actualizado', producto: result.rows[0] });
        }
        console.log('[API] Respuesta enviada al cliente (producto actualizado o advertencia)');
        console.log(`[API] ===== FIN PETICIÓN PUT /api/productos/${id} =====\n`);
    } catch (error) {
        console.error('[ERROR] Al editar producto:', error);
        res.status(500).json({ mensaje: 'Error al editar producto' });
        console.log(`[API] ===== FIN PETICIÓN PUT /api/productos/${id} (con error) =====\n`);
    }
};

// ELIMINAR producto
exports.eliminarProducto = async (req, res) => {
    const id = req.params.id;
    console.log(`\n[API] ===== INICIO PETICIÓN DELETE /api/productos/${id} =====`);
    try {
        console.log(`[API] Lanzando consulta: DELETE FROM productos WHERE id = ${id}`);
        const result = await pool.query(
            `DELETE FROM productos WHERE id = $1 RETURNING *`, [id]
        );
        if (result.rows.length === 0) {
            console.warn(`[WARN] Producto con id ${id} no encontrado para eliminar`);
            res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
        } else {
            console.log('[SUCCESS] Producto eliminado:', result.rows[0]);
            res.json({ success: true, mensaje: 'Producto eliminado' });
        }
        console.log('[API] Respuesta enviada al cliente (producto eliminado o advertencia)');
        console.log(`[API] ===== FIN PETICIÓN DELETE /api/productos/${id} =====\n`);
    } catch (error) {
        console.error('[ERROR] Al eliminar producto:', error);
        res.status(500).json({ mensaje: 'Error al eliminar producto' });
        console.log(`[API] ===== FIN PETICIÓN DELETE /api/productos/${id} (con error) =====\n`);
    }
};


// Totalizar o actualizar un producto
exports.actualizarProducto = async (req, res) => {
    const id = parseInt(req.params.id);
    const { cantidad, descripcion, precio_unitario, totalizar } = req.body;
    const usuario_id = req.user ? req.user.id : 1; // Cambia por tu sistema de auth

    try {
        // Obtener cantidad actual
        const { rows } = await db.query('SELECT cantidad FROM productos WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });

        let cantidadActual = parseInt(rows[0].cantidad) || 0;
        let cantidadNueva = cantidad;

        // Sumar si viene bandera "totalizar"
        if (totalizar) {
            cantidadNueva = cantidadActual + parseInt(cantidad);
        }

        // Actualizar producto
        await db.query(
            'UPDATE productos SET cantidad = $1, descripcion = $2, precio_unitario = $3 WHERE id = $4',
            [cantidadNueva, descripcion, precio_unitario, id]
        );

        // Registrar movimiento (si suma, siempre entrada)
        await db.query(
            'INSERT INTO movimientos (producto_id, cantidad, tipo, usuario_id) VALUES ($1, $2, $3, $4)',
            [id, cantidad, 'entrada', usuario_id]
        );

        res.json({ success: true, mensaje: 'Producto actualizado', cantidad: cantidadNueva });

    } catch (err) {
        console.error('[BACKEND] Error al actualizar producto:', err);
        res.status(500).json({ mensaje: 'Error interno' });
    }
};