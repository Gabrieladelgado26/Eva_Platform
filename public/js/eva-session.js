/**
 * eva-session.js
 * Persiste ova_id y course_id en sessionStorage
 * y envía resultados de evaluación al servidor.
 *
 * Límite: máximo 3 intentos por evaluación / estudiante.
 * Al guardar exitosamente → recarga la página (preserva sesión).
 * Al alcanzar el límite → muestra card de bloqueo, sin recargar.
 */
(function () {

    // ── Leer params de URL y guardar en sessionStorage ────────────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const ovaId     = urlParams.get('ova_id');
    const courseId  = urlParams.get('course_id');

    if (ovaId)    sessionStorage.setItem('eva_ova_id',    ovaId);
    if (courseId) sessionStorage.setItem('eva_course_id', courseId);

    // ── Animaciones y estilos globales ────────────────────────────────────────
    const KEYFRAMES = `
        @keyframes evaBackdropIn {
            from { opacity: 0; }
            to   { opacity: 1; }
        }
        @keyframes evaBackdropOut {
            from { opacity: 1; }
            to   { opacity: 0; }
        }
        @keyframes evaCardIn {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes evaCardOut {
            from { opacity: 1; transform: scale(1) translateY(0); }
            to   { opacity: 0; transform: scale(0.95) translateY(10px); }
        }
        @keyframes evaProgressBar {
            from { width: 100%; }
            to   { width: 0%; }
        }
    `;

    if (!document.getElementById('eva-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'eva-toast-styles';
        style.textContent = KEYFRAMES;
        document.head.appendChild(style);
    }

    // ── Helpers de diseño ─────────────────────────────────────────────────────
    const FONT_TITLE = "'Chewy', cursive";
    const FONT_TEXT = "'Nunito', sans-serif";
    
    // Estilo único morado/rosado para todos los modales
    const GRADIENT = 'linear-gradient(135deg, #540D6E, #EE4266)';

    // ── Mensaje según el porcentaje ───────────────────────────────────────────
    function getMotivationalMessage(pct) {
        if (pct >= 90) return '¡Excelente trabajo! Sigue así';
        if (pct >= 80) return 'Muy bien, vas por buen camino';
        if (pct >= 70) return 'Bien, puedes mejorar aún más';
        if (pct >= 60) return 'Has aprobado, pero sigue practicando';
        return 'No te desanimes, ¡inténtalo de nuevo!';
    }

    // ── Tarjeta de resultado exitoso ──────────────────────────────────────────
    function buildSuccessCard(extra, ms) {
        const pct = extra.percentage;
        const score = extra.score;
        const total = extra.total;
        const att = extra.attempt;
        const left = extra.attemptsLeft;
        const max = extra.maxAttempts;
        const last = extra.isLastAttempt;
        const mensaje = getMotivationalMessage(pct);

        const attemptsBlock = last
            ? `<div style="background: rgba(84, 13, 110, 0.1); border-radius: 16px; padding: 14px 18px; text-align: center;">
                <span style="font-family: ${FONT_TEXT}; font-size: 15px; color: #540D6E; font-weight: 600;">No quedan más intentos disponibles</span>
               </div>`
            : `<div style="display: flex; align-items: center; justify-content: space-between; background: rgba(84, 13, 110, 0.08); border-radius: 16px; padding: 14px 18px;">
                <span style="font-family: ${FONT_TEXT}; font-size: 15px; color: #540D6E; font-weight: 600;">Intentos restantes</span>
                <span style="font-family: ${FONT_TITLE}; font-size: 24px; color: #540D6E;">${left}<span style="font-size: 16px;">/${max}</span></span>
               </div>`;

        return `
        <div style="
            background: white;
            border-radius: 51px;
            width: 100%;
            max-width: 420px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: evaCardIn 0.4s ease;
        ">
            <div style="height: 8px; background: ${GRADIENT};"></div>
            <div style="padding: 32px 28px;">
                <div style="text-align: center;">
                    <div style="font-family: ${FONT_TITLE}; font-size: 28px; color: #540D6E; margin-bottom: 26px;">Resultado obtenido</div>
                    
                    <div style="font-family: ${FONT_TITLE}; font-size: 80px; color: #540D6E; margin-bottom: 16px;">
                        ${score}<span style="font-size: 36px; color: #9CA3AF;">/${total}</span>
                    </div>
                    
                    <div style="font-family: ${FONT_TEXT}; font-size: 18px; color: #EE4266; font-weight: 600; margin-bottom: 8px;">
                        Intento ${att}: ${pct}%
                    </div>
                    
                    <div style="font-family: ${FONT_TEXT}; font-size: 15px; color: #6B7280; margin-bottom: 24px;">
                        ${mensaje}
                    </div>
                </div>
                <div style="margin-bottom: 24px;">${attemptsBlock}</div>
                ${ms > 0 ? `
                <div style="margin-bottom: 20px;">
                    <div style="height: 4px; background: #F0EEF4; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: 100%; background: ${GRADIENT}; animation: evaProgressBar ${ms/1000}s linear forwards;"></div>
                    </div>
                </div>` : ''}
                <button class="eva-continue-btn" style="
                    width: 100%;
                    padding: 16px;
                    background: ${GRADIENT};
                    border: none;
                    border-radius: 51px;
                    font-family: ${FONT_TITLE};
                    font-size: 20px;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    Continuar
                </button>
            </div>
        </div>`;
    }

    // ── Tarjeta de límite de intentos ─────────────────────────────────────────
    function buildBlockedCard(extra, ms) {
        const max = extra.maxAttempts || 3;
        const score = extra.score;
        const total = extra.total;

        return `
        <div style="
            background: white;
            border-radius: 51px;
            width: 100%;
            max-width: 400px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: evaCardIn 0.4s ease;
        ">
            <div style="height: 8px; background: ${GRADIENT};"></div>
            <div style="padding: 32px 28px; text-align: center;">
                <div style="width: 80px; height: 80px; background: ${GRADIENT}; border-radius: 40px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                    <span style="font-family: ${FONT_TITLE}; font-size: 36px; color: white;">!</span>
                </div>
                <div style="font-family: ${FONT_TITLE}; font-size: 26px; color: #540D6E; margin-bottom: 16px;">Límite alcanzado</div>
                <div style="font-family: ${FONT_TEXT}; font-size: 15px; color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                    Has completado los <strong>${max} intentos</strong> disponibles.
                </div>
                <div style="background: rgba(84, 13, 110, 0.08); border-radius: 16px; padding: 14px; margin-bottom: 20px;">
                    <span style="font-family: ${FONT_TEXT}; font-size: 14px; color: #540D6E;">La calificación obtenida (${score}/${total}) no será guardada</span>
                </div>
                <div style="background: rgba(84, 13, 110, 0.06); border-radius: 16px; padding: 12px; margin-bottom: 24px;">
                    <span style="font-family: ${FONT_TEXT}; font-size: 13px; color: #6B7280;">Consulta con tu docente para más información</span>
                </div>
                ${ms > 0 ? `
                <div style="margin-bottom: 20px;">
                    <div style="height: 4px; background: #F0EEF4; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: 100%; background: ${GRADIENT}; animation: evaProgressBar ${ms/1000}s linear forwards;"></div>
                    </div>
                </div>` : ''}
                <button class="eva-continue-btn" style="
                    width: 100%;
                    padding: 16px;
                    background: ${GRADIENT};
                    border: none;
                    border-radius: 51px;
                    font-family: ${FONT_TITLE};
                    font-size: 20px;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                    Entendido
                </button>
            </div>
        </div>`;
    }

    // ── Tarjeta genérica para errores ─────────────────────────────────────────
    function buildSimpleCard(type, title, lines, ms) {
        const palettes = {
            error: { gradient: GRADIENT, icon: '!' },
            warning: { gradient: GRADIENT, icon: '!' },
            info: { gradient: GRADIENT, icon: 'i' }
        };
        const p = palettes[type] || palettes.info;

        return `
        <div style="
            background: white;
            border-radius: 51px;
            width: 100%;
            max-width: 380px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: evaCardIn 0.4s ease;
        ">
            <div style="height: 8px; background: ${p.gradient};"></div>
            <div style="padding: 28px 24px;">
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                    <div style="width: 52px; height: 52px; background: ${p.gradient}; border-radius: 26px; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="font-family: ${FONT_TITLE}; font-size: 28px; color: white;">${p.icon}</span>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-family: ${FONT_TITLE}; font-size: 20px; color: #1F1A2E;">${title}</div>
                    </div>
                    <button class="eva-close-btn" style="background: none; border: none; font-family: ${FONT_TITLE}; font-size: 28px; color: #9CA3AF; cursor: pointer;">×</button>
                </div>
                <div style="font-family: ${FONT_TEXT}; font-size: 15px; color: #6B7280; line-height: 1.6; margin-bottom: 20px;">
                    ${lines.map(l => `<div style="margin-bottom: 8px;">${l}</div>`).join('')}
                </div>
                ${ms > 0 ? `
                <div style="margin-bottom: 16px;">
                    <div style="height: 4px; background: #F0EEF4; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: 100%; background: ${p.gradient}; animation: evaProgressBar ${ms/1000}s linear forwards;"></div>
                    </div>
                </div>` : ''}
            </div>
        </div>`;
    }

    // ── Mostrar modal (sin fondo) ─────────────────────────────────────────────
    function showToast(type, title, lines, duration, extra) {
        const prev = document.getElementById('eva-toast');
        if (prev) prev.remove();

        const ms = (duration === undefined) ? 5000 : duration;

        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';

        // Overlay transparente
        const overlay = document.createElement('div');
        overlay.id = 'eva-toast';
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            background: transparent !important;
            animation: evaBackdropIn 0.3s ease !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        `;

        // Seleccionar card según tipo
        if (type === 'success' && extra && extra.percentage !== undefined) {
            overlay.innerHTML = buildSuccessCard(extra, ms);
        } else if (type === 'blocked' && extra) {
            overlay.innerHTML = buildBlockedCard(extra, ms);
        } else {
            overlay.innerHTML = buildSimpleCard(type, title, lines, ms);
        }

        // Cerrar al hacer click en el fondo
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) dismissToast(overlay);
        });

        // Botón cerrar
        const closeBtn = overlay.querySelector('.eva-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', function () { dismissToast(overlay); });

        // Botón continuar
        const contBtn = overlay.querySelector('.eva-continue-btn');
        if (contBtn) {
            contBtn.addEventListener('click', function () {
                dismissToast(overlay);
            });
        }

        document.body.appendChild(overlay);

        // Auto-cerrar
        if (ms > 0) {
            setTimeout(function () { dismissToast(overlay); }, ms);
        }
    }

    function dismissToast(el) {
        if (!el || !el.parentNode) return;

        // Restaurar scroll del body
        document.body.style.overflow = '';

        el.style.animation = 'evaBackdropOut 0.25s ease forwards';
        const card = el.firstElementChild;
        if (card) card.style.animation = 'evaCardOut 0.25s ease forwards';
        setTimeout(function () { if (el.parentNode) el.remove(); }, 250);
    }

    // ── Objeto global EVA ─────────────────────────────────────────────────────
    window.EVA = {
        ovaId: sessionStorage.getItem('eva_ova_id') || null,
        courseId: sessionStorage.getItem('eva_course_id') || null,

        getCsrfToken: function () {
            const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
            if (match) {
                try { return decodeURIComponent(match[1]); }
                catch { return match[1]; }
            }
            return '';
        },

        getEvaluationKey: function () {
            const parts = window.location.pathname.split('/').filter(Boolean);
            const idx = parts.findIndex(p => p === 'evaluemos');
            if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
            return parts[parts.length - 2] || 'evaluacion';
        },

        _isSending: false,

        sendResult: function (score, total) {
            const self = this;

            if (self._isSending) {
                console.log('[EVA] Envio en curso, ignorando solicitud duplicada');
                return;
            }

            const payload = {
                evaluation_key: this.getEvaluationKey(),
                score: parseInt(score, 10),
                total: parseInt(total, 10),
                ova_id: this.ovaId ? parseInt(this.ovaId, 10) : null,
                course_id: this.courseId ? parseInt(this.courseId, 10) : null,
            };

            console.log('[EVA] Enviando resultado:', payload);

            self._isSending = true;

            fetch('/api/evaluations', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': this.getCsrfToken(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(function (response) {
                    return response.json().then(function (data) {
                        return { ok: response.ok, status: response.status, data };
                    });
                })
                .then(function ({ ok, status, data }) {
                    self._isSending = false;

                    if (status === 403 && data.limit_reached) {
                        console.warn('[EVA] Limite de intentos alcanzado:', data);
                        showToast('blocked', '', [], 6000, {
                            maxAttempts: data.max_attempts,
                            score: payload.score,
                            total: payload.total,
                        });
                        return;
                    }

                    if (ok && data.success) {
                        const ev = data.evaluation;
                        console.log('[EVA] Evaluacion guardada:', ev);
                        showToast('success', '', [], 6000, {
                            score: ev.score,
                            total: ev.total,
                            percentage: ev.percentage,
                            attempt: ev.attempt,
                            attemptsLeft: data.attempts_left,
                            maxAttempts: data.max_attempts,
                            isLastAttempt: data.is_last_attempt,
                        });
                        return;
                    }

                    const msg = data.message || `Error ${status}`;
                    console.warn('[EVA] No se pudo guardar:', msg, data);
                    showToast('error', 'Error al guardar', [msg, 'Verifique su conexion e intente nuevamente.'], 6000);
                })
                .catch(function (err) {
                    console.error('[EVA] Error de red:', err);
                    self._isSending = false;
                    showToast('error', 'Error de conexion', ['No se pudo contactar el servidor.', 'Verifique su conexion a internet.'], 6000);
                });
        },

        autoDetect: function () {
            const self = this;

            document.addEventListener('DOMContentLoaded', function () {
                const buenas = document.getElementById('buenas');
                if (!buenas) return;

                const observer = new MutationObserver(function () {
                    const tabResultados = document.getElementById('tabresultados');
                    if (!tabResultados) return;
                    const isVisible = tabResultados.style.display !== 'none' && tabResultados.offsetParent !== null;
                    if (isVisible && buenas.value !== '') {
                        const score = parseInt(buenas.value, 10);
                        if (!isNaN(score)) {
                            self.sendResult(score, 5);
                        }
                    }
                });

                observer.observe(buenas, { attributes: true, attributeFilter: ['value'] });

                if (typeof window.retroalimentacion === 'function') {
                    const originalRetro = window.retroalimentacion;
                    window.retroalimentacion = function () {
                        originalRetro.apply(this, arguments);
                        setTimeout(function () {
                            const tab = document.getElementById('tabresultados');
                            if (!tab) return;
                            const isVisible = tab.style.display !== 'none';
                            if (isVisible && buenas.value !== '') {
                                self.sendResult(parseInt(buenas.value, 10), 5);
                            }
                        }, 300);
                    };
                }
            });
        },
    };

    if (window.location.pathname.includes('evaluemos')) {
        window.EVA.autoDetect();
    }

})();