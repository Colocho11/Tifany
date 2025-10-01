const loginForm = document.getElementById('loginForm');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');

// Detecta si estamos en localhost o en Render
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://tifany.onrender.com/api';

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            // Redirigir al dashboard
            window.location.href = "/pages/index.html"; // Ajusta a tu dashboard
        } else {
            // Mostrar error
            loginError.classList.remove('d-none');
            loginError.textContent = data.error || 'Usuario o contraseña incorrectos';
        }

    } catch (err) {
        console.error('Error en login:', err);
        loginError.classList.remove('d-none');
        loginError.textContent = 'Error al conectar con el servidor';
    }
});
