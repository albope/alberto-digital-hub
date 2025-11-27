document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DATOS DE TUS PROYECTOS ---
    const projects = [
        {
            title: "Padel App",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            url: "https://padel-app-96e21.web.app/",
            desc: "Web app para registrar resultados y torneos de pádel.",
            isNew: false
        },
        {
            title: "Travel Map",
            icon: "fa-solid fa-map-location-dot",
            url: "https://travel-map-ten.vercel.app/",
            desc: "Visualización interactiva de países visitados.",
            isNew: false
        },
        {
            title: "Perfil Profesional",
            icon: "fa-solid fa-user-tie",
            url: "https://albope.github.io/perfil-profesional/",
            desc: "CV digital interactivo y trayectoria.",
            isNew: false
        },
        {
            title: "Portfolio",
            icon: "fa-solid fa-briefcase",
            url: "https://albertobort.vercel.app/",
            desc: "Landing page principal de servicios y trabajos.",
            isNew: false
        },
        {
            title: "Validador CSV",
            icon: "fa-solid fa-file-csv",
            url: "https://github.com/albope/validador-csv-python/releases",
            desc: "Herramienta Python de escritorio para limpiar datos.",
            isNew: true
        },
        {
            title: "Newsletter IA",
            icon: "fa-solid fa-newspaper",
            url: "https://www.linkedin.com/newsletters/ia-adaptarse-o-quedarse-atr%C3%A1s-7301236162151567362/",
            desc: "Análisis bisemanal sobre el impacto de la IA.",
            isNew: false
        },
        {
            title: "Próximamente",
            icon: "fa-solid fa-lock",
            url: "#",
            desc: "Nuevo proyecto en desarrollo...",
            isLocked: true
        }
    ];

    // --- 2. RENDERIZADO (Generar HTML) ---
    const grid = document.getElementById('projects-grid');

    projects.forEach(proj => {
        const card = document.createElement('a');
        
        // Si está bloqueado, no ponemos href
        if (!proj.isLocked) {
            card.href = proj.url;
            card.target = "_blank";
            card.className = "card";
        } else {
            card.className = "card locked";
        }

        card.innerHTML = `
            <div class="card-content">
                <div class="card-top">
                    <div class="card-icon"><i class="${proj.icon}"></i></div>
                    ${proj.isNew ? '<span class="badge-new">NEW</span>' : ''}
                    ${!proj.isLocked ? '<i class="fa-solid fa-arrow-up-right-from-square card-arrow"></i>' : ''}
                </div>
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
            </div>
        `;

        // Evento Spotlight (Solo si no es móvil para rendimiento)
        if (window.matchMedia("(hover: hover)").matches) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        }

        grid.appendChild(card);
    });

    // --- 3. LÓGICA DE TEMA (DARK / LIGHT) ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Función para aplicar tema
    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Comprobar preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    // Evento Click
    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    console.log("Sistema cargado: 100%");
});