// === CONFIGURA EL ID DEL MÓDULO ACTUAL AQUÍ ===
const MODULO_ID = 3;

// === ELEMENTOS DEL DOM ===
const inputBuscador = document.getElementById('buscador-productos');
const btnBuscar = document.getElementById('btn-buscar');
const tablaProductos = document.getElementById('tabla-productos').getElementsByTagName('tbody')[0];
const tablaResumen = document.getElementById('tabla-resumen').getElementsByTagName('tbody')[0];
const totalGeneral = document.getElementById('total-general');

// === ESTADO ===
let productos = []; // Array principal de productos
let productosFiltrados = []; // Array de productos filtrados por búsqueda

// === FUNCIONES DE INTERFAZ ===
function formatearQ(valor) {
    return `<span class="text-primary fw-bold">Q ${parseFloat(valor).toFixed(2)}</span>`;
}

// Llenar tabla de productos con input editable en cantidad
function llenarTablaProductos(lista) {
    tablaProductos.innerHTML = "";
    lista.forEach(prod => {
        const fila = tablaProductos.insertRow();

        // Cantidad - input editable
        const tdCantidad = fila.insertCell();
        tdCantidad.innerHTML = `
            <input type="number" min="0" class="form-control cantidad-input" data-id="${prod.id}" 
                value="${prod.cantidad !== null && prod.cantidad !== undefined ? prod.cantidad : ''}">
        `;

        // Descripción
        fila.insertCell().textContent = prod.descripcion;
        // Precio Unitario
        fila.insertCell().innerHTML = formatearQ(prod.precio_unitario);

        // Acciones
        const acciones = fila.insertCell();
        acciones.innerHTML = `
            <button class="btn btn-sm btn-agregar-producto me-2 btn-editar" title="Editar">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-agregar-producto btn-eliminar" title="Eliminar">
                <i class="bi bi-trash3-fill"></i>
            </button>
        `;
        acciones.querySelector('.btn-editar').onclick = () => abrirModalEditar(prod);
        acciones.querySelector('.btn-eliminar').onclick = () => mostrarModalEliminar(prod);
    });

    // Escucha cambios en los inputs de cantidad
    tablaProductos.querySelectorAll('.cantidad-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const id = parseInt(e.target.dataset.id);
            const cantidad = e.target.value === "" ? null : parseInt(e.target.value);
            // Actualiza cantidad en productos y productosFiltrados
            let idx = productos.findIndex(p => p.id === id);
            if (idx !== -1) productos[idx].cantidad = cantidad;
            idx = productosFiltrados.findIndex(p => p.id === id);
            if (idx !== -1) productosFiltrados[idx].cantidad = cantidad;
            renderResumen(); // Refresca el resumen
        });
    });
}

// Renderiza la tabla resumen según cantidades puestas
function renderResumen() {
    tablaResumen.innerHTML = '';
    let total = 0;
    productos.forEach(prod => {
        const cantidad = prod.cantidad !== null && prod.cantidad !== undefined && prod.cantidad !== '' ? parseInt(prod.cantidad) : null;
        const fila = tablaResumen.insertRow();

        // Cantidad (puede estar vacía)
        fila.insertCell().textContent = cantidad !== null ? cantidad : '';

        // Descripción
        fila.insertCell().textContent = prod.descripcion;

        // Precio Unitario
        fila.insertCell().innerHTML = formatearQ(prod.precio_unitario);

        // Total por producto (si hay cantidad)
        let totalProd = '';
        if (cantidad !== null) {
            totalProd = cantidad * parseFloat(prod.precio_unitario);
            total += totalProd;
            fila.insertCell().innerHTML = formatearQ(totalProd);
        } else {
            fila.insertCell().innerHTML = '';
        }
    });
    totalGeneral.textContent = total > 0 ? total.toFixed(2) : '';
}

