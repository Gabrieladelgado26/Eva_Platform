
var resLetras=['A.','B.','C.','D.'];

var datosInline = [
    {
        desc_pregunta: "¿Qué es el patrimonio cultural?",
        respuestas: [
            { desc_respuesta: "Las cosas, tradiciones y costumbres que heredamos de nuestros abuelos y que debemos cuidar.", esCorrecta: 1 },
            { desc_respuesta: "Los juguetes que se venden en las tiendas del pueblo.", esCorrecta: 0 },
            { desc_respuesta: "Solo los edificios muy grandes y antiguos.", esCorrecta: 0 },
            { desc_respuesta: "Los productos que llegan de otros países.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! El patrimonio cultural son todas las cosas, tradiciones y costumbres que aprendemos de nuestros abuelos y que debemos cuidar para el futuro.</span>",
        retro_incorrecta: "<span>El patrimonio cultural son las cosas, tradiciones y costumbres que heredamos de nuestros abuelos y que debemos cuidar y compartir.</span>"
    },
    {
        desc_pregunta: "¿Cuál de estos es un ejemplo de patrimonio cultural que no se puede tocar?",
        respuestas: [
            { desc_respuesta: "Una iglesia muy antigua.", esCorrecta: 0 },
            { desc_respuesta: "El Carnaval de Barranquilla, con su música, bailes y disfraces.", esCorrecta: 1 },
            { desc_respuesta: "Un cuadro pintado en un museo.", esCorrecta: 0 },
            { desc_respuesta: "Una estatua de bronce en el parque.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Excelente! El Carnaval de Barranquilla es patrimonio cultural porque son tradiciones vivas: música, bailes y disfraces que la gente comparte y celebra.</span>",
        retro_incorrecta: "<span>El Carnaval de Barranquilla es un ejemplo de patrimonio cultural que no se puede tocar, porque son tradiciones vivas como la música, los bailes y los disfraces.</span>"
    },
    {
        desc_pregunta: "¿Qué organización del mundo cuida y protege el patrimonio cultural de todos los países?",
        respuestas: [
            { desc_respuesta: "UNICEF", esCorrecta: 0 },
            { desc_respuesta: "Cruz Roja", esCorrecta: 0 },
            { desc_respuesta: "UNESCO", esCorrecta: 1 },
            { desc_respuesta: "OMS", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! La UNESCO es la organización mundial que cuida y protege el patrimonio cultural de todos los países para que no se pierda.</span>",
        retro_incorrecta: "<span>La UNESCO es la organización del mundo encargada de cuidar y proteger el patrimonio cultural de todos los países.</span>"
    },
    {
        desc_pregunta: "¿Qué significa que un lugar sea declarado Patrimonio de la Humanidad?",
        respuestas: [
            { desc_respuesta: "Que solo los adultos pueden visitarlo.", esCorrecta: 0 },
            { desc_respuesta: "Que es tan especial e importante que todos debemos ayudar a cuidarlo.", esCorrecta: 1 },
            { desc_respuesta: "Que fue construido hace más de mil años.", esCorrecta: 0 },
            { desc_respuesta: "Que pertenece a un solo país y nadie más puede visitarlo.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Un lugar Patrimonio de la Humanidad es tan especial e importante que personas de todo el mundo ayudan a cuidarlo.</span>",
        retro_incorrecta: "<span>Que un lugar sea Patrimonio de la Humanidad significa que es tan especial e importante que todos debemos ayudar a cuidarlo.</span>"
    },
    {
        desc_pregunta: "¿Cuál ciudad de Colombia tiene su centro histórico declarado Patrimonio de la Humanidad?",
        respuestas: [
            { desc_respuesta: "Bogotá", esCorrecta: 0 },
            { desc_respuesta: "Medellín", esCorrecta: 0 },
            { desc_respuesta: "Cartagena de Indias", esCorrecta: 1 },
            { desc_respuesta: "Cali", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! Cartagena de Indias tiene su centro histórico declarado Patrimonio de la Humanidad por sus murallas, fortalezas y calles llenas de historia.</span>",
        retro_incorrecta: "<span>Cartagena de Indias es la ciudad colombiana con centro histórico declarado Patrimonio de la Humanidad, gracias a sus murallas, fortalezas y calles coloridas.</span>"
    },
    {
        desc_pregunta: "¿Cómo podemos ayudar a cuidar el patrimonio cultural de nuestro pueblo?",
        respuestas: [
            { desc_respuesta: "Guardando todos los objetos antiguos en una bodega oscura.", esCorrecta: 0 },
            { desc_respuesta: "Aprendiendo y compartiendo las tradiciones, cuentos y costumbres de nuestra comunidad.", esCorrecta: 1 },
            { desc_respuesta: "Vendiéndolo a personas de otros países.", esCorrecta: 0 },
            { desc_respuesta: "No dejando que nadie lo conozca.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Podemos cuidar el patrimonio cultural aprendiendo y compartiendo las tradiciones, cuentos y costumbres de nuestra comunidad.</span>",
        retro_incorrecta: "<span>La mejor forma de cuidar el patrimonio cultural es aprender y compartir las tradiciones, cuentos y costumbres de nuestra comunidad con todos.</span>"
    },
    {
        desc_pregunta: "¿Qué son los objetos del patrimonio cultural que sí podemos tocar y mover, como pinturas o vasijas antiguas?",
        respuestas: [
            { desc_respuesta: "Patrimonio natural.", esCorrecta: 0 },
            { desc_respuesta: "Patrimonio cultural mueble, porque son objetos que se pueden trasladar.", esCorrecta: 1 },
            { desc_respuesta: "Patrimonio inventado.", esCorrecta: 0 },
            { desc_respuesta: "Monumentos históricos.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! Las pinturas, vasijas y objetos que podemos tocar y mover se llaman patrimonio cultural mueble.</span>",
        retro_incorrecta: "<span>Los objetos que podemos tocar y mover, como pinturas o vasijas antiguas, se llaman patrimonio cultural mueble.</span>"
    },
    {
        desc_pregunta: "¿Por qué es malo robar o vender objetos del patrimonio cultural?",
        respuestas: [
            { desc_respuesta: "Porque esos objetos son muy pesados y difíciles de cargar.", esCorrecta: 0 },
            { desc_respuesta: "Porque se pierden para siempre y ya no podemos conocer nuestra historia.", esCorrecta: 1 },
            { desc_respuesta: "Porque son objetos que no tienen ningún valor.", esCorrecta: 0 },
            { desc_respuesta: "Porque solo los pueden tocar los investigadores.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Robar o vender objetos del patrimonio es malo porque se pierden para siempre y ya no podemos conocer nuestra historia.</span>",
        retro_incorrecta: "<span>Robar o vender objetos del patrimonio cultural es muy malo porque esos objetos se pierden para siempre y ya no podemos conocer nuestra historia.</span>"
    },
    {
        desc_pregunta: "¿Cuál de las siguientes es una tradición que forma parte del patrimonio cultural colombiano?",
        respuestas: [
            { desc_respuesta: "El Halloween.", esCorrecta: 0 },
            { desc_respuesta: "Las Fiestas de San Pedro y San Pablo en el Huila.", esCorrecta: 1 },
            { desc_respuesta: "El Día de Acción de Gracias.", esCorrecta: 0 },
            { desc_respuesta: "La celebración del Año Nuevo chino.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! Las Fiestas de San Pedro y San Pablo en el Huila son una tradición propia de Colombia con música, bailes y trajes típicos que debemos cuidar.</span>",
        retro_incorrecta: "<span>Las Fiestas de San Pedro y San Pablo en el Huila son una tradición colombiana con música, bailes y trajes típicos que forman parte de nuestro patrimonio cultural.</span>"
    },
    {
        desc_pregunta: "¿Para qué nos sirve conocer el patrimonio cultural de nuestro país?",
        respuestas: [
            { desc_respuesta: "Para saber cuánto dinero ganaban los abuelos.", esCorrecta: 0 },
            { desc_respuesta: "Para conocer quiénes somos, de dónde venimos y sentirnos orgullosos de nuestra historia.", esCorrecta: 1 },
            { desc_respuesta: "Para aprender a hablar otros idiomas.", esCorrecta: 0 },
            { desc_respuesta: "Para saber cuántas personas viven en Colombia.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Excelente! Conocer el patrimonio cultural nos ayuda a saber quiénes somos, de dónde venimos y nos hace sentir orgullosos de nuestra historia.</span>",
        retro_incorrecta: "<span>Conocer el patrimonio cultural nos sirve para saber quiénes somos, de dónde venimos y sentirnos orgullosos de nuestra historia.</span>"
    }
];

$(document).ready(function(){
    cargar(datosInline);
});

var numeroPreg = 0;
var datos = datosInline;

var lista = [0,1,2,3,4,5,6,7,8,9];
lista = lista.sort(function(){return Math.random() - 0.5});

function cargar(data)
{
    if (numeroPreg<=4) {
        $("#parrafo").append(data[lista[numeroPreg]].desc_pregunta);
        for (var i = 0; i <= 3; i++)
        {
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

/*INICIO CAPTURA PANTALLA*/
    $(document).ready(resizeContent);
    $(window).resize(resizeContent);
    function resizeContent() {
      var res = $(window).width()/(750 * 1);
      if($(window).width()<=750)
      {
      $("body").css({'zoom': res});
      }
    }
/*FIN CAPTURA PANTALLA*/

var totalBuenas=0,totalMalas=0;
var res_preguntas=[];
var respondio=[];
var marco=0;
var anterior='';
var resFinal=[];

function validar(pregunta,clase,id)
{
    $(".opcion"+anterior).removeAttr("style");
    anterior=clase;
    res_preguntas.push(pregunta);
    respondio.push(id);
    resFinal.push(clase);
    $(".opcion"+clase).attr("style","color: #FFF; background: #F57515;");
    marco=1;
}

function siguiente()
{
    if(marco==1){
        $(".opcion"+anterior).removeAttr("style");
        $("#parrafo").html('');
        for (var i =0 ; i <= 3; i++) {
            $("#res"+i).html('');
        }
        $("#imagen").html('');
        anterior='';
        cargar(datos);
        marco=0;
    }
    else
    {
        $(".divmarca").attr("style",'display:table');
        setTimeout(function(){$(".divmarca").attr("style",'display:none')},1600);
    }
}

var inicial=0,clic=0;
function retroalimentacion(tipo)
{
    if(clic==0){
        $("#tabinicioretro").attr('style','display:none');
        $("#tabretro1").attr('style','display:table');
        clic=1;
    }
    if (tipo=='atras') {inicial--;}else if(tipo=='adelante'){inicial++;}
    if(inicial<5){
        if (inicial==0 ) {$("#atras").attr('style','display:none');}
        else{$("#atras").attr('style','display:table');}
        limpiar_retro("#m1",".divtextoretro");
        limpiar_retro("#b1",".divtextoretro");
        if(respondio[inicial]==0)
        {
            var resCorrecta='';
            for (var i = 0; i <= 3; i++) {
                if (datos[res_preguntas[inicial]].respuestas[i].esCorrecta==1){
                    resCorrecta=datos[res_preguntas[inicial]].respuestas[i].desc_respuesta;
                }
            }
            $("#m1").attr("style","display:table");
            $(".divtextoretro").append('<div id="mt1"><img class="divpreguntaretro"><img class="divimagenretro"  src="img/'+res_preguntas[inicial]+'.png"/>'+datos[res_preguntas[inicial]].retro_incorrecta+'</span><span class="incorrecto">¡Incorrecto!</span></div><span class="textopregretro"><img class="preguntaretro" src="img/pregunta.png"></span><div class="divpreguntaretro">'+datos[res_preguntas[inicial]].desc_pregunta+'</div>');
        }else{
            $("#b1").attr("style","display:table");
            $(".divtextoretro").append('<div id="bt1"><img class="divpreguntaretro"><img class="divimagenretro"  src="img/'+res_preguntas[inicial]+'.png"/>'+datos[res_preguntas[inicial]].retro_correcta+'</span><span class="correcto">¡Muy Bien!</span></div><span class="textopregretro"><img class="preguntaretro"  src="img/pregunta.png"></span><div class="divpreguntaretro">'+datos[res_preguntas[inicial]].desc_pregunta+'</div>');
        }
    }else{
        $("#tabretro1").attr("style",'display:none');
        $("#tabresultados").attr("style",'display:table');
        mostrar_resultado();
    }
}

function limpiar_retro(nombre1,nombre2){
        $(nombre1).attr("style","display:none");
        $(nombre2).html('');
}

function mostrar_resultado()
{
    for (var i = 0; i <= 4; i++) {
        $(".divgranderespuestas").append('<div id="preguntas" class="divrespuesta"><div class="pre">'+(i+1)+'. '+datos[res_preguntas[i]].desc_pregunta+'</div><div id="imgRespuestas'+(i+1)+'" class="divimagenrespuesta"></div></div>');
        if(respondio[i]==0){
            $("#imgRespuestas"+(i+1)).append('<img  src="img/incorrecto.png">');
            totalMalas++;
        }else{
            $("#imgRespuestas"+(i+1)).append('<img  src="img/correcto.png">');
            totalBuenas++;
        }
    }
    $(".resultado").html(totalBuenas+'/5');

    if(window.EVA && typeof window.EVA.sendResult === 'function'){
        window.EVA.sendResult(totalBuenas, 5);
    }

    if(totalBuenas>3){
        $("#ganaste").attr("style",'position: absolute; top: 1%; left: 15%; display: table; width: 12%;');
    }
    else{
        $("#perdiste").attr("style",'position: absolute; top: 1%; left: 15%; display: table; width: 12%;');
    }
}

function recargar(){
    $("#tab0").attr("style",'display:table');
    $("#tabresultados").attr("style",'display:none');
    limpiarVariables();
    cargar(datos);
}

function limpiarVariables()
{
    lista = lista.sort(function(){return Math.random() - 0.5});
    numeroPreg=0,clic=0,totalBuenas=0,totalMalas=0,marco=0,inicial=0,clic=0;
    res_preguntas=[],respondio=[];
    anterior='';
    $("#imgRespuestas").html('');
    $(".divgranderespuestas").html('');
    $("#ganaste").attr("style",'display:none');
    $("#perdiste").attr("style",'display:none');
}

function cambiar0(){
    $("#tab0").attr("style",'display:none');
    $("#tab1").attr("style",'display:table');
}
