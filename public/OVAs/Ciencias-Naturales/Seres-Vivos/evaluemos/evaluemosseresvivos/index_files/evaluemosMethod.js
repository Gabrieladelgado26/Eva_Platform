var resLetras=['A.','B.','C.','D.'];

// ── Datos inline (reemplaza llamada AJAX al servidor) ─────────────────────────
var datosInline = [
    {
        desc_pregunta: "¿Qué reinos de seres vivos existen?",
        respuestas: [
            { desc_respuesta: "Solo animales y plantas", esCorrecta: 0 },
            { desc_respuesta: "Animales, plantas, hongos, protistas y moneras", esCorrecta: 1 },
            { desc_respuesta: "Solo animales y hongos", esCorrecta: 0 },
            { desc_respuesta: "Solo plantas y protistas", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! Los cinco reinos de la vida son: Animalia, Plantae, Fungi, Protista y Monera.",
        retro_incorrecta: "Los cinco reinos de los seres vivos son: Animalia, Plantae, Fungi, Protista y Monera."
    },
    {
        desc_pregunta: "¿Qué son los seres autótrofos?",
        respuestas: [
            { desc_respuesta: "Seres que comen otros seres vivos", esCorrecta: 0 },
            { desc_respuesta: "Seres que producen su propio alimento", esCorrecta: 1 },
            { desc_respuesta: "Seres que no comen", esCorrecta: 0 },
            { desc_respuesta: "Seres que solo beben agua", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! Los autótrofos, como las plantas, producen su alimento mediante la fotosíntesis.",
        retro_incorrecta: "Los autótrofos producen su propio alimento a partir de la luz solar, como hacen las plantas."
    },
    {
        desc_pregunta: "¿Qué son los organismos unicelulares?",
        respuestas: [
            { desc_respuesta: "Organismos formados por muchas células", esCorrecta: 0 },
            { desc_respuesta: "Organismos formados por una sola célula", esCorrecta: 1 },
            { desc_respuesta: "Organismos sin células", esCorrecta: 0 },
            { desc_respuesta: "Organismos que no se mueven", esCorrecta: 0 }
        ],
        retro_correcta: "¡Excelente! Los organismos unicelulares, como bacterias y amebas, tienen una única célula.",
        retro_incorrecta: "Los organismos unicelulares tienen una sola célula. Ejemplos: bacterias y protozoos."
    },
    {
        desc_pregunta: "¿Qué son los seres heterótrofos?",
        respuestas: [
            { desc_respuesta: "Seres que producen su propio alimento", esCorrecta: 0 },
            { desc_respuesta: "Seres que consumen otros organismos para alimentarse", esCorrecta: 1 },
            { desc_respuesta: "Seres que no comen", esCorrecta: 0 },
            { desc_respuesta: "Seres que solo beben agua", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! Los heterótrofos, como los animales y hongos, obtienen energía consumiendo otros organismos.",
        retro_incorrecta: "Los heterótrofos no producen su propio alimento; necesitan consumir otros organismos."
    },
    {
        desc_pregunta: "¿Qué son los virus?",
        respuestas: [
            { desc_respuesta: "Seres vivos completos", esCorrecta: 0 },
            { desc_respuesta: "Agentes infecciosos que necesitan un huésped para reproducirse", esCorrecta: 1 },
            { desc_respuesta: "Un tipo de planta", esCorrecta: 0 },
            { desc_respuesta: "Un tipo de bacteria", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! Los virus son agentes infecciosos que solo se reproducen dentro de células vivas.",
        retro_incorrecta: "Los virus no son seres vivos completos; necesitan infectar una célula huésped para reproducirse."
    }
];

$(document).ready(function(){
    cargar(datosInline);
});

var numeroPreg = 0;
var datos = '';
var lista = [0,1,2,3,4];
lista = lista.sort(function(){ return Math.random() - 0.5; });

function cargar(data) {
    if (numeroPreg <= 4) {
        $("#parrafo").append(data[lista[numeroPreg]].desc_pregunta);
        for (var i = 0; i <= 3; i++) {
            $("#res"+i).append('<div class="letras">'+resLetras[i]+'</div>'+data[lista[numeroPreg]].respuestas[i].desc_respuesta);
            $("#res"+i).attr('onclick','validar('+lista[numeroPreg]+','+i+','+data[lista[numeroPreg]].respuestas[i].esCorrecta+')');
        }
        $("#imagen").append('<img class="pregunta" src="img/'+lista[numeroPreg]+'.png"/>');
        numeroPreg++;
    } else {
        $("#tab1").attr("style",'display:none');
        $("#tabinicioretro").attr("style",'display:table');
    }
    datos = data;
}

$(document).ready(resizeContent);
$(window).resize(resizeContent);
function resizeContent() {
    var res = $(window).width() / (750 * 1);
    if ($(window).width() <= 750) { $("body").css({'zoom': res}); }
}

var totalBuenas=0, totalMalas=0;
var res_preguntas=[], respondio=[], resFinal=[], mis_respuestas=[];
var marco=0, anterior='';

function validar(pregunta, clase, id) {
    if (marco == 0) {
        $(".opcion"+anterior).removeAttr("style");
        anterior = clase;
        res_preguntas.push(pregunta);
        respondio.push(id);
        resFinal.push(clase);
        $(".opcion"+clase).attr("style","color: #FFF; background: #D32F2F;");
        marco = 1;
        mis_respuestas.push($(".opcion"+clase).text());
    } else {
        $(".opcion"+anterior).removeAttr("style");
        anterior = clase;
        res_preguntas.pop(); res_preguntas.push(pregunta);
        respondio.pop();    respondio.push(id);
        resFinal.pop();     resFinal.push(clase);
        $(".opcion"+clase).attr("style","color: #FFF; background: #D32F2F;");
        mis_respuestas.pop();
        mis_respuestas.push($(".opcion"+clase).text());
    }
}

function siguiente() {
    if (marco == 1) {
        $(".opcion"+anterior).removeAttr("style");
        $("#parrafo").html('');
        for (var i = 0; i <= 3; i++) { $("#res"+i).html(''); }
        $("#imagen").html('');
        anterior = '';
        cargar(datos);
        marco = 0;
    } else {
        $(".divmarca").attr("style",'display:table');
        setTimeout(function(){ $(".divmarca").attr("style",'display:none'); }, 1600);
    }
}

var inicial=0, clic=0;
function retroalimentacion(tipo) {
    if (clic == 0) {
        $("#tabinicioretro").attr('style','display:none');
        $("#tabretro1").attr('style','display:table');
        clic = 1;
    }
    if (tipo == 'atras') { inicial--; } else if (tipo == 'adelante') { inicial++; }
    if (inicial < 5) {
        if (inicial == 0) { $("#atras").attr('style','display:none'); }
        else              { $("#atras").attr('style','display:table'); }
        limpiar_retro("#m1", ".divtextoretro");
        limpiar_retro("#b1", ".divtextoretro");
        var estilo = "font-family: Chewy !important; font-size: 20px !important;";
        if (respondio[inicial] == 0) {
            $("#m1").attr("style","display:table");
            $(".divtextoretro").append(
                '<div id="mt1">'+
                    '<img class="imagenpregunta" src="img/'+res_preguntas[inicial]+'.png"/>'+
                    '<span class="textopregretro">PREGUNTA</span>'+
                    '<div class="divpreguntaretro">'+datos[res_preguntas[inicial]].desc_pregunta+'</div>'+
                    '<span>'+
                        '<div style="'+estilo+'">Tu respuesta fue:</div>'+mis_respuestas[inicial]+
                        '<div style="'+estilo+'">Retroalimentación:</div>'+datos[res_preguntas[inicial]].retro_incorrecta+
                    '</span>'+
                    '<span class="incorrecto">¡Incorrecto!</span>'+
                '</div>');
        } else {
            $("#b1").attr("style","display:table");
            $(".divtextoretro").append(
                '<img class="imagenpregunta" src="img/'+res_preguntas[inicial]+'.png"/>'+
                '<div id="bt1">'+
                    '<span class="textopregretro">PREGUNTA</span>'+
                    '<div class="divpreguntaretro">'+datos[res_preguntas[inicial]].desc_pregunta+'</div>'+
                    '<div style="'+estilo+'">Tu respuesta fue:</div>'+mis_respuestas[inicial]+
                    '<div style="'+estilo+'">Retroalimentación:</div>'+datos[res_preguntas[inicial]].retro_correcta+
                    '<span class="incorrecto">¡Muy bien!</span>'+
                '</div>');
        }
    } else {
        $("#tabretro1").attr("style",'display:none');
        $("#tabresultados").attr("style",'display:table');
        mostrar_resultado();
    }
}

function limpiar_retro(nombre1, nombre2) {
    $(nombre1).attr("style","display:none");
    $(nombre2).html('');
}

function mostrar_resultado() {
    for (var i = 0; i <= 4; i++) {
        $(".divgranderespuestas").append(
            '<div id="preguntas" class="divrespuesta">'+
                '<div class="pre">'+(i+1)+'. '+datos[res_preguntas[i]].desc_pregunta+
                '<br><b>Tu respuesta</b>: '+mis_respuestas[i]+
                '</div>'+
                '<div id="imgRespuestas'+(i+1)+'" class="divimagenrespuesta"></div>'+
            '</div>');
        if (respondio[i] == 0) {
            $("#imgRespuestas"+(i+1)).append('<img src="img/incorrecto.png">');
            totalMalas++;
        } else {
            $("#imgRespuestas"+(i+1)).append('<img src="img/correcto.png">');
            totalBuenas++;
        }
    }
    var _b = document.getElementById('buenas');
    if (_b) { _b.value = totalBuenas; }
    $(".resultado").html(totalBuenas+'/5');
    if (totalBuenas > 3) {
        $("#ganaste").attr("style",'position: absolute; top: 1%; left: 15%; display: table; width: 12%;');
    } else {
        $("#perdiste").attr("style",'position: absolute; top: 1%; left: 15%; display: table; width: 12%;');
    }
}

function recargar() {
    $("#tab0").attr("style",'display:table');
    $("#tabresultados").attr("style",'display:none');
    limpiarVariables();
    cargar(datos);
}

function limpiarVariables() {
    lista = lista.sort(function(){ return Math.random() - 0.5; });
    numeroPreg=0; clic=0; totalBuenas=0; totalMalas=0; marco=0; inicial=0;
    res_preguntas=[]; respondio=[]; mis_respuestas=[]; anterior='';
    $("#imgRespuestas").html('');
    $(".divgranderespuestas").html('');
    $("#ganaste").attr("style",'display:none');
    $("#perdiste").attr("style",'display:none');
}

function cambiar0() {
    $("#tab0").attr("style",'display:none');
    $("#tab1").attr("style",'display:table');
}
