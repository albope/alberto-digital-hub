document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATA: Proyectos con Categorías y Tags
    // Categorias: 'dev' (Desarrollo), 'data' (Data/IA), 'mix' (Ambos/Otros)
    const projects = [
        {
            title: "Padel App",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            url: "https://padel-app-96e21.web.app/",
            desc: "Web app para registrar resultados y torneos.",
            category: "dev",
            tags: ["React", "Firebase", "PWA"],
            isNew: false
        },
        {
            title: "Reportes Jira EID",
            icon: "fa-brands fa-jira",
            url: "https://reportes-jira-eid.vercel.app/",
            desc: "Generador de reportes estructurados Markdown/Word.",
            category: "dev",
            tags: ["JS", "Automation", "Tool"],
            isNew: false
        },
        {
            title: "Validador CSV",
            icon: "fa-solid fa-file-csv",
            url: "https://github.com/albope/validador-csv-python/releases",
            desc: "App de escritorio Python para limpiar datos.",
            category: "data",
            tags: ["Python", "Tkinter", "Pandas"],
            isNew: true
        },
        {
            title: "Travel Map",
            icon: "fa-solid fa-map-location-dot",
            url: "https://travel-map-ten.vercel.app/",
            desc: "Visualización interactiva de países visitados.",
            category: "dev",
            tags: ["Leaflet.js", "GeoJSON", "Vercel"],
            isNew: false
        },
        {
            title: "Newsletter IA",
            icon: "fa-solid fa-newspaper",
            url: "https://www.linkedin.com/newsletters/ia-adaptarse-o-quedarse-atr%C3%A1s-7301236162151567362/",
            desc: "Análisis bisemanal sobre impacto de la IA.",
            category: "data",
            tags: ["AI Trends", "LinkedIn", "Writing"],
            isNew: false
        },
        {
            title: "Perfil Profesional",
            icon: "fa-solid fa-user-tie",
            url: "https://albope.github.io/perfil-profesional/",
            desc: "CV digital interactivo y trayectoria.",
            category: "profile",
            tags: ["HTML/CSS", "Design"],
            isNew: false
        },
        {
            title: "Portfolio",
            icon: "fa-solid fa-briefcase",
            url: "https://albertobort.vercel.app/",
            desc: "Landing page principal de servicios.",
            category: "profile",
            tags: ["Portfolio", "UX/UI"],
            isNew: false
        },
        {
            title: "Próximamente",
            icon: "fa-solid fa-lock",
            url: "#",
            desc: "Nuevo proyecto en desarrollo...",
            category: "mix",
            tags: ["WIP"],
            isLocked: true
        }
    ];

    const grid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 2. FUNCIÓN DE RENDERIZADO
    function renderProjects(filter = 'all') {
        // Limpiar grid actual
        grid.innerHTML = '';
        
        // Filtrar datos
        const filteredProjects = projects.filter(proj => {
            if (filter === 'all') return true;
            return proj.category === filter;
        });

        // Crear Tarjetas
        filteredProjects.forEach((proj, index) => {
            const card = document.createElement('a');
            
            if (!proj.isLocked) {
                card.href = proj.url;
                card.target = "_blank";
                card.className = "card";
            } else {
                card.className = "card locked";
            }

            // Stagger animation (Retraso en cascada)
            card.style.animationDelay = `${index * 0.1}s`;

            // Generar HTML de tags
            const tagsHtml = proj.tags ? 
                proj.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('') : '';

            card.innerHTML = `
                <div class="card-content">
                    <div class="card-top">
                        <div class="card-icon"><i class="${proj.icon}"></i></div>
                        ${proj.isNew ? '<span class="badge-new">NEW</span>' : ''}
                    </div>
                    <h3>${proj.title}</h3>
                    <p>${proj.desc}</p>
                    
                    <div class="card-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;

            // Efecto Spotlight (Mouse)
            if (window.matchMedia("(hover: hover)").matches && !proj.isLocked) {
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
    }

    // 3. LISTENERS DE FILTROS
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar clase active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Poner al actual
            btn.classList.add('active');
            
            // Renderizar con el filtro seleccionado
            renderProjects(btn.dataset.filter);
        });
    });

    // 4. INICIALIZAR (Render inicial + Tema)
    renderProjects('all');
    
    // --- LÓGICA DE TEMA (IGUAL QUE ANTES) ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
});