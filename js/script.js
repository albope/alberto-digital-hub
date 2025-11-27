document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATA: Proyectos
    // Categorias: 'dev', 'data', 'profile', 'upcoming'
    const projects = [
        {
            title: "Padel App",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            url: "https://padel-app-96e21.web.app/",
            desc: "Web app para registrar resultados y torneos de pádel.",
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
            desc: "App de escritorio Python para limpiar y validar datos.",
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
            desc: "Análisis bisemanal sobre impacto y tendencias de la IA.",
            category: "data",
            tags: ["AI Trends", "LinkedIn", "Writing"],
            isNew: false
        },
        {
            title: "Perfil Profesional",
            icon: "fa-solid fa-user-tie",
            url: "https://albope.github.io/perfil-profesional/",
            desc: "CV digital interactivo y trayectoria profesional.",
            category: "profile",
            tags: ["HTML/CSS", "Design"],
            isNew: false
        },
        {
            title: "Portfolio",
            icon: "fa-solid fa-briefcase",
            url: "https://albertobort.vercel.app/",
            desc: "Landing page principal de servicios y proyectos.",
            category: "profile",
            tags: ["Portfolio", "UX/UI"],
            isNew: false
        },
        {
            title: "Próximamente",
            icon: "fa-solid fa-lock",
            url: "#",
            desc: "Nuevo proyecto en fase de desarrollo...",
            category: "upcoming", // Solo aparecerá en 'Todos'
            tags: ["WIP"],
            isLocked: true
        }
    ];

    const grid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 2. FUNCIÓN DE RENDERIZADO
    function renderProjects(filter = 'all') {
        grid.innerHTML = ''; // Limpiar
        
        const filteredProjects = projects.filter(proj => {
            if (filter === 'all') return true;
            // Si el proyecto es 'upcoming', solo sale en 'all', nunca en otros filtros
            if (proj.category === 'upcoming') return false; 
            
            return proj.category === filter;
        });

        filteredProjects.forEach((proj, index) => {
            const card = document.createElement('a');
            
            if (!proj.isLocked) {
                card.href = proj.url;
                card.target = "_blank";
                card.className = "card";
            } else {
                card.className = "card locked";
            }

            // Animación cascada
            card.style.animationDelay = `${index * 0.1}s`;

            const tagsHtml = proj.tags ? 
                proj.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('') : '';

            // HTML Interno (con .card-content para el 3D)
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

            // --- LÓGICA 3D TILT + SPOTLIGHT ---
            // Solo se activa en dispositivos con puntero (no móviles) y si no está bloqueada
            if (window.matchMedia("(hover: hover)").matches && !proj.isLocked) {
                
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Cálculo de inclinación 3D
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    // Ajusta el divisor (20) para más o menos efecto
                    const rotateX = ((y - centerY) / 20) * -1;
                    const rotateY = (x - centerX) / 20;

                    // Variables para spotlight y rotación
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                    
                    // Aplicar transformación
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });

                // Reset al salir (animación suave)
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                    card.style.transition = 'transform 0.5s ease';
                });

                // Quitar transición al entrar (respuesta rápida)
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'transform 0.1s ease';
                });
            }

            grid.appendChild(card);
        });
    }

    // 3. LISTENERS DE FILTROS
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });

    // 4. INICIALIZAR
    renderProjects('all');
    
    // 5. LÓGICA DE TEMA (DARK/LIGHT)
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

    // --- 6. GITHUB LIVE STATUS (API) ---
    async function checkGithubActivity() {
        const badge = document.getElementById('github-status');
        const tooltip = document.getElementById('status-tooltip');
        const username = 'albope'; // TU USUARIO DE GITHUB

        try {
            // Pedimos los últimos eventos públicos
            const response = await fetch(`https://api.github.com/users/${username}/events/public`);
            
            if (!response.ok) throw new Error('Error API');
            
            const events = await response.json();
            
            // Buscamos el último "PushEvent" (Commit)
            const pushEvent = events.find(event => event.type === 'PushEvent');

            if (pushEvent) {
                const lastCommitDate = new Date(pushEvent.created_at);
                const now = new Date();
                
                // Diferencia en horas
                const diffTime = Math.abs(now - lastCommitDate);
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

                const repoName = pushEvent.repo.name.replace(`${username}/`, '');

                // Si es menos de 24h -> ACTIVO
                if (diffHours < 24) {
                    badge.classList.add('active');
                    tooltip.innerHTML = `<span>🔥 Coding: hace ${diffHours}h en <strong>${repoName}</strong></span>`;
                } else {
                    badge.classList.remove('active');
                    // Calculamos días si pasó más de 24h
                    const days = Math.floor(diffHours / 24);
                    const timeString = days > 0 ? `${days} días` : `${diffHours} horas`;
                    tooltip.innerHTML = `<span>💤 Descansando (Último push: hace ${timeString})</span>`;
                }
            } else {
                tooltip.textContent = "Sin actividad reciente";
            }

        } catch (error) {
            console.error('GitHub API Error:', error);
            tooltip.textContent = "Status: Open to Work";
        }
    }

    checkGithubActivity();
    console.log("Hub Digital cargado | 3D Tilt & GitHub Status activos");
});