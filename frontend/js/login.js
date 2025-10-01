document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ usuario, password })
    });

    if (res.ok) {
        // Ruta correcta a index.html dentro de /pages
        window.location.href = "/pages/index.html";
    } else {
        document.getElementById('loginError').classList.remove('d-none');
    }
});
