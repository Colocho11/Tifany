// Selecciona todos los botones de menú
document.querySelectorAll('.menu-btn').forEach(btn => {
    // Animación al hacer click (onda de color y vibración)
    btn.addEventListener('click', function(e) {
        // Efecto "pulse"
        btn.animate([
            { transform: 'scale(1)', boxShadow: '0 2px 10px #1a236e10' },
            { transform: 'scale(1.08)', boxShadow: '0 10px 28px #f6be00cc' },
            { transform: 'scale(0.98)', boxShadow: '0 1px 2px #1a236e20' },
            { transform: 'scale(1)', boxShadow: '0 2px 10px #1a236e10' }
        ], {
            duration: 390,
            easing: 'cubic-bezier(.16,1.3,.56,1)'
        });
    });

    // Animación al entrar con mouse (leve brillo dorado)
    btn.addEventListener('mouseenter', function(e) {
        btn.animate([
            { boxShadow: '0 2px 10px #1a236e10' },
            { boxShadow: '0 8px 32px #f6be0075' }
        ], {
            duration: 320,
            fill: 'forwards'
        });
    });

    // Animación al salir con mouse (vuelve al estado base)
    btn.addEventListener('mouseleave', function(e) {
        btn.animate([
            { boxShadow: '0 8px 32px #f6be0075' },
            { boxShadow: '0 2px 10px #1a236e10' }
        ], {
            duration: 250,
            fill: 'forwards'
        });
    });
});

// Botón cerrar sesión animado (breve parpadeo rojo)
const logoutBtn = document.querySelector('.logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        logoutBtn.animate([
            { backgroundColor: '#e30423' },
            { backgroundColor: '#fff', color: '#e30423' },
            { backgroundColor: '#e30423', color: '#fff' }
        ], {
            duration: 400,
            easing: 'ease'
        });
        // Espera la animación y luego redirige
        setTimeout(() => {
            window.location.href = "login.html";
        }, 380);
    });
}
