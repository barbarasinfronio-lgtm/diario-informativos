/**
 * Estuda Mana - Header Component
 * Versao Otimizada e Segura
 */
(function (window, document) {
    'use strict';

    const EstudaManaHeader = {
        STORAGE_KEY: 'estudamana_user',

        escapeHTML: function (str) {
            if (!str || typeof str !== 'string') return '';
            return str.replace(/[&<>'"]/g, function (tag) {
                const charsToReplace = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                };
                return charsToReplace[tag] || tag;
            });
        },

        getUserSession: function () {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                console.warn('[EstudaMana] Erro ao carregar dados de usuario:', e);
                return null;
            }
        },

        setUserSession: function (userData) {
            try {
                if (!userData) {
                    localStorage.removeItem(this.STORAGE_KEY);
                } else {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
                }
                this.render();
            } catch (e) {
                console.error('[EstudaMana] Erro ao salvar dados no localStorage:', e);
            }
        },

        logout: function () {
            this.setUserSession(null);
            window.location.reload();
        },

        render: function () {
            const container = document.getElementById('estudamana-header-container');
            if (!container) return;

            const user = this.getUserSession();
            const safeName = user && user.name ? this.escapeHTML(user.name) : 'Estudante';
            const safePhoto = user && user.photoURL ? encodeURI(user.photoURL) : '';

            let userAreaHtml = '';

            if (user) {
                userAreaHtml = `
                    <div class="em-user-profile">
                        ${safePhoto ? `<img src="${safePhoto}" alt="${safeName}" class="em-avatar" />` : `<span class="em-avatar-placeholder">${safeName.charAt(0).toUpperCase()}</span>`}
                        <span class="em-user-name">${safeName}</span>
                        <button type="button" class="em-btn em-btn-logout" id="em-btn-logout">Sair</button>
                    </div>
                `;
            } else {
                userAreaHtml = `
                    <div class="em-auth-actions">
                        <button type="button" class="em-btn em-btn-login" id="em-btn-login">Entrar</button>
                    </div>
                `;
            }

            container.innerHTML = `
                <header class="em-header-root">
                    <div class="em-header-inner">
                        <div class="em-brand">
                            <a href="/" class="em-logo-link">
                                <span class="em-logo-title">Estuda Mana</span>
                            </a>
                        </div>
                        <nav class="em-nav-menu" id="em-nav-menu" aria-label="Navegação Principal">
                            <ul class="em-nav-list">
                                <li><a href="/p/diario.html" class="em-nav-item">Diário</a></li>
                                <li><a href="/p/informativos.html" class="em-nav-item">Informativos</a></li>
                                <li><a href="/p/sumulas.html" class="em-nav-item">Súmulas</a></li>
                                <li><a href="/p/leis.html" class="em-nav-item">Legislação</a></li>
                                <li><a href="/p/editais.html" class="em-nav-item">Editais</a></li>
                                <li><a href="/p/grupos.html" class="em-nav-item">Grupos</a></li>
                            </ul>
                        </nav>
                        <div class="em-header-right">
                            ${userAreaHtml}
                            <button class="em-burger-btn" id="em-burger-btn" aria-label="Alternar Menu" aria-expanded="false">
                                <span class="em-burger-line"></span>
                                <span class="em-burger-line"></span>
                                <span class="em-burger-line"></span>
                            </button>
                        </div>
                    </div>
                </header>
            `;

            this.bindEvents(container);
        },

        bindEvents: function (container) {
            const logoutBtn = container.querySelector('#em-btn-logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }

            const loginBtn = container.querySelector('#em-btn-login');
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof window.abrirModalLogin === 'function') {
                        window.abrirModalLogin();
                    } else {
                        window.location.href = '/p/login.html';
                    }
                });
            }

            const burgerBtn = container.querySelector('#em-burger-btn');
            const navMenu = container.querySelector('#em-nav-menu');
            if (burgerBtn && navMenu) {
                burgerBtn.addEventListener('click', () => {
                    const isExpanded = burgerBtn.getAttribute('aria-expanded') === 'true';
                    burgerBtn.setAttribute('aria-expanded', String(!isExpanded));
                    navMenu.classList.toggle('em-menu-open');
                });
            }
        },

        init: function () {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.render());
            } else {
                this.render();
            }
        }
    };

    window.EstudaManaHeader = EstudaManaHeader;
    EstudaManaHeader.init();
})(window, document);