// === FILTRO DE TABLA ===
function filtrarTabla() {
    const filtro = inputBuscador.value.trim().toLowerCase();
    if (filtro === "") {
        productosFiltrados = [...productos];
    } else {
        productosFiltrados = productos.filter(p =>
            (p.descripcion || '').toLowerCase().includes(filtro)
        );
    }
    llenarTablaProductos(productosFiltrados);
}

// Buscar al escribir y al hacer click en el botón
inputBuscador.addEventListener('input', filtrarTabla); // búsqueda instantánea
btnBuscar.addEventListener('click', filtrarTabla);
inputBuscador.addEventListener('keydown', function (e) {
    if (e.key === "Enter") filtrarTabla();
});

// === CARGA INICIAL DE PRODUCTOS DEL MÓDULO ACTUAL ===
function cargarProductosDelModulo() {
    fetch(`/api/productos/modulo/${MODULO_ID}`)
        .then(response => response.json())
        .then(data => {
            productos = data.map(p => ({ ...p }));
            productosFiltrados = [...productos];
            llenarTablaProductos(productosFiltrados);
            renderResumen();
        })
        .catch(error => {
            console.error('[FRONTEND] Error al traer productos:', error);
        });
}

document.addEventListener('DOMContentLoaded', cargarProductosDelModulo);

// === MODAL EDITAR PRODUCTO ===
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
const formEditar = document.getElementById('formEditarProducto');
const inputEditarId = document.getElementById('editar-id');
const inputEditarCantidad = document.getElementById('editar-cantidad');
const inputEditarDescripcion = document.getElementById('editar-descripcion');
const inputEditarPrecio = document.getElementById('editar-precio');

function abrirModalEditar(prod) {
    inputEditarId.value = prod.id;
    inputEditarCantidad.value = prod.cantidad !== null && prod.cantidad !== undefined ? prod.cantidad : '';
    inputEditarDescripcion.value = prod.descripcion;
    inputEditarPrecio.value = prod.precio_unitario;
    modalEditar.show();
}

// Guardar cambios de edición
formEditar.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = inputEditarId.value;
    const cantidad = inputEditarCantidad.value.trim() === "" ? null : inputEditarCantidad.value;
    const descripcion = inputEditarDescripcion.value.trim();
    const precio_unitario = parseFloat(inputEditarPrecio.value);

    fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad, descripcion, precio_unitario })
    })
        .then(res => res.json())
        .then(resp => {
            if (resp && (resp.success || resp.mensaje === "Producto actualizado")) {
                cargarProductosDelModulo();
                modalEditar.hide();
            } else {
                alert('No se pudo actualizar el producto. Intenta de nuevo.');
            }
        })
        .catch(() => alert('Error de conexión al actualizar producto.'));
});

// === MODAL ELIMINAR PRODUCTO ===
const modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminarProducto'));
const textoEliminarProducto = document.getElementById('textoEliminarProducto');
const inputEliminarId = document.getElementById('eliminar-id');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

function mostrarModalEliminar(prod) {
    textoEliminarProducto.innerHTML = `¿Estás seguro que deseas eliminar <b>${prod.descripcion}</b>?`;
    inputEliminarId.value = prod.id;
    modalEliminar.show();
}

