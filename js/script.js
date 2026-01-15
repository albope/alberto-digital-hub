/**
 * mi-dashboard-personal
 * Hub Digital de Alberto Bort
 *
 * @author Alberto Bort
 * @version 2.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================
    // 1. UTILIDADES
    // =========================================

    /**
     * Throttle function para limitar la frecuencia de ejecucion
     * @param {Function} fn - Funcion a ejecutar
     * @param {number} delay - Delay en milisegundos
     * @returns {Function} - Funcion throttled
     */
    const throttle = (fn, delay) => {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                fn(...args);
            }
        };
    };

    /**
     * Escapa HTML para prevenir XSS (aunque usamos datos estaticos)
     * @param {string} str - String a escapar
     * @returns {string} - String escapado
     */
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // =========================================
    // 2. DATOS: PROYECTOS
    // =========================================

    const projects = [
        {
            title: 'Padel App',
            icon: 'fa-solid fa-table-tennis-paddle-ball',
            url: 'https://padel-app-96e21.web.app/',
            desc: 'Web app para registrar resultados y torneos de pádel.',
            category: 'dev',
            tags: ['React', 'Firebase', 'PWA'],
            isNew: false
        },
        {
            title: 'Reportes Jira EID',
            icon: 'fa-brands fa-jira',
            url: 'https://reportes-jira-eid.vercel.app/',
            desc: 'Generador de reportes estructurados Markdown/Word.',
            category: 'dev',
            tags: ['JS', 'Automation', 'Tool'],
            isNew: false
        },
        {
            title: 'Validador CSV',
            icon: 'fa-solid fa-file-csv',
            url: 'https://github.com/albope/validador-csv-python/releases',
            desc: 'App de escritorio Python para limpiar y validar datos.',
            category: 'data',
            tags: ['Python', 'Tkinter', 'Pandas'],
            isNew: true
        },
        {
            title: 'Travel Map',
            icon: 'fa-solid fa-map-location-dot',
            url: 'https://travel-map-ten.vercel.app/',
            desc: 'Visualización interactiva de países visitados.',
            category: 'dev',
            tags: ['Leaflet.js', 'GeoJSON', 'Vercel'],
            isNew: false
        },
        {
            title: 'Newsletter IA',
            icon: 'fa-solid fa-newspaper',
            url: 'https://www.linkedin.com/newsletters/ia-adaptarse-o-quedarse-atr%C3%A1s-7301236162151567362/',
            desc: 'Análisis bisemanal sobre impacto y tendencias de la IA.',
            category: 'data',
            tags: ['AI Trends', 'LinkedIn', 'Writing'],
            isNew: false
        },
        {
            title: 'Perfil Profesional',
            icon: 'fa-solid fa-user-tie',
            url: 'https://albope.github.io/perfil-profesional/',
            desc: 'CV digital interactivo y trayectoria profesional.',
            category: 'profile',
            tags: ['HTML/CSS', 'Design'],
            isNew: false
        },
        {
            title: 'Portfolio',
            icon: 'fa-solid fa-briefcase',
            url: 'https://albertobort.vercel.app/',
            desc: 'Landing page principal de servicios y proyectos.',
            category: 'profile',
            tags: ['Portfolio', 'UX/UI'],
            isNew: false
        },
        {
            title: 'Próximamente',
            icon: 'fa-solid fa-lock',
            url: '#',
            desc: 'Nuevo proyecto en fase de desarrollo...',
            category: 'upcoming',
            tags: ['WIP'],
            isLocked: true
        }
    ];

    // =========================================
    // 3. ELEMENTOS DEL DOM
    // =========================================

    const grid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Detectar si el dispositivo soporta hover (no moviles)
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    // =========================================
    // 4. RENDERIZADO DE PROYECTOS (Optimizado)
    // =========================================

    /**
     * Renderiza los proyectos filtrados usando DocumentFragment
     * para mejor performance
     * @param {string} filter - Categoria a filtrar
     */
    function renderProjects(filter = 'all') {
        // Usar DocumentFragment para batch DOM updates
        const fragment = document.createDocumentFragment();

        const filteredProjects = projects.filter(proj => {
            if (filter === 'all') return true;
            if (proj.category === 'upcoming') return false;
            return proj.category === filter;
        });

        filteredProjects.forEach((proj, index) => {
            const card = document.createElement('a');

            // Configurar atributos
            if (!proj.isLocked) {
                card.href = proj.url;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                card.className = 'card';
                card.setAttribute('role', 'listitem');
                card.setAttribute('aria-label', `${proj.title}: ${proj.desc}`);
            } else {
                card.className = 'card locked';
                card.setAttribute('role', 'listitem');
                card.setAttribute('aria-disabled', 'true');
                card.setAttribute('aria-label', `${proj.title}: Proyecto en desarrollo`);
            }

            // Animacion cascada
            card.style.animationDelay = `${index * 0.1}s`;

            // Generar tags HTML
            const tagsHtml = proj.tags
                ? proj.tags.map(tag => `<span class="tech-tag">${escapeHtml(tag)}</span>`).join('')
                : '';

            // HTML interno con estructura accesible
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-top">
                        <div class="card-icon" aria-hidden="true">
                            <i class="${proj.icon}"></i>
                        </div>
                        ${proj.isNew ? '<span class="badge-new" aria-label="Nuevo proyecto">NEW</span>' : ''}
                    </div>
                    <h3>${escapeHtml(proj.title)}</h3>
                    <p>${escapeHtml(proj.desc)}</p>
                    <div class="card-tags" aria-label="Tecnologías utilizadas">
                        ${tagsHtml}
                    </div>
                </div>
            `;

            fragment.appendChild(card);
        });

        // Limpiar y agregar todo de una vez
        grid.innerHTML = '';
        grid.appendChild(fragment);

        // Configurar efectos 3D despues de agregar al DOM
        if (supportsHover) {
            setupTiltEffects();
        }
    }

    // =========================================
    // 5. EFECTO 3D TILT (Event Delegation)
    // =========================================

    /**
     * Handler throttled para el efecto 3D tilt
     */
    const handleTiltMove = throttle((e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / 20) * -1;
        const rotateY = (x - centerX) / 20;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }, 16); // ~60fps

    /**
     * Configura los efectos 3D tilt usando event delegation
     */
    function setupTiltEffects() {
        // Event delegation en el grid
        grid.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.card:not(.locked)');
            if (card) {
                handleTiltMove(e, card);
            }
        });

        grid.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.card:not(.locked)');
            if (card) {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease';
            }
        }, true);

        grid.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.card:not(.locked)');
            if (card) {
                card.style.transition = 'transform 0.1s ease';
            }
        }, true);
    }

    // =========================================
    // 6. SISTEMA DE FILTROS
    // =========================================

    /**
     * Actualiza el estado aria-pressed de los botones de filtro
     * @param {HTMLElement} activeBtn - Boton activo
     */
    function updateFilterAriaStates(activeBtn) {
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-pressed', 'true');
    }

    // Event listeners para filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateFilterAriaStates(btn);
            renderProjects(btn.dataset.filter);
        });
    });

    // =========================================
    // 7. SISTEMA DE TEMAS
    // =========================================

    /**
     * Aplica un tema y lo guarda en localStorage
     * @param {string} theme - 'dark' o 'light'
     */
    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Actualizar meta theme-color para moviles
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#050508' : '#f0f4f8');
        }
    }

    // Cargar tema guardado o detectar preferencia del sistema
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    // Toggle de tema
    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Escuchar cambios en preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // =========================================
    // 8. GITHUB LIVE STATUS
    // =========================================

    /**
     * Obtiene y muestra el estado de actividad de GitHub
     */
    async function checkGithubActivity() {
        const badge = document.getElementById('github-status');
        const tooltip = document.getElementById('status-tooltip');
        const username = 'albope';

        try {
            const response = await fetch(
                `https://api.github.com/users/${username}/events/public`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const events = await response.json();
            const pushEvent = events.find(event => event.type === 'PushEvent');

            if (pushEvent) {
                const lastCommitDate = new Date(pushEvent.created_at);
                const now = new Date();
                const diffTime = Math.abs(now - lastCommitDate);
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                const repoName = pushEvent.repo.name.replace(`${username}/`, '');

                if (diffHours < 24) {
                    badge.classList.add('active');
                    tooltip.innerHTML = `<span>🔥 Coding: hace ${diffHours}h en <strong>${escapeHtml(repoName)}</strong></span>`;
                } else {
                    badge.classList.remove('active');
                    const days = Math.floor(diffHours / 24);
                    const timeString = days > 0 ? `${days} días` : `${diffHours} horas`;
                    tooltip.innerHTML = `<span>💤 Descansando (Último push: hace ${timeString})</span>`;
                }
            } else {
                tooltip.textContent = 'Sin actividad reciente';
            }
        } catch (error) {
            console.warn('GitHub API Error:', error.message);
            tooltip.textContent = 'Status: Open to Work';
        }
    }

    // =========================================
    // 9. GSAP ANIMATIONS
    // =========================================

    /**
     * Initialize GSAP animations for premium effects
     */
    function initGSAPAnimations() {
        // Check if GSAP loaded and reduced motion preference
        if (typeof gsap === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.registerPlugin(ScrollTrigger);

        // Set initial states for animation
        gsap.set('.avatar-wrapper', { scale: 0, opacity: 0 });
        gsap.set('.name', { y: 50, opacity: 0 });
        gsap.set('.role', { y: 30, opacity: 0, filter: 'blur(10px)' });
        gsap.set('.social-pills li', { y: 20, opacity: 0 });
        gsap.set('.filter-btn', { scale: 0.8, opacity: 0 });

        // Hero entrance timeline
        const heroTL = gsap.timeline({
            defaults: { ease: 'power3.out' },
            delay: 0.2
        });

        heroTL
            // Avatar reveal with elastic effect
            .to('.avatar-wrapper', {
                duration: 1,
                scale: 1,
                opacity: 1,
                ease: 'elastic.out(1, 0.5)'
            })
            // Name text reveal
            .to('.name', {
                duration: 0.8,
                y: 0,
                opacity: 1,
                ease: 'power4.out'
            }, '-=0.5')
            // Role reveal with blur
            .to('.role', {
                duration: 0.6,
                y: 0,
                opacity: 1,
                filter: 'blur(0px)'
            }, '-=0.4')
            // Social pills stagger
            .to('.social-pills li', {
                duration: 0.5,
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: 'back.out(2)'
            }, '-=0.3')
            // Filter buttons
            .to('.filter-btn', {
                duration: 0.4,
                scale: 1,
                opacity: 1,
                stagger: 0.08
            }, '-=0.2');

        // Footer fade in on scroll
        gsap.from('.footer', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%'
            },
            duration: 1,
            y: 30,
            opacity: 0
        });
    }

    /**
     * Setup micro-interactions with GSAP
     */
    function initMicroInteractions() {
        if (typeof gsap === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Social pills hover animation
        document.querySelectorAll('.social-pills a').forEach(pill => {
            pill.addEventListener('mouseenter', () => {
                gsap.to(pill, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: 'back.out(3)'
                });
            });
            pill.addEventListener('mouseleave', () => {
                gsap.to(pill, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Filter button click ripple effect
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                gsap.fromTo(btn,
                    { boxShadow: '0 0 0 0 var(--glow-cyan)' },
                    {
                        boxShadow: '0 0 0 15px rgba(0, 245, 255, 0)',
                        duration: 0.5,
                        ease: 'power2.out'
                    }
                );
            });
        });

        // Theme toggle spin animation
        themeBtn.addEventListener('click', () => {
            const iconContainer = themeBtn.querySelector('.icon-container');
            if (iconContainer) {
                gsap.to(iconContainer, {
                    rotation: '+=360',
                    duration: 0.6,
                    ease: 'power2.inOut'
                });
            }
        });
    }

    /**
     * Setup icon hover animations on cards
     */
    function setupIconAnimations() {
        if (typeof gsap === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        grid.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.card:not(.locked)');
            if (!card) return;

            const icon = card.querySelector('.card-icon i');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.2,
                    rotation: 10,
                    duration: 0.3,
                    ease: 'back.out(2)'
                });
            }
        }, true);

        grid.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.card:not(.locked)');
            if (!card) return;

            const icon = card.querySelector('.card-icon i');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        }, true);
    }

    /**
     * Animate cards entrance with GSAP
     */
    function animateCardsEntrance() {
        if (typeof gsap === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const cards = document.querySelectorAll('.card');

        // Remove CSS animation
        cards.forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '0';
        });

        gsap.to(cards, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: {
                amount: 0.6,
                from: 'start'
            },
            ease: 'power3.out',
            clearProps: 'all',
            onComplete: () => {
                // Ensure 3D tilt works after animation
                cards.forEach(card => {
                    card.style.opacity = '1';
                });
            }
        });

        gsap.from(cards, {
            duration: 0.8,
            y: 60,
            scale: 0.95,
            stagger: {
                amount: 0.6,
                from: 'start'
            },
            ease: 'power3.out'
        });
    }

    // =========================================
    // 10. INICIALIZACION
    // =========================================

    // Renderizar proyectos
    renderProjects('all');

    // Cargar estado de GitHub
    checkGithubActivity();

    // Set dynamic year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // =========================================
    // MATRIX TEXT EFFECT
    // =========================================
    function matrixTextEffect(element, finalText, onComplete) {
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>[]{}';
        const duration = 1500;
        const iterations = 15;
        let currentIteration = 0;

        element.textContent = '';

        const interval = setInterval(() => {
            let displayText = '';

            for (let i = 0; i < finalText.length; i++) {
                if (finalText[i] === ' ') {
                    displayText += ' ';
                } else {
                    const charProgress = (currentIteration / iterations) * finalText.length;
                    if (i < charProgress) {
                        displayText += finalText[i];
                    } else {
                        displayText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
            }

            element.textContent = displayText;
            currentIteration++;

            if (currentIteration >= iterations) {
                clearInterval(interval);
                element.textContent = finalText;
                element.classList.add('matrix-done');
                if (onComplete) onComplete();
            }
        }, duration / iterations);
    }

    // Store original texts
    const nameEl = document.querySelector('.name');
    const roleEl = document.querySelector('.role');
    const originalNameText = nameEl ? (nameEl.getAttribute('data-text') || nameEl.textContent) : '';
    const originalRoleText = roleEl ? roleEl.textContent : '';

    function runMatrixEffect() {
        if (nameEl) {
            nameEl.classList.remove('matrix-done');
            nameEl.textContent = '';

            setTimeout(() => {
                matrixTextEffect(nameEl, originalNameText, () => {
                    if (roleEl) {
                        roleEl.classList.remove('matrix-done');
                        roleEl.textContent = '';
                        setTimeout(() => {
                            matrixTextEffect(roleEl, originalRoleText);
                        }, 200);
                    }
                });
            }, 300);
        }
    }

    // Initialize Matrix effect immediately
    runMatrixEffect();

    // Repeat every 60 seconds
    setInterval(runMatrixEffect, 60000);

    // Initialize GSAP after a small delay to ensure DOM is ready
    setTimeout(() => {
        initGSAPAnimations();
        initMicroInteractions();
        setupIconAnimations();
        animateCardsEntrance();
    }, 100);

    // Log de debug (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🚀 Hub Digital v3.0.0 cargado | GSAP, 3D Tilt & GitHub Status activos');
    }
});
