var resLetras=['A.','B.','C.','D.'];

var datosInline = [
    {
        desc_pregunta: "¿Qué es el camuflaje?",
        respuestas: [
            { desc_respuesta: "Un tipo de movimiento", esCorrecta: 0 },
            { desc_respuesta: "La capacidad de mezclarse con el entorno", esCorrecta: 1 },
            { desc_respuesta: "Un tipo de alimento", esCorrecta: 0 },
            { desc_respuesta: "Un tipo de respiración", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! El camuflaje permite a los animales ocultarse de depredadores mezclándose con su entorno.",
        retro_incorrecta: "El camuflaje es la capacidad de algunos animales de mezclarse con su entorno para ocultarse."
    },
    {
        desc_pregunta: "¿Por qué los camellos tienen jorobas?",
        respuestas: [
            { desc_respuesta: "Para almacenar agua", esCorrecta: 0 },
            { desc_respuesta: "Para almacenar grasa como reserva de energía", esCorrecta: 1 },
            { desc_respuesta: "Para verse más grandes", esCorrecta: 0 },
            { desc_respuesta: "Para protegerse del sol", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! Las jorobas almacenan grasa que se convierte en energía cuando el camello no tiene acceso a alimentos.",
        retro_incorrecta: "Las jorobas del camello almacenan grasa, no agua. Esa grasa es su reserva de energía en el desierto."
    },
    {
        desc_pregunta: "¿Qué son las adaptaciones de los seres vivos?",
        respuestas: [
            { desc_respuesta: "Solo su tamaño", esCorrecta: 0 },
            { desc_respuesta: "Características que les ayudan a sobrevivir en su entorno", esCorrecta: 1 },
            { desc_respuesta: "Solo su color", esCorrecta: 0 },
            { desc_respuesta: "Solo su movimiento", esCorrecta: 0 }
        ],
        retro_correcta: "¡Excelente! Las adaptaciones son cambios físicos o de comportamiento que mejoran la supervivencia.",
        retro_incorrecta: "Las adaptaciones son características que ayudan a los seres vivos a sobrevivir en su ambiente."
    },
    {
        desc_pregunta: "¿Qué es el mimetismo?",
        respuestas: [
            { desc_respuesta: "Imitar el movimiento de otro animal", esCorrecta: 0 },
            { desc_respuesta: "Imitar la apariencia de otro organismo para protección", esCorrecta: 1 },
            { desc_respuesta: "Un tipo de reproducción", esCorrecta: 0 },
            { desc_respuesta: "Un tipo de alimentación", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! El mimetismo es imitar a otro organismo peligroso o tóxico para evitar depredadores.",
        retro_incorrecta: "El mimetismo es imitar la apariencia de otro organismo para engañar a los depredadores y sobrevivir."
    },
    {
        desc_pregunta: "¿Por qué los cactus tienen espinas?",
        respuestas: [
            { desc_respuesta: "Para decorar", esCorrecta: 0 },
            { desc_respuesta: "Para protegerse y reducir la pérdida de agua", esCorrecta: 1 },
            { desc_respuesta: "Para crecer más rápido", esCorrecta: 0 },
            { desc_respuesta: "Para producir más flores", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! Las espinas son hojas modificadas que minimizan la superficie de evaporación y protegen al cactus.",
        retro_incorrecta: "Las espinas del cactus son una adaptación que reduce la pérdida de agua y protege de los herbívoros."
    }
];

$(document).ready(function(){ cargar(datosInline); });

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
    var res = $(window).width() / 750;
    if ($(window).width() <= 750) { $("body").css({'zoom': res}); }
}

var totalBuenas=0, totalMalas=0;
var res_preguntas=[], respondio=[], resFinal=[], mis_respuestas=[];
var marco=0, anterior='';

function validar(pregunta, clase, id) {
    if (marco == 0) {
        $(".opcion"+anterior).removeAttr("style"); anterior = clase;
        res_preguntas.push(pregunta); respondio.push(id); resFinal.push(clase);
        $(".opcion"+clase).attr("style","color: #FFF; background: #D32F2F;");
        marco = 1; mis_respuestas.push($(".opcion"+clase).text());
    } else {
        $(".opcion"+anterior).removeAttr("style"); anterior = clase;
        res_preguntas.pop(); res_preguntas.push(pregunta);
        respondio.pop(); respondio.push(id);
        resFinal.pop(); resFinal.push(clase);
        $(".opcion"+clase).attr("style","color: #FFF; background: #D32F2F;");
        mis_respuestas.pop(); mis_respuestas.push($(".opcion"+clase).text());
    }
}

function siguiente() {
    if (marco == 1) {
        $(".opcion"+anterior).removeAttr("style");
        $("#parrafo").html(''); for (var i=0;i<=3;i++){$("#res"+i).html('');}
        $("#imagen").html(''); anterior=''; cargar(datos); marco=0;
    } else {
        $(".divmarca").attr("style",'display:table');
        setTimeout(function(){ $(".divmarca").attr("style",'display:none'); },1600);
    }
}

var inicial=0, clic=0;
function retroalimentacion(tipo) {
    if (clic==0){$("#tabinicioretro").attr('style','display:none');$("#tabretro1").attr('style','display:table');clic=1;}
    if (tipo=='atras'){inicial--;}else if(tipo=='adelante'){inicial++;}
    if (inicial < 5) {
        if (inicial==0){$("#atras").attr('style','display:none');}else{$("#atras").attr('style','display:table');}
        limpiar_retro("#m1",".divtextoretro"); limpiar_retro("#b1",".divtextoretro");
        var estilo="font-family: Chewy !important; font-size: 20px !important;";
        if (respondio[inicial]==0) {
            $("#m1").attr("style","display:table");
            $(".divtextoretro").append('<div id="mt1"><img class="imagenpregunta" src="img/'+res_preguntas[inicial]+'.png"/><span class="textopregretro">PREGUNTA</span><div class="divpreguntaretro">'+datos[res_preguntas[inicial]].desc_pregunta+'</div><span><div style="'+estilo+'">Tu respuesta fue:</div>'+mis_respuestas[inicial]+'<div style="'+estilo+'">Retroalimentación:</div>'+datos[res_preguntas[inicial]].retro_incorrecta+'</span><span class="incorrecto">¡Incorrecto!</span></div>');
        } else {
            $("#b1").attr("style","display:table");
            $(".divtextoretro").append('<img class="imagenpregunta" src="img/'+res_preguntas[inicial]+'.png"/><div id="bt1"><span class="textopregretro">PREGUNTA</span><div class="divpreguntaretro">'+datos[res_preguntas[inicial]].desc_pregunta+'</div><div style="'+estilo+'">Tu respuesta fue:</div>'+mis_respuestas[inicial]+'<div style="'+estilo+'">Retroalimentación:</div>'+datos[res_preguntas[inicial]].retro_correcta+'<span class="incorrecto">¡Muy bien!</span></div>');
        }
    } else {
        $("#tabretro1").attr("style",'display:none');
        $("#tabresultados").attr("style",'display:table');
        mostrar_resultado();
    }
}

function limpiar_retro(n1,n2){$(n1).attr("style","display:none");$(n2).html('');}

function mostrar_resultado() {
    for (var i=0;i<=4;i++){
        $(".divgranderespuestas").append('<div class="divrespuesta"><div class="pre">'+(i+1)+'. '+datos[res_preguntas[i]].desc_pregunta+'<br><b>Tu respuesta</b>: '+mis_respuestas[i]+'</div><div id="imgRespuestas'+(i+1)+'" class="divimagenrespuesta"></div></div>');
        if(respondio[i]==0){$("#imgRespuestas"+(i+1)).append('<img src="img/incorrecto.png">');totalMalas++;}
        else{$("#imgRespuestas"+(i+1)).append('<img src="img/correcto.png">');totalBuenas++;}
    }
    var _b = document.getElementById('buenas');
    if (_b) { _b.value = totalBuenas; }
    $(".resultado").html(totalBuenas+'/5');
    if(totalBuenas>3){$("#ganaste").attr("style",'position:absolute;top:1%;left:15%;display:table;width:12%;');}
    else{$("#perdiste").attr("style",'position:absolute;top:1%;left:15%;display:table;width:12%;');}
}

function recargar(){
    $("#tab0").attr("style",'display:table');
    $("#tabresultados").attr("style",'display:none');
    limpiarVariables(); cargar(datos);
}

function limpiarVariables(){
    lista=lista.sort(function(){return Math.random()-0.5;});
    numeroPreg=0;clic=0;totalBuenas=0;totalMalas=0;marco=0;inicial=0;
    res_preguntas=[];respondio=[];mis_respuestas=[];anterior='';
    $(".divgranderespuestas").html('');
    $("#ganaste").attr("style",'display:none');$("#perdiste").attr("style",'display:none');
}

function cambiar0(){
    $("#tab0").attr("style",'display:none');
    $("#tab1").attr("style",'display:table');
}
