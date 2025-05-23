document.addEventListener('DOMContentLoaded', () => {
    console.log("Hub Digital Cargado y Listo!");

    // 1. Funcionalidad: Cambio de Tema (Dark/Light Mode)
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('dark'); // Default
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // 2. Funcionalidad: Animación de Tarjetas al Cargar
    const cardsForAnimation = document.querySelectorAll('.card');
    cardsForAnimation.forEach((card) => {
        card.classList.add('animate-on-load');
    });

    // 3. Funcionalidad: Mostrar Tooltip de Descripción y Botón "Copiar Enlace"
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const copyButton = card.querySelector('.card-copy-link-button');
        const copyTooltip = card.querySelector('.card-copy-tooltip');
        const infoButton = card.querySelector('.card-info-button');
        const descriptionTooltip = card.querySelector('.card-description-tooltip');
        
        // Evento para el botón de copiar enlace
        if (copyButton && copyTooltip) {
            copyButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation(); // Evita que el clic se propague al <a>.card
                
                const urlToCopy = card.href; // El .card es el <a>, así que tiene .href

                if (!urlToCopy) {
                    console.error('No se pudo encontrar el enlace de la tarjeta.');
                    return;
                }

                navigator.clipboard.writeText(urlToCopy).then(() => {
                    copyTooltip.classList.add('visible');
                    setTimeout(() => {
                        copyTooltip.classList.remove('visible');
                    }, 1500);
                }).catch(err => {
                    console.error('Error al copiar enlace de la tarjeta: ', err);
                    copyTooltip.textContent = '¡Error!';
                    copyTooltip.classList.add('visible');
                    setTimeout(() => {
                        copyTooltip.classList.remove('visible');
                        copyTooltip.textContent = '¡Enlace copiado!';
                    }, 2000);
                });
            });
        }

        // Evento para el botón "Info" -> Mostrar/Ocultar Tooltip de Descripción
        if (infoButton && descriptionTooltip) {
            infoButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation(); // Evita que el clic se propague al <a>.card
                
                // Cerrar otros tooltips abiertos antes de abrir/cerrar el actual
                document.querySelectorAll('.card.is-description-tooltip-visible').forEach(openCard => {
                    if (openCard !== card) { // No cierres el que acabamos de clickear si se va a abrir
                        openCard.classList.remove('is-description-tooltip-visible');
                    }
                });
                
                // Alternar el tooltip actual
                card.classList.toggle('is-description-tooltip-visible');
            });
        }
    });

    // Opcional: Cerrar tooltip de descripción si se hace clic fuera de la tarjeta Y no en un botón de info
    document.addEventListener('click', function(event) {
        // Si el clic NO fue en un botón de info Y NO fue dentro de un tooltip de descripción visible
        if (!event.target.closest('.card-info-button') && !event.target.closest('.card-description-tooltip.visible')) {
            document.querySelectorAll('.card.is-description-tooltip-visible').forEach(openCardTooltip => {
                openCardTooltip.classList.remove('is-description-tooltip-visible');
            });
        }
    });
});