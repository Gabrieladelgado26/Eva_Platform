// Datos embebidos - sin llamadas a servidor externo
var datosPreguntas = [
    {
        desc_pregunta: "¿Quién es el protagonista de un cuento?",
        respuestas: [
            { desc_respuesta: "El lugar donde ocurre.", esCorrecta: 0 },
            { desc_respuesta: "El personaje principal de la historia.", esCorrecta: 1 },
            { desc_respuesta: "El problema del cuento.", esCorrecta: 0 },
            { desc_respuesta: "El autor del cuento.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! El protagonista es el personaje principal de la historia, aquel alrededor del cual gira toda la trama.",
        retro_incorrecta: "Recuerda que el protagonista es el personaje principal de la historia, no el lugar donde ocurre ni el problema del cuento."
    },
    {
        desc_pregunta: "¿Qué diferencia hay entre un cuento y una fábula?",
        respuestas: [
            { desc_respuesta: "No hay diferencia.", esCorrecta: 0 },
            { desc_respuesta: "La fábula siempre deja una enseñanza o moraleja.", esCorrecta: 1 },
            { desc_respuesta: "El cuento es más largo.", esCorrecta: 0 },
            { desc_respuesta: "La fábula no tiene personajes.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! La fábula siempre deja una enseñanza o moraleja al final, mientras que el cuento no necesariamente tiene ese propósito.",
        retro_incorrecta: "La diferencia más importante es que la fábula siempre termina con una enseñanza llamada moraleja. Ambos tienen personajes y pueden ser cortos o largos."
    },
    {
        desc_pregunta: "¿Qué tipos de cuentos conoces?",
        respuestas: [
            { desc_respuesta: "Solo cuentos tristes.", esCorrecta: 0 },
            { desc_respuesta: "Cuentos de hadas, aventuras, terror, ciencia ficción.", esCorrecta: 1 },
            { desc_respuesta: "Solo cuentos de animales.", esCorrecta: 0 },
            { desc_respuesta: "Solo cuentos largos.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Excelente! Existen muchos tipos de cuentos: de hadas, de aventuras, de terror, de ciencia ficción, entre otros.",
        retro_incorrecta: "Los cuentos son muy variados: existen cuentos de hadas, de aventuras, de terror, de ciencia ficción, de animales y muchos más."
    },
    {
        desc_pregunta: "¿Qué es un cuento?",
        respuestas: [
            { desc_respuesta: "Solo un dibujo.", esCorrecta: 0 },
            { desc_respuesta: "Una narración corta con personajes y una historia.", esCorrecta: 1 },
            { desc_respuesta: "Solo una canción.", esCorrecta: 0 },
            { desc_respuesta: "Solo números.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! Un cuento es una narración corta que tiene personajes y cuenta una historia con inicio, desarrollo y final.",
        retro_incorrecta: "Un cuento es una narración corta con personajes y una historia. No es solo un dibujo, una canción ni números."
    },
    {
        desc_pregunta: "¿Cuáles son las partes principales de un cuento?",
        respuestas: [
            { desc_respuesta: "Solo el final.", esCorrecta: 0 },
            { desc_respuesta: "Inicio, desarrollo y final.", esCorrecta: 1 },
            { desc_respuesta: "Solo el inicio.", esCorrecta: 0 },
            { desc_respuesta: "Solo los personajes.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! Las partes principales de un cuento son: inicio, desarrollo y final.",
        retro_incorrecta: "Un cuento tiene tres partes: inicio, desarrollo y final. El inicio presenta a los personajes, el desarrollo muestra el conflicto y el final resuelve la historia."
    },
    {
        desc_pregunta: "¿Qué elemento NO pertenece a un cuento?",
        respuestas: [
            { desc_respuesta: "Los personajes.", esCorrecta: 0 },
            { desc_respuesta: "El argumento.", esCorrecta: 0 },
            { desc_respuesta: "Las tablas de multiplicar.", esCorrecta: 1 },
            { desc_respuesta: "El narrador.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! Las tablas de multiplicar pertenecen a las matemáticas, no a los elementos de un cuento.",
        retro_incorrecta: "Recuerda que un cuento está formado por personajes, narrador, argumento y ambiente. Las tablas de multiplicar son matemáticas."
    },
    {
        desc_pregunta: "¿Quién cuenta la historia en un cuento?",
        respuestas: [
            { desc_respuesta: "El lector.", esCorrecta: 0 },
            { desc_respuesta: "El protagonista siempre.", esCorrecta: 0 },
            { desc_respuesta: "El narrador.", esCorrecta: 1 },
            { desc_respuesta: "El antagonista.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! El narrador es quien cuenta la historia. Puede ser un personaje de la historia o una voz externa.",
        retro_incorrecta: "El encargado de contar la historia es el narrador. Puede ser uno de los personajes o puede ser externo a la historia."
    },
    {
        desc_pregunta: "¿Cómo se llama el personaje que se opone al protagonista?",
        respuestas: [
            { desc_respuesta: "El narrador.", esCorrecta: 0 },
            { desc_respuesta: "El antagonista.", esCorrecta: 1 },
            { desc_respuesta: "El autor.", esCorrecta: 0 },
            { desc_respuesta: "El lector.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! El antagonista es el personaje que se opone al protagonista en la historia.",
        retro_incorrecta: "El personaje que se opone al protagonista se llama antagonista. No lo confundas con el narrador (quien cuenta la historia)."
    },
    {
        desc_pregunta: "¿En qué parte del cuento se presenta el conflicto principal?",
        respuestas: [
            { desc_respuesta: "En el inicio.", esCorrecta: 0 },
            { desc_respuesta: "En el final.", esCorrecta: 0 },
            { desc_respuesta: "Fuera del cuento.", esCorrecta: 0 },
            { desc_respuesta: "En el desarrollo o nudo.", esCorrecta: 1 }
        ],
        retro_correcta: "¡Excelente! El conflicto o problema principal se presenta en el desarrollo, también llamado nudo.",
        retro_incorrecta: "El conflicto se desarrolla en la parte central del cuento, llamada desarrollo o nudo. El inicio presenta los personajes y el final resuelve el problema."
    },
    {
        desc_pregunta: "¿Qué característica tiene el cuento como texto literario?",
        respuestas: [
            { desc_respuesta: "Es muy largo y sin personajes.", esCorrecta: 0 },
            { desc_respuesta: "Es una narración breve con pocos personajes y una trama sencilla.", esCorrecta: 1 },
            { desc_respuesta: "Solo habla de animales reales.", esCorrecta: 0 },
            { desc_respuesta: "Siempre termina en tragedia.", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! El cuento se caracteriza por ser una narración breve, con pocos personajes y una trama sencilla y concisa.",
        retro_incorrecta: "El cuento se caracteriza por ser breve, con pocos personajes y trama sencilla. No se limita a animales y puede tener distintos finales."
    }
];

// Las preguntas ocupan tab3..tab7 (tab0=intro, tab1=dp00, tab2=dp01)
var TAB_OFFSET = 3;

var resLetras = ['A.', 'B.', 'C.', 'D.'];
var prueba1=0, prueba2=0, prueba3=0, prueba4=0, prueba5=0;
var totalBuenas=0, totalMalas=0, marco=0, pre=0, primera=0, retro=0, inicial=0;
var anterior='', desordenadas=[];
var selectedQuestions = [];

$(document).ready(function() {
    desordenar();
});

function desordenar() {
    var indices = [];
    for (var i = 0; i < datosPreguntas.length; i++) { indices.push(i); }
    indices = shuffleArr(indices);
    selectedQuestions = indices.slice(0, 5);
    desordenadas = shuffleArr([1,2,3,4,5]); // orden aleatorio de las 5 preguntas
    cargarPreguntas();
    asignarTabs();
}

function shuffleArr(array) {
    var arr = array.slice();
    var i = arr.length;
    while (i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
}

function cargarPreguntas() {
    for (var q = 0; q < 5; q++) {
        var pregIdx = selectedQuestions[q];
        var pregData = datosPreguntas[pregIdx];
        var pregNum = q + 1; // 1..5

        var parrafoEl = document.getElementById('parrafo' + pregNum);
        if (parrafoEl) parrafoEl.innerHTML = pregData.desc_pregunta;

        for (var r = 0; r < 4; r++) {
            var resEl = document.getElementById('res' + r + '_' + pregNum);
            if (resEl) {
                resEl.innerHTML = '<div class="letras">' + resLetras[r] + '</div>' + pregData.respuestas[r].desc_respuesta;
                (function(pn, rn, correcto) {
                    resEl.onclick = function() { validar(pn, rn, correcto); };
                })(pregNum, r, pregData.respuestas[r].esCorrecta);
            }
        }

        var imgEl = document.getElementById('imagen' + pregNum);
        if (imgEl) {
            var imgNum = pregIdx % 10;
            imgEl.innerHTML = '<img class="pregunta" src="img/' + imgNum + '.png"/>';
        }
    }
}

function asignarTabs() {
    $("#tab0").attr('style', 'display:table');
    $("#tab1,#tab2,#tab3,#tab4,#tab5,#tab6,#tab7,#tabinicioretro,#tabretro1,#tabresultados").attr('style', 'display:none');
}

/*INICIO CAPTURA PANTALLA*/
$(document).ready(resizeContent);
$(window).resize(resizeContent);
function resizeContent() {
    var res = $(window).width() / 750;
    if ($(window).width() <= 750) {
        $("body").css({'zoom': res});
    }
}
/*FIN CAPTURA PANTALLA*/

// Navegación de las diapositivas introductorias
function cambiar0() {
    $("#tab0").attr("style", 'display:none');
    $("#tab1").attr("style", 'display:table');
}
function cambiar1() {
    $("#tab1").attr("style", 'display:none');
    $("#tab2").attr("style", 'display:table');
}
function cambiar2() {
    // Al terminar las diapositivas, mostrar la primera pregunta
    $("#tab2").attr("style", 'display:none');
    $("#tab" + (desordenadas[pre] + TAB_OFFSET - 1)).attr("style", 'display:table');
    primera = 1; // marcar que ya arrancaron las preguntas
}

function validar(pregNum, clase, esCorrecta) {
    $(".opcion" + anterior).removeAttr("style");
    anterior = clase;
    var val = (esCorrecta == 1) ? 1 : 0;
    if (pregNum == 1) prueba1 = val;
    else if (pregNum == 2) prueba2 = val;
    else if (pregNum == 3) prueba3 = val;
    else if (pregNum == 4) prueba4 = val;
    else if (pregNum == 5) prueba5 = val;
    $(".opcion" + clase).attr("style", "color: #FFF; background: #29B6F6;");
    marco = 1;
}

function siguiente() {
    if (marco == 1) {
        $(".opcion" + anterior).removeAttr("style");
        anterior = '';
        var tabActual = desordenadas[pre] + TAB_OFFSET - 1;
        if (pre == 4) {
            $("#tab" + tabActual).attr('style', 'display:none');
            $("#tabinicioretro").attr('style', 'display:table');
        } else {
            $("#tab" + tabActual).attr('style', 'display:none');
            pre++;
            $("#tab" + (desordenadas[pre] + TAB_OFFSET - 1)).attr('style', 'display:table');
        }
        marco = 0;
    } else {
        $(".divmarca").attr("style", 'display:table');
        setTimeout(function() { $(".divmarca").attr("style", 'display:none'); }, 1600);
    }
}

function retroalimentacion(tipo) {
    var respuestas = [prueba1, prueba2, prueba3, prueba4, prueba5];

    if (inicial == 0) {
        $("#tabinicioretro").attr('style', 'display:none');
        $("#tabretro1").attr('style', 'display:table');
        inicial = 1;
        mostrarRetro(retro, respuestas);
        return;
    }

    if (tipo == 'atras') {
        retro--;
        if (retro < 0) retro = 0;
    } else {
        retro++;
    }

    if (retro >= 5) {
        $("#tabretro1").attr('style', 'display:none');
        $("#tabresultados").attr('style', 'display:table');
        mostrar_resultado();
        return;
    }

    mostrarRetro(retro, respuestas);
}

function mostrarRetro(idx, respuestas) {
    var pregNum = desordenadas[idx];        // 1..5
    var tabIdx  = pregNum - 1;              // 0..4
    var pregIdx = selectedQuestions[tabIdx];
    var pregData = datosPreguntas[pregIdx];

    limpiar_retro("#m1", ".divtextoretro");
    limpiar_retro("#b1", ".divtextoretro");

    var imgNum = pregIdx % 10;
    var esBien = (respuestas[tabIdx] == 1);

    if (esBien) {
        $("#b1").attr("style", "display:table");
        $(".divtextoretro").append(
            '<div><img class="divimagenretro" src="img/' + imgNum + '.png"/>' +
            pregData.retro_correcta +
            ' <span class="correcto">¡Muy Bien!</span></div>' +
            '<span class="textopregretro"><img class="preguntaretro" src="img/pregunta.png"></span>' +
            '<div class="divpreguntaretro">' + pregData.desc_pregunta + '</div>'
        );
    } else {
        $("#m1").attr("style", "display:table");
        $(".divtextoretro").append(
            '<div><img class="divimagenretro" src="img/' + imgNum + '.png"/>' +
            pregData.retro_incorrecta +
            ' <span class="incorrecto">¡Incorrecto!</span></div>' +
            '<span class="textopregretro"><img class="preguntaretro" src="img/pregunta.png"></span>' +
            '<div class="divpreguntaretro">' + pregData.desc_pregunta + '</div>'
        );
    }

    if (retro == 0) {
        $("#atras").attr('style', 'display:none');
    } else {
        $("#atras").attr('style', 'display:table');
    }
}

function limpiar_retro(nombre1, nombre2) {
    $(nombre1).attr("style", "display:none");
    $(nombre2).html('');
}

function mostrar_resultado() {
    var respuestas = [prueba1, prueba2, prueba3, prueba4, prueba5];
    totalBuenas = 0; totalMalas = 0;
    $(".divgranderespuestas").html('');

    for (var i = 0; i < 5; i++) {
        var pregNum = desordenadas[i];
        var tabIdx  = pregNum - 1;
        var pregIdx = selectedQuestions[tabIdx];
        var pregData = datosPreguntas[pregIdx];

        $(".divgranderespuestas").append(
            '<div class="divrespuesta">' +
            '<div class="pre">' + (i + 1) + '. ' + pregData.desc_pregunta + '</div>' +
            '<div id="imgRespuestas' + (i + 1) + '" class="divimagenrespuesta"></div>' +
            '</div>'
        );

        if (respuestas[tabIdx] == 1) {
            $("#imgRespuestas" + (i + 1)).append('<img src="img/correcto.png">');
            totalBuenas++;
        } else {
            $("#imgRespuestas" + (i + 1)).append('<img src="img/incorrecto.png">');
            totalMalas++;
        }
    }

    $(".resultado").html(totalBuenas + '/5');
    $("#buenas").val(totalBuenas);

    if (totalBuenas > 3) {
        $("#ganaste").attr("style", 'position: absolute; top: 1%; left: 15%; display: table; width: 12%;');
    } else {
        $("#perdiste").attr("style", 'position: absolute; top: 1%; left: 15%; display: table; width: 12%;');
    }
}

function recargar() {
    prueba1=0; prueba2=0; prueba3=0; prueba4=0; prueba5=0;
    totalBuenas=0; totalMalas=0; marco=0; pre=0; primera=0; retro=0; inicial=0;
    anterior=''; desordenadas=[];
    $(".divgranderespuestas").html('');
    $("#ganaste,#perdiste").attr("style", 'display:none');
    desordenar();
}
