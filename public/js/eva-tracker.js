/**
 * eva-tracker.js
 * Se incluye en cada HTML de evaluación OVA.
 * Envía el resultado al servidor cuando el estudiante termina.
 */

(function () {
    // ── Leer XSRF-TOKEN de la cookie ──────────────────────────────────────────
    function getCsrfToken() {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        if (match) {
            try { return decodeURIComponent(match[1]); } catch { return match[1]; }
        }
        return '';
    }

    // ── Leer parámetros de la URL del iframe o página ──────────────────────────
    function getUrlParam(name) {
        const url  = new URL(window.location.href);
        return url.searchParams.get(name) || '';
    }

    // ── Inferir evaluation_key desde la URL ───────────────────────────────────
    function getEvaluationKey() {
        // Toma el nombre de la carpeta: /ovas/.../evaluemos/adicionysuspropiedades/...
        const parts = window.location.pathname.split('/').filter(Boolean);
        // Buscar el índice de "evaluemos" y tomar el siguiente segmento
        const idx = parts.findIndex(p => p === 'evaluemos');
        if (idx !== -1 && parts[idx + 1]) {
            return parts[idx + 1];
        }
        // Fallback: último segmento antes del archivo
        return parts[parts.length - 2] || 'unknown';
    }

    // ── Enviar resultado al servidor ──────────────────────────────────────────
    window.sendEvaluationResult = function (score, total) {
        const evaluationKey = getEvaluationKey();
        const ovaId         = getUrlParam('ova_id')    || null;
        const courseId      = getUrlParam('course_id') || null;

        const payload = {
            evaluation_key: evaluationKey,
            score:          parseInt(score, 10),
            total:          parseInt(total, 10),
            ova_id:         ovaId   ? parseInt(ovaId, 10)   : null,
            course_id:      courseId ? parseInt(courseId, 10) : null,
        };

        fetch('/api/evaluations', {
            method:      'POST',
            credentials: 'same-origin',   // envía cookies de sesión
            headers: {
                'Content-Type':  'application/json',
                'X-XSRF-TOKEN':  getCsrfToken(),
                'Accept':        'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                console.log('[EVA] Evaluación guardada:', data.evaluation);
            } else {
                console.warn('[EVA] No se pudo guardar:', data.message);
            }
        })
        .catch(err => console.error('[EVA] Error de red:', err));
    };

    // ── Auto-detectar cuando el HTML muestra el resultado final ───────────────
    // Observa cambios en el elemento #buenas (donde aparece el puntaje)
    document.addEventListener('DOMContentLoaded', function () {
        const buenas = document.getElementById('buenas');
        if (!buenas) return;

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                const score = parseInt(buenas.value, 10);
                const total = 5; // todos los evaluemos tienen 5 preguntas
                if (!isNaN(score) && score >= 0) {
                    // Solo enviar cuando el tab de resultados sea visible
                    const tabResultados = document.getElementById('tabresultados');
                    if (tabResultados && tabResultados.style.display !== 'none') {
                        sendEvaluationResult(score, total);
                        observer.disconnect(); // evitar envíos duplicados
                    }
                }
            });
        });

        observer.observe(buenas, {
            attributes: true,
            attributeFilter: ['value'],
        });
    });

})();