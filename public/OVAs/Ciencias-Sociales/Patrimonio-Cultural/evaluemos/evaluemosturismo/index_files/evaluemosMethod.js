
var resLetras=['A.','B.','C.','D.'];

var datosInline = [
    {
        desc_pregunta: "¿Qué es el turismo?",
        respuestas: [
            { desc_respuesta: "Quedarse siempre en casa sin salir.", esCorrecta: 0 },
            { desc_respuesta: "Viajar a conocer otros lugares, su gente, su naturaleza y sus costumbres.", esCorrecta: 1 },
            { desc_respuesta: "Comprar ropa en una tienda del pueblo.", esCorrecta: 0 },
            { desc_respuesta: "Ver televisión en otro idioma.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! El turismo es cuando viajamos para conocer otros lugares, aprender de su cultura, ver su naturaleza y conocer a sus habitantes.</span>",
        retro_incorrecta: "<span>El turismo es viajar para conocer otros lugares, su gente, su naturaleza y sus costumbres. ¡Viajar nos ayuda a aprender muchas cosas nuevas!</span>"
    },
    {
        desc_pregunta: "¿Por qué es bueno que las personas visiten otros lugares de Colombia?",
        respuestas: [
            { desc_respuesta: "Porque así pueden comprar más dulces.", esCorrecta: 0 },
            { desc_respuesta: "Para conocer la historia, las tradiciones y la naturaleza de esos lugares.", esCorrecta: 1 },
            { desc_respuesta: "Porque en otros lugares no hay colegio.", esCorrecta: 0 },
            { desc_respuesta: "Para no tener que estudiar.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! Visitar otros lugares de Colombia nos ayuda a conocer su historia, tradiciones y naturaleza. ¡Aprendemos mucho cuando viajamos!</span>",
        retro_incorrecta: "<span>Es bueno visitar otros lugares para conocer su historia, sus tradiciones y su naturaleza. Viajar es una forma muy divertida de aprender.</span>"
    },
    {
        desc_pregunta: "¿Qué es un parque natural?",
        respuestas: [
            { desc_respuesta: "Un parque de diversiones con juegos mecánicos.", esCorrecta: 0 },
            { desc_respuesta: "Un lugar donde se protegen los animales, las plantas y la naturaleza.", esCorrecta: 1 },
            { desc_respuesta: "Un lugar donde solo pueden entrar científicos.", esCorrecta: 0 },
            { desc_respuesta: "Un estadio de fútbol rodeado de árboles.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Un parque natural es un lugar especial donde se cuidan y protegen los animales, las plantas y toda la naturaleza para que no desaparezcan.</span>",
        retro_incorrecta: "<span>Un parque natural es un lugar donde se protegen los animales, las plantas y la naturaleza. Es importante cuidarlos para que las siguientes generaciones también los puedan disfrutar.</span>"
    },
    {
        desc_pregunta: "¿Cuál parque natural de Colombia está cerca del mar Caribe y es muy famoso?",
        respuestas: [
            { desc_respuesta: "El Gran Cañón del Colorado.", esCorrecta: 0 },
            { desc_respuesta: "El Parque Nacional Natural Tayrona.", esCorrecta: 1 },
            { desc_respuesta: "Las cataratas del Niágara.", esCorrecta: 0 },
            { desc_respuesta: "El desierto del Sahara.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! El Parque Nacional Natural Tayrona está en la Costa Caribe colombiana. Tiene playas hermosas, selva tropical y muchos animales. ¡Es un lugar muy especial de Colombia!</span>",
        retro_incorrecta: "<span>El Parque Nacional Natural Tayrona es uno de los más famosos de Colombia. Está cerca del mar Caribe y tiene selva, playas y muchos animales y plantas.</span>"
    },
    {
        desc_pregunta: "¿Cómo debemos cuidar los lugares que visitamos cuando viajamos?",
        respuestas: [
            { desc_respuesta: "Tirando basura en el piso y rayando las paredes.", esCorrecta: 0 },
            { desc_respuesta: "No tirando basura, respetando las plantas y los animales y siguiendo las normas del lugar.", esCorrecta: 1 },
            { desc_respuesta: "Llevándonos flores y animales a casa como recuerdo.", esCorrecta: 0 },
            { desc_respuesta: "Haciendo ruido y molestando a los animales.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Cuando visitamos un lugar debemos cuidarlo: no tirar basura, respetar los animales y las plantas y seguir las normas. ¡Así lo disfrutarán también los niños del futuro!</span>",
        retro_incorrecta: "<span>Debemos cuidar los lugares que visitamos: no tirar basura, respetar animales y plantas y seguir las normas. Así esos lugares seguirán siendo hermosos para siempre.</span>"
    },
    {
        desc_pregunta: "¿Qué puede pasar si llegan demasiados turistas a un lugar sin cuidarlo?",
        respuestas: [
            { desc_respuesta: "El lugar se pone más bonito con más visitas.", esCorrecta: 0 },
            { desc_respuesta: "El lugar puede dañarse y perder lo que lo hacía especial.", esCorrecta: 1 },
            { desc_respuesta: "Los animales se ponen más contentos.", esCorrecta: 0 },
            { desc_respuesta: "Las plantas crecen más rápido.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! Si llegan muchos turistas sin cuidar el lugar, puede dañarse: los animales se asustan, las plantas se destruyen y los sitios históricos se deterioran.</span>",
        retro_incorrecta: "<span>Cuando llegan demasiadas personas sin cuidar un lugar, puede dañarse y perder lo que lo hacía especial. Por eso debemos visitar los lugares con respeto y cuidado.</span>"
    },
    {
        desc_pregunta: "¿Qué hace que un lugar sea especial e interesante para visitar?",
        respuestas: [
            { desc_respuesta: "Que tenga muchas tiendas de ropa.", esCorrecta: 0 },
            { desc_respuesta: "Su historia, sus tradiciones, su naturaleza y sus costumbres.", esCorrecta: 1 },
            { desc_respuesta: "Que solo haya edificios modernos y grandes.", esCorrecta: 0 },
            { desc_respuesta: "Que tenga muchos carros y motos.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Un lugar es especial cuando tiene historia, tradiciones, naturaleza y costumbres propias. ¡Por eso cada lugar de Colombia es único y vale la pena conocerlo!</span>",
        retro_incorrecta: "<span>Lo que hace especial un lugar es su historia, sus tradiciones, su naturaleza y sus costumbres. ¡Cada lugar de Colombia tiene algo único y maravilloso para conocer!</span>"
    },
    {
        desc_pregunta: "¿Por qué el turismo es bueno para las personas que viven en un pueblo o ciudad?",
        respuestas: [
            { desc_respuesta: "Porque los turistas hacen mucho ruido.", esCorrecta: 0 },
            { desc_respuesta: "Porque ayuda a que las personas del lugar puedan trabajar y ganar dinero.", esCorrecta: 1 },
            { desc_respuesta: "Porque los turistas siempre traen problemas.", esCorrecta: 0 },
            { desc_respuesta: "Porque hace que los precios bajen para todos.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! El turismo ayuda a las personas del lugar porque pueden trabajar vendiendo artesanías, comida, servicios de guía y muchas cosas más.</span>",
        retro_incorrecta: "<span>El turismo es bueno para un lugar porque ayuda a las personas que viven allí a tener trabajo y ganar dinero. ¡Así las comunidades crecen y mejoran!</span>"
    },
    {
        desc_pregunta: "¿Cuál de estas cosas hace un buen turista?",
        respuestas: [
            { desc_respuesta: "Tirar basura en los ríos y playas.", esCorrecta: 0 },
            { desc_respuesta: "Respetar las costumbres del lugar, cuidar la naturaleza y no dañar nada.", esCorrecta: 1 },
            { desc_respuesta: "Arrancar flores y llevarse animales.", esCorrecta: 0 },
            { desc_respuesta: "Hacer ruido y molestar a los habitantes del lugar.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Un buen turista respeta las costumbres del lugar, cuida la naturaleza y no daña nada. ¡Así todos pueden disfrutar de los lugares hermosos de Colombia!</span>",
        retro_incorrecta: "<span>Un buen turista respeta las costumbres, cuida la naturaleza y no daña nada. Así los lugares hermosos se conservan para que todos los puedan visitar.</span>"
    },
    {
        desc_pregunta: "¿Para qué nos sirve aprender sobre la historia y las costumbres de un lugar antes de visitarlo?",
        respuestas: [
            { desc_respuesta: "Para poder comprar más cosas en las tiendas.", esCorrecta: 0 },
            { desc_respuesta: "Para conocer y respetar mejor ese lugar y disfrutar más la visita.", esCorrecta: 1 },
            { desc_respuesta: "Para no tener que hablar con nadie.", esCorrecta: 0 },
            { desc_respuesta: "Para poder criticar lo que no nos gusta.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Excelente! Aprender sobre un lugar antes de visitarlo nos ayuda a respetarlo mejor y a disfrutar más la visita. ¡Cuando sabemos su historia, todo se vuelve más interesante!</span>",
        retro_incorrecta: "<span>Aprender sobre la historia y costumbres de un lugar nos ayuda a respetarlo y a disfrutar mejor la visita. ¡Conocer su historia hace que todo sea más emocionante!</span>"
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
    $(".opcion"+clase).attr("style","color: #FFF; background: #0097A7;");
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