btnConfirmarEliminar.onclick = function () {
    const id = inputEliminarId.value;
    fetch(`/api/productos/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(resp => {
            if (resp && (resp.success || resp.mensaje === "Producto eliminado")) {
                cargarProductosDelModulo();
                modalEliminar.hide();
            } else {
                alert('No se pudo eliminar el producto.');
            }
        })
        .catch(() => alert('Error de conexión al eliminar producto.'));
};

// === AGREGAR PRODUCTO NUEVO  ===
const formAgregarProducto = document.getElementById('formAgregarProducto');
formAgregarProducto.addEventListener('submit', function (e) {
    e.preventDefault();

    const cantidad = document.getElementById('cantidad').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio_unitario = document.getElementById('precio_unitario').value;

    // MODULO_ID viene del const de arriba (asegúrate que sea el correcto)
    fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cantidad: cantidad,
            descripcion: descripcion,
            precio_unitario: precio_unitario,
            modulo_id: MODULO_ID // <--- este es el truco
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Cierra el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarProducto'));
                modal.hide();
                // Limpia el formulario
                formAgregarProducto.reset();
                // Recarga la tabla
                cargarProductosDelModulo();
            } else {
                alert('Error al agregar producto. Intenta de nuevo.');
            }
        })
        .catch(err => {
            console.error('[FRONTEND] Error al agregar producto:', err);
            alert('Error de red al agregar producto.');
        });
});


// === ACTUALIZA TABLA AL AGREGAR PRODUCTO NUEVO ===
document.addEventListener('productoAgregado', function (e) {
    cargarProductosDelModulo();
});


// === CLIENTES ===
const clienteSelect = document.getElementById('cliente-select');
const nitCliente = document.getElementById('nit-cliente');
const direccionCliente = document.getElementById('direccion-cliente');
const observacionCliente = document.getElementById('observacion-cliente');

// Traer clientes del backend y llenar el combo
function cargarClientes() {
    fetch('/api/clientes') // tu endpoint para listar clientes
        .then(res => res.json())
        .then(clientes => {
            clienteSelect.innerHTML = '<option value="">Seleccione un cliente...</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id; // puedes usar id o el objeto completo en value si prefieres
                option.textContent = cliente.nombre;
                option.dataset.nit = cliente.nit;
                option.dataset.direccion = cliente.direccion;
                option.dataset.observacion = cliente.observacion || '';
                clienteSelect.appendChild(option);
            });
        });
}

// Al seleccionar un cliente, llena los campos
clienteSelect.addEventListener('change', function () {
    const selected = clienteSelect.selectedOptions[0];
    nitCliente.value = selected.dataset.nit || '';
    direccionCliente.value = selected.dataset.direccion || '';
    observacionCliente.value = selected.dataset.observacion || '';
}); 

// Exportar PDF con resumen de productos
document.getElementById('btn-exportar-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(15);
    doc.text('Resumen de Productos - Totalización', 14, 18);

    // Datos del cliente, grado y fecha
    let y = 26;
    const nombreCliente = document.getElementById('cliente-select').selectedOptions[0]?.textContent || '';
    const nitCliente = document.getElementById('nit-cliente').value;
    const direccionCliente = document.getElementById('direccion-cliente').value;
    const observacionCliente = document.getElementById('observacion-cliente').value;

    // --- CAMBIO AQUÍ: Lee el grado solo en la función y solo una vez ---
    const gradoSelectDom = document.getElementById('grado-select');
    const gradoSeleccionado = gradoSelectDom && gradoSelectDom.selectedOptions.length > 0 ? gradoSelectDom.selectedOptions[0].textContent : '';

    // Fecha del input
    const fechaSeleccionada = document.querySelector('input[type="date"].campo-input').value;
    let fechaTexto = '';
    if (fechaSeleccionada) {
        const [yyyy, mm, dd] = fechaSeleccionada.split('-');
        fechaTexto = `${dd}/${mm}/${yyyy}`;
    }

    doc.setFontSize(11);
    doc.text(`Cliente: ${nombreCliente}`, 14, y); y += 6;
    doc.text(`NIT: ${nitCliente}`, 14, y); y += 6;
    doc.text(`Dirección: ${direccionCliente}`, 14, y); y += 6;
    if (observacionCliente) {
        doc.text(`Observación: ${observacionCliente}`, 14, y);
        y += 6;
    }
    // Solo muestra grado si no es el placeholder
    if (gradoSeleccionado && gradoSeleccionado !== "Seleccione un grado...") {
        doc.text(`Grado: ${gradoSeleccionado}`, 14, y);
        y += 6;
    }
    if (fechaTexto) {
        doc.text(`Fecha: ${fechaTexto}`, 14, y);
        y += 6;
    }

    // Tabla resumen
    const tabla = document.getElementById('tabla-resumen');
    const head = [[
        'Cantidad',
        'Descripción',
        'Pre. Unitario',
        'Total'
    ]];

    const body = [];
    Array.from(tabla.getElementsByTagName('tbody')[0].rows).forEach(tr => {
        const rowData = Array.from(tr.cells).map(td => td.innerText || td.textContent);
        if (rowData.some(campo => campo.trim() !== "")) {
            body.push(rowData);
        }
    });

    const totalGeneral = document.getElementById('total-general').textContent;
    if (body.length > 0 && totalGeneral) {
        body.push(['', '', 'TOTAL', `Q ${totalGeneral}`]);
    }

    doc.autoTable({
        startY: y + 6,
        head: head,
        body: body,
        styles: { fontSize: 11, cellPadding: 2 },
        headStyles: { fillColor: [36, 144, 232], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fillColor: [240, 245, 255] }
    });

    doc.save('resumen_productos.pdf');
});
// Carga clientes al iniciar la página
document.addEventListener('DOMContentLoaded', cargarClientes);


// === GRADOS ===
const gradoSelect = document.getElementById('grado-select');

// Traer grados del backend y llenar el combo
function cargarGrados() {
    fetch('/api/grados')
        .then(res => res.json())
        .then(grados => {
            gradoSelect.innerHTML = '<option value="">Seleccione un grado...</option>';
            grados.forEach(grado => {
                const option = document.createElement('option');
                option.value = grado.id;
                option.textContent = grado.nombre;
                gradoSelect.appendChild(option);
            });
        });
}

// Carga grados al iniciar la página
document.addEventListener('DOMContentLoaded', cargarGrados);


// --- TOTALIZAR PRODUCTO (SUMAR CANTIDAD) ---
const modalTotalizar = new bootstrap.Modal(document.getElementById('modalTotalizarProducto'));
const formTotalizar = document.getElementById('formTotalizarProducto');
const selectProductoExistente = document.getElementById('producto-existente');
const inputCantidadSuma = document.getElementById('cantidad-suma');

// Llenar el combobox con los productos actuales
function llenarComboProductos() {
    selectProductoExistente.innerHTML = '<option value="">Seleccione un producto...</option>';
    productos.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.id;
        option.textContent = prod.descripcion;
        selectProductoExistente.appendChild(option);
    });
}

// Cuando se abre el modal, recarga el combobox
document.getElementById('modalTotalizarProducto').addEventListener('show.bs.modal', llenarComboProductos);

// Al enviar el formulario de totalizar producto
formTotalizar.addEventListener('submit', function(e) {
    e.preventDefault();
    const prodId = parseInt(selectProductoExistente.value);
    const cantidadSumar = parseInt(inputCantidadSuma.value);

    if (!prodId || !cantidadSumar || cantidadSumar <= 0) {
        alert("Debe seleccionar producto y una cantidad válida.");
        return;
    }

    // Buscar producto actual y sumar cantidad (en frontend)
    let producto = productos.find(p => p.id === prodId);
    if (!producto) {
        alert("Producto no encontrado.");
        return;
    }

    // Sumatoria: si cantidad es null o NaN, toma 0
    let nuevaCantidad = (parseInt(producto.cantidad) || 0) + cantidadSumar;

    // --- ACTUALIZA EN BACKEND ---
    fetch(`/api/productos/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cantidad: nuevaCantidad,
            descripcion: producto.descripcion,
            precio_unitario: producto.precio_unitario
        })
    })
    .then(res => res.json())
    .then(resp => {
        if (resp && (resp.success || resp.mensaje === "Producto actualizado")) {
            modalTotalizar.hide();
            cargarProductosDelModulo();
            // Limpiar formulario
            formTotalizar.reset();
        } else {
            alert('No se pudo actualizar la cantidad.');
        }
    })
    .catch(() => alert('Error de conexión al actualizar cantidad.'));
});
