/**
 * eva-session.js
 * Persiste ova_id y course_id en sessionStorage
 * y envía resultados de evaluación al servidor.
 */
(function () {

    // ── Leer params de URL y guardar en sessionStorage ────────────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const ovaId     = urlParams.get('ova_id');
    const courseId  = urlParams.get('course_id');

    if (ovaId)    sessionStorage.setItem('eva_ova_id',    ovaId);
    if (courseId) sessionStorage.setItem('eva_course_id', courseId);

    // ── Estilos del toast ─────────────────────────────────────────────────────
    const TOAST_STYLES = {
        base: `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 99999;
            min-width: 300px;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 14px;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            animation: evaSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
            cursor: pointer;
        `,
        success: `
            background: linear-gradient(135deg, #0EAD69, #3BCEAC);
            color: white;
            border: 1.5px solid rgba(255,255,255,0.25);
        `,
        error: `
            background: linear-gradient(135deg, #EE4266, #c0304f);
            color: white;
            border: 1.5px solid rgba(255,255,255,0.25);
        `,
    };

    const KEYFRAMES = `
        @keyframes evaSlideIn {
            from { opacity: 0; transform: translateY(30px) scale(0.92); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes evaSlideOut {
            from { opacity: 1; transform: translateY(0)   scale(1);    }
            to   { opacity: 0; transform: translateY(20px) scale(0.92); }
        }
    `;

    // Inyectar keyframes una sola vez
    if (!document.getElementById('eva-toast-styles')) {
        const style  = document.createElement('style');
        style.id     = 'eva-toast-styles';
        style.textContent = KEYFRAMES;
        document.head.appendChild(style);
    }

    // ── Mostrar toast ─────────────────────────────────────────────────────────
    function showToast(type, title, lines) {
        // Eliminar toast previo si existe
        const prev = document.getElementById('eva-toast');
        if (prev) prev.remove();

        const icon    = type === 'success' ? '✅' : '❌';
        const typeStyle = type === 'success' ? TOAST_STYLES.success : TOAST_STYLES.error;

        const toast   = document.createElement('div');
        toast.id      = 'eva-toast';
        toast.style.cssText = TOAST_STYLES.base + typeStyle;

        toast.innerHTML = `
            <div style="font-size:22px;line-height:1;flex-shrink:0">${icon}</div>
            <div style="flex:1">
                <div style="font-weight:700;font-size:15px;margin-bottom:4px">${title}</div>
                ${lines.map(l => `<div style="opacity:0.92;font-size:13px;line-height:1.5">${l}</div>`).join('')}
                <div style="margin-top:8px;font-size:11px;opacity:0.7">Click para cerrar</div>
            </div>
        `;

        // Cerrar al hacer click
        toast.addEventListener('click', () => dismissToast(toast));

        document.body.appendChild(toast);

        // Auto-cerrar después de 6 segundos
        setTimeout(() => dismissToast(toast), 6000);
    }

    function dismissToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.style.animation = 'evaSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }

    // ── Objeto global EVA ─────────────────────────────────────────────────────
    window.EVA = {
        ovaId:    sessionStorage.getItem('eva_ova_id')    || null,
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
            const idx   = parts.findIndex(p => p === 'evaluemos');
            if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
            return parts[parts.length - 2] || 'evaluacion';
        },

        sendResult: function (score, total) {
            const self    = this;
            const payload = {
                evaluation_key: this.getEvaluationKey(),
                score:          parseInt(score,  10),
                total:          parseInt(total,  10),
                ova_id:         this.ovaId    ? parseInt(this.ovaId,    10) : null,
                course_id:      this.courseId ? parseInt(this.courseId, 10) : null,
            };

            console.log('[EVA] 📤 Enviando resultado:', payload);

            fetch('/api/evaluations', {
                method:      'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': this.getCsrfToken(),
                    'Accept':       'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(function (response) {
                return response.json().then(function (data) {
                    return { ok: response.ok, status: response.status, data };
                });
            })
            .then(function ({ ok, status, data }) {
                if (ok && data.success) {
                    const ev   = data.evaluation;
                    const pct  = ev.percentage;
                    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';

                    // ── Consola ──
                    console.log('[EVA] ✅ Evaluación guardada:', ev);
                    console.table({
                        'Evaluación':  ev.evaluation_key,
                        'Puntaje':     `${ev.score} / ${ev.total}`,
                        'Porcentaje':  `${ev.percentage}%`,
                        'Intento #':   ev.attempt,
                        'ID':          ev.id,
                    });

                    // ── Toast visual ──
                    showToast('success', `${emoji} ¡Evaluación guardada!`, [
                        `<b>Puntaje:</b> ${ev.score} de ${ev.total} correctas`,
                        `<b>Calificación:</b> ${ev.percentage}%`,
                        `<b>Intento:</b> #${ev.attempt}`,
                    ]);

                } else {
                    const msg = data.message || `Error ${status}`;
                    console.warn('[EVA] ⚠️ No se pudo guardar:', msg, data);

                    showToast('error', '⚠️ No se pudo guardar', [
                        msg,
                        'Verifica tu conexión e inténtalo de nuevo.',
                    ]);
                }
            })
            .catch(function (err) {
                console.error('[EVA] ❌ Error de red:', err);

                showToast('error', '❌ Error de conexión', [
                    'No se pudo contactar el servidor.',
                    'Verifica tu conexión a internet.',
                ]);
            });
        },

        autoDetect: function () {
            const self = this;

            document.addEventListener('DOMContentLoaded', function () {
                const buenas = document.getElementById('buenas');
                if (!buenas) return;

                let sent = false;

                // Observar cambios en value del input #buenas
                const observer = new MutationObserver(function () {
                    if (sent) return;
                    const tabResultados = document.getElementById('tabresultados');
                    if (!tabResultados) return;
                    const isVisible = tabResultados.style.display !== 'none'
                        && tabResultados.offsetParent !== null;
                    if (isVisible && buenas.value !== '') {
                        const score = parseInt(buenas.value, 10);
                        if (!isNaN(score)) {
                            sent = true;
                            observer.disconnect();
                            self.sendResult(score, 5);
                        }
                    }
                });

                observer.observe(buenas, {
                    attributes:      true,
                    attributeFilter: ['value'],
                });

                // Interceptar retroalimentacion() que muestra #tabresultados
                if (typeof window.retroalimentacion === 'function') {
                    const originalRetro = window.retroalimentacion;
                    window.retroalimentacion = function () {
                        originalRetro.apply(this, arguments);
                        setTimeout(function () {
                            const tab = document.getElementById('tabresultados');
                            if (!tab) return;
                            const isVisible = tab.style.display !== 'none';
                            if (isVisible && buenas.value !== '' && !sent) {
                                sent = true;
                                self.sendResult(parseInt(buenas.value, 10), 5);
                            }
                        }, 300);
                    };
                }
            });
        },
    };

    // ── Iniciar auto-detección en páginas de evaluación ───────────────────────
    if (window.location.pathname.includes('evaluemos')) {
        window.EVA.autoDetect();
    }

})();