// DOM Elements
const mainContent = document.getElementById('main-content');
const loader = document.getElementById('loader');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const homeLink = document.getElementById('home-link');
const scheduleLink = document.getElementById('schedule-link');

// Modal Elements
const modal = document.getElementById('show-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

// Base URLs
const API_BASE_URL = 'https://api.tvmaze.com';

// State
let currentView = 'home';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadHome();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Nav links
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(homeLink);
        loadHome();
    });

    scheduleLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(scheduleLink);
        loadSchedule();
    });

    // Search
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            removeActiveLinks();
            searchShows(query);
        }
    });

    // Modal close
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

function setActiveLink(activeElement) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (activeElement) activeElement.classList.add('active');
}

function removeActiveLinks() {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
}

// Helpers for UI
function showLoader() {
    loader.classList.remove('hidden');
    mainContent.innerHTML = '';
}

function hideLoader() {
    loader.classList.add('hidden');
}

function renderError(message) {
    mainContent.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <h2 style="color: #e50914;">¡Ups! Algo salió mal.</h2>
            <p>${message}</p>
        </div>
    `;
}

// Llamadas a la API
async function loadHome() {
    showLoader();
    try {
        const response = await axios.get(`${API_BASE_URL}/shows`);
        // Obtener solo las primeras 24 series para que cargue rápido
        const shows = response.data.slice(0, 24);
        
        mainContent.innerHTML = `
            <div style="grid-column: 1 / -1;">
                <h2 class="section-title">Series Populares</h2>
            </div>
        `;
        
        shows.forEach(show => {
            renderShowCard(show);
        });
    } catch (error) {
        console.error('Error fetching shows:', error);
        renderError('No pudimos cargar las series. Intenta nuevamente.');
    } finally {
        hideLoader();
    }
}

async function searchShows(query) {
    showLoader();
    try {
        const response = await axios.get(`${API_BASE_URL}/search/shows?q=${query}`);
        const results = response.data;
        
        mainContent.innerHTML = `
            <div style="grid-column: 1 / -1;">
                <h2 class="section-title">Resultados de: "${query}"</h2>
            </div>
        `;
        
        if (results.length === 0) {
            mainContent.innerHTML += `<p style="grid-column: 1/-1;">No se encontraron resultados.</p>`;
            return;
        }

        results.forEach(item => {
            renderShowCard(item.show);
        });
    } catch (error) {
        console.error('Error searching shows:', error);
        renderError('Ocurrió un error en la búsqueda.');
    } finally {
        hideLoader();
    }
}

async function loadSchedule() {
    showLoader();
    try {
        // Usando la API de schedule que es un endpoint diferente
        const response = await axios.get(`${API_BASE_URL}/schedule?country=US`);
        const schedule = response.data.slice(0, 24); // Limitamos a 24
        
        mainContent.innerHTML = `
            <div style="grid-column: 1 / -1;">
                <h2 class="section-title">Programación de Hoy (US)</h2>
            </div>
        `;
        
        if (schedule.length === 0) {
            mainContent.innerHTML += `<p style="grid-column: 1/-1;">No hay programación disponible.</p>`;
            return;
        }

        schedule.forEach(item => {
            // El endpoint schedule devuelve objeto de episodio que contiene .show
            renderShowCard(item.show, item.airtime);
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        renderError('No pudimos cargar la programación.');
    } finally {
        hideLoader();
    }
}

async function getShowDetails(id) {
    modal.classList.remove('hidden');

    modalBody.insertAdjacentHTML =('beforebegin',`
        <div style="display:flex; justify-content:center; padding: 50px;">
            <div class="spinner"></div>
        </div>
    `);
    
    try {
        // Obtenemos los detalles de la serie
        const response = await axios.get(`${API_BASE_URL}/shows/${id}`);
        const show = response.data;
        
        const image = show.image ? show.image.original : 'https://via.placeholder.com/400x600?text=No+Image';
        const rating = show.rating.average ? show.rating.average : 'N/A';
        const summary = show.summary ? show.summary : '<p>No hay resumen disponible.</p>';
        const genres = show.genres.map(g => `<span>${g}</span>`).join('');
        
        modalBody.innerHTML = `
            <div class="modal-body-content">
                <div class="modal-img">
                    <img src="${image}" alt="${show.name}">
                </div>
                <div class="modal-details">
                    <h2>${show.name}</h2>
                    <div class="genres">
                        ${genres}
                    </div>
                    <div class="summary">
                        ${summary}
                    </div>
                    <div class="meta-info">
                        <p><strong>Estreno:</strong> ${show.premiered || 'Desconocido'}</p>
                        <p><strong>Estado:</strong> ${show.status}</p>
                        <p><strong>Rating:</strong> ⭐ ${rating}</p>
                        <p><strong>Canal/Red:</strong> ${show.network ? show.network.name : (show.webChannel ? show.webChannel.name : 'Desconocido')}</p>
                    </div>
                    <div style="margin-top: 20px;">
                        <a href="${show.officialSite || show.url}" target="_blank" style="display:inline-block; padding: 10px 20px; background: #e50914; border-radius: 8px; font-weight: bold;">Ver Oficial</a>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching show details:', error);
        modalBody.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h3>Error al cargar los detalles.</h3>
            </div>
        `;
    }
}

// Rendering Component
function renderShowCard(show, extraInfo = '') {
    const card = document.createElement('div');
    card.className = 'show-card';
    
    //Verifico que exista imagen si no renderizo la parte de la api asiganada a que no tenga
    const image = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
    
    //Verificar que mi item tenga el rating si no , no mostrar nada
    const rating = show.rating && show.rating.average ? show.rating.average : '';

    const ratingHtml = rating ? `<div class="rating">⭐ ${rating}</div>` : '';
    
    let extraHtml = '';
    if (extraInfo) {
        extraHtml = `<p style="color: #e50914; font-weight: bold;">Hora: ${extraInfo}</p>`;
    }

    card.innerHTML = `
        <div class="show-img">
            <img src="${image}" alt="${show.name}" loading="lazy">
            ${ratingHtml}
        </div>
        <div class="show-info">
            <h3>${show.name}</h3>
            ${extraHtml}
            <p>${show.genres.slice(0, 4).join(', ')}</p>
        </div>
    `;
    
    card.addEventListener('click', () => getShowDetails(show.id));
    
    mainContent.appendChild(card);
}
