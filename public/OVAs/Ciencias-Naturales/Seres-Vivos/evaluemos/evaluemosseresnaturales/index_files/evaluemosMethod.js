var resLetras=['A.','B.','C.','D.'];

var datosInline = [
    {
        desc_pregunta: "¿Qué es la deforestación?",
        respuestas: [
            { desc_respuesta: "Plantar más árboles", esCorrecta: 0 },
            { desc_respuesta: "Tala de árboles a gran escala", esCorrecta: 1 },
            { desc_respuesta: "Crecimiento de bosques", esCorrecta: 0 },
            { desc_respuesta: "Conservación de bosques", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! La deforestación destruye hábitats y contribuye al cambio climático global.",
        retro_incorrecta: "La deforestación es la tala masiva de árboles que destruye ecosistemas y afecta el clima."
    },
    {
        desc_pregunta: "¿Qué son los recursos naturales?",
        respuestas: [
            { desc_respuesta: "Solo las máquinas", esCorrecta: 0 },
            { desc_respuesta: "Elementos de la naturaleza que usamos para vivir", esCorrecta: 1 },
            { desc_respuesta: "Solo los edificios", esCorrecta: 0 },
            { desc_respuesta: "Solo la tecnología", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! El agua, suelo, minerales y aire son recursos naturales esenciales para la vida.",
        retro_incorrecta: "Los recursos naturales son el agua, suelo, minerales y aire que los seres vivos usamos para vivir."
    },
    {
        desc_pregunta: "¿Qué es el agua potable?",
        respuestas: [
            { desc_respuesta: "Agua de lluvia sin tratar", esCorrecta: 0 },
            { desc_respuesta: "Agua limpia y segura para beber", esCorrecta: 1 },
            { desc_respuesta: "Agua de mar", esCorrecta: 0 },
            { desc_respuesta: "Agua contaminada", esCorrecta: 0 }
        ],
        retro_correcta: "¡Excelente! El agua potable es tratada para eliminar microorganismos y contaminantes.",
        retro_incorrecta: "El agua potable es agua purificada y tratada que es segura para el consumo humano."
    },
    {
        desc_pregunta: "¿Qué es la biodiversidad?",
        respuestas: [
            { desc_respuesta: "La variedad de máquinas en un lugar", esCorrecta: 0 },
            { desc_respuesta: "La variedad de seres vivos en un ecosistema", esCorrecta: 1 },
            { desc_respuesta: "La cantidad de agua en un lugar", esCorrecta: 0 },
            { desc_respuesta: "La cantidad de minerales", esCorrecta: 0 }
        ],
        retro_correcta: "¡Correcto! La biodiversidad abarca todas las formas de vida y es esencial para el equilibrio natural.",
        retro_incorrecta: "La biodiversidad es la variedad de seres vivos en un ecosistema, esencial para su equilibrio."
    },
    {
        desc_pregunta: "¿Qué es la contaminación ambiental?",
        respuestas: [
            { desc_respuesta: "La limpieza de los ecosistemas", esCorrecta: 0 },
            { desc_respuesta: "La introducción de sustancias dañinas al medio ambiente", esCorrecta: 1 },
            { desc_respuesta: "El aumento de recursos naturales", esCorrecta: 0 },
            { desc_respuesta: "La plantación de árboles", esCorrecta: 0 }
        ],
        retro_correcta: "¡Muy bien! La contaminación ambiental daña ecosistemas, afecta la salud y amenaza la biodiversidad.",
        retro_incorrecta: "La contaminación es la introducción de agentes nocivos al medio ambiente que dañan la vida."
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
        $(".divgranderespuestas").append('<div id="preguntas" class="divrespuesta"><div class="pre">'+(i+1)+'. '+datos[res_preguntas[i]].desc_pregunta+'<br><b>Tu respuesta</b>: '+mis_respuestas[i]+'</div><div id="imgRespuestas'+(i+1)+'" class="divimagenrespuesta"></div></div>');
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
    $("#imgRespuestas").html('');$(".divgranderespuestas").html('');
    $("#ganaste").attr("style",'display:none');$("#perdiste").attr("style",'display:none');
}

function cambiar0(){
    $("#tab0").attr("style",'display:none');
    $("#tab1").attr("style",'display:table');
}
