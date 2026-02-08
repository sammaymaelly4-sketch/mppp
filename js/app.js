/**
 * Civic Auditor Lite - Core Application Logic
 * Optimized for performance and fluid transitions.
 */

class CivicAuditorApp {
    constructor() {
        this.apiUrl = '/api';
        this.cities = [];
        this.map = null;
        this.markers = {};

        // DOM Elements
        this.cityList = document.getElementById('cityList');
        this.cityCount = document.getElementById('cityCount');
        this.citySearch = document.getElementById('citySearch');
        this.terminalMsg = document.getElementById('terminalMsg');
        this.cityDetail = document.getElementById('cityDetail');

        this.init();
    }

    async init() {
        this.initMap();
        this.setupEventListeners();
        await this.loadData();
    }

    initMap() {
        // Taubaté as center
        const center = [-23.0204, -45.5540];
        this.map = L.map('map', {
            zoomControl: false,
            attributionControl: false
        }).setView(center, 9);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

        // Update terminal
        this.updateTerminal('MAP ENGINE INITIALIZED at 23.02S, 45.55W');
    }

    setupEventListeners() {
        this.citySearch.addEventListener('input', (e) => {
            this.filterCities(e.target.value);
        });

        // Close detail overlay on Esc
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideDetail();
        });
    }

    async loadData() {
        this.updateTerminal('FETCHING REGIONAL DATASET...');

        try {
            const response = await fetch(`${this.apiUrl}/cities`);
            this.cities = await response.json();

            this.updateTerminal(`DATASET LOADED: ${this.cities.length} NODES IDENTIFIED`);
            this.renderCityList(this.cities);
            this.addMapMarkers(this.cities);
        } catch (error) {
            console.error('Fetch error:', error);
            this.updateTerminal('CRITICAL ERROR: FAILED TO FETCH API DATA');
        }
    }

    renderCityList(cities) {
        this.cityList.innerHTML = '';
        this.cityCount.textContent = cities.length;

        cities.forEach((city, index) => {
            const item = document.createElement('div');
            item.className = 'city-item';
            item.innerHTML = `
                <div class="city-info">
                    <h3>${city.name.toUpperCase()}</h3>
                    <p>ID: ${city.id} | AUDIT: ${city.lastAudit}</p>
                </div>
                <div class="city-score">
                    <div class="score-value" style="color: ${this.getScoreColor(city.totalScore)}">${city.totalScore}</div>
                    <div class="score-rank">SCORE</div>
                </div>
            `;

            item.addEventListener('click', () => this.selectCity(city));
            this.cityList.appendChild(item);

            // Staggered appearance for fluidity
            setTimeout(() => {
                item.classList.add('revealed');
            }, index * 40);
        });
    }

    addMapMarkers(cities) {
        // Note: For actual location, we'd need coordinates in the data.
        // For this lite version, we simulate positions around the center for visual flow
        // unless we add them to engine.py
        cities.forEach(city => {
            // Mocking coords based on ID seed for consistent visual spread in MVP
            const seed = parseInt(city.id);
            const lat = -23.02 + (Math.sin(seed * 0.1) * 0.4);
            const lon = -45.55 + (Math.cos(seed * 0.1) * 0.4);

            const marker = L.circleMarker([lat, lon], {
                radius: 6,
                fillColor: this.getScoreColor(city.totalScore),
                color: "#141418",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);

            marker.on('click', () => this.selectCity(city));
            this.markers[city.slug] = marker;
        });
    }

    filterCities(query) {
        const normalizedQuery = query.toLowerCase();
        const filtered = this.cities.filter(c =>
            c.name.toLowerCase().includes(normalizedQuery) ||
            c.slug.includes(normalizedQuery)
        );

        this.renderCityList(filtered);
        this.updateTerminal(`SEARCH: ${filtered.length} RESULTS FOUND`);
    }

    selectCity(city) {
        this.updateTerminal(`SELECT NODE: ${city.name.toUpperCase()} | SCORE: ${city.totalScore}`);

        // Show detail overlay
        this.showDetail(city);

        // Highlight marker and zoom
        if (this.markers[city.slug]) {
            const marker = this.markers[city.slug];
            this.map.flyTo(marker.getLatLng(), 11, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }

    showDetail(city) {
        this.cityDetail.innerHTML = `
            <div class="detail-header">
                <h2>${city.name.toUpperCase()}</h2>
                <button class="close-btn" id="closeDetail">&times;</button>
            </div>
            <div class="detail-body">
                <div class="score-hero">
                    <div class="label" style="font-size: 10px; color: #888; margin-bottom: 8px;">COMPLIANCE SCORE</div>
                    <div class="large-score" style="color: ${this.getScoreColor(city.totalScore)}">${city.totalScore}</div>
                    <div class="status-tag" style="display: inline-block; margin-top: 10px; padding: 4px 12px; background: rgba(0,0,0,0.3); font-family:var(--font-mono); font-size: 10px; border: 1px solid ${this.getScoreColor(city.totalScore)}">
                        ${city.status.toUpperCase()}
                    </div>
                </div>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <span class="label">LEGAL</span>
                        <span class="value">${Math.floor(city.totalScore * 0.12)}/100</span>
                    </div>
                    <div class="metric-card">
                        <span class="label">FINANCE</span>
                        <span class="value">${Math.floor(city.totalScore * 0.15)}/150</span>
                    </div>
                    <div class="metric-card">
                        <span class="label">HEALTH</span>
                        <span class="value">${Math.floor(city.totalScore * 0.1)}/100</span>
                    </div>
                    <div class="metric-card">
                        <span class="label">EDU</span>
                        <span class="value">${Math.floor(city.totalScore * 0.14)}/150</span>
                    </div>
                </div>
                <div class="audit-info" style="margin-top:24px; padding-top:24px; border-top:1px solid #222;">
                    <p style="font-size:11px; color:#666; font-family:var(--font-mono);">LAST UPDATED: ${city.lastAudit}</p>
                    <p style="font-size:11px; color:#666; font-family:var(--font-mono);">DATA SOURCE: IBGE/TCESP PROXY</p>
                </div>
            </div>
        `;

        this.cityDetail.classList.remove('hidden');
        document.getElementById('closeDetail').addEventListener('click', () => this.hideDetail());
    }

    hideDetail() {
        this.cityDetail.classList.add('hidden');
    }

    getScoreColor(score) {
        if (score >= 800) return '#00ff9d'; // Success
        if (score >= 600) return '#ffcc00'; // Warning
        return '#ff4d4d'; // Danger
    }

    updateTerminal(msg) {
        this.terminalMsg.textContent = msg;
    }
}

// Start the app when HTML is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CivicAuditorApp();
});
