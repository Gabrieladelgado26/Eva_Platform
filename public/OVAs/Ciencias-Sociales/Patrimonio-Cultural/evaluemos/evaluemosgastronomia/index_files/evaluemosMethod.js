
var resLetras=['A.','B.','C.','D.'];

var datosInline = [
    {
        desc_pregunta: "¿Cuál de estas es una comida típica de Colombia?",
        respuestas: [
            { desc_respuesta: "El ajiaco, una sopa con pollo y papas.", esCorrecta: 1 },
            { desc_respuesta: "La pizza con pepperoni.", esCorrecta: 0 },
            { desc_respuesta: "Los tacos mexicanos.", esCorrecta: 0 },
            { desc_respuesta: "El sushi de atún.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! El ajiaco es una sopa típica de Colombia hecha con pollo, papas y una hierba especial llamada guascas. ¡Es deliciosa!</span>",
        retro_incorrecta: "<span>El ajiaco es una sopa típica de Colombia hecha con pollo, papas y guascas. Es uno de los platos más famosos de nuestro país.</span>"
    },
    {
        desc_pregunta: "¿De qué está hecha la arepa colombiana?",
        respuestas: [
            { desc_respuesta: "De trigo y levadura.", esCorrecta: 0 },
            { desc_respuesta: "De arroz y leche.", esCorrecta: 0 },
            { desc_respuesta: "De maíz.", esCorrecta: 1 },
            { desc_respuesta: "De papa y queso.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! La arepa se hace con maíz y es una de las comidas más queridas de Colombia. ¡Hay arepas de muchas formas y sabores!</span>",
        retro_incorrecta: "<span>La arepa colombiana se hace con maíz. Es un alimento muy antiguo que los indígenas ya comían antes de que llegaran los españoles.</span>"
    },
    {
        desc_pregunta: "¿Cuál es la bebida colombiana más famosa en todo el mundo?",
        respuestas: [
            { desc_respuesta: "El chocolate caliente.", esCorrecta: 0 },
            { desc_respuesta: "El café.", esCorrecta: 1 },
            { desc_respuesta: "La limonada.", esCorrecta: 0 },
            { desc_respuesta: "El jugo de naranja.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Excelente! El café de Colombia es muy famoso en todo el mundo porque es de muy buena calidad. Las montañas donde se cultiva son tan especiales que son Patrimonio de la Humanidad.</span>",
        retro_incorrecta: "<span>El café colombiano es la bebida más famosa de Colombia en el mundo entero. Las montañas cafeteras de Colombia son tan especiales que son Patrimonio de la Humanidad.</span>"
    },
    {
        desc_pregunta: "¿Qué es el sancocho?",
        respuestas: [
            { desc_respuesta: "Un postre dulce con frutas.", esCorrecta: 0 },
            { desc_respuesta: "Una sopa con carne y verduras que se come en muchas partes de Colombia.", esCorrecta: 1 },
            { desc_respuesta: "Un refresco de panela.", esCorrecta: 0 },
            { desc_respuesta: "Un pan típico de la Costa.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! El sancocho es una sopa caliente con carne y verduras. Es muy popular en todo Colombia y cada región lo prepara a su manera.</span>",
        retro_incorrecta: "<span>El sancocho es una sopa con carne y verduras, muy típica de Colombia. Es un plato que se prepara en muchas regiones del país.</span>"
    },
    {
        desc_pregunta: "¿Cuál plato tiene fríjoles, arroz, chicharrón y huevo frito y es típico de Antioquia?",
        respuestas: [
            { desc_respuesta: "El ajiaco.", esCorrecta: 0 },
            { desc_respuesta: "El sancocho.", esCorrecta: 0 },
            { desc_respuesta: "La bandeja paisa.", esCorrecta: 1 },
            { desc_respuesta: "El ceviche.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! La bandeja paisa es el plato típico de Antioquia. Tiene fríjoles, arroz, chicharrón, huevo frito, carne, arepa y chorizo. ¡Es un plato muy completo!</span>",
        retro_incorrecta: "<span>La bandeja paisa es el plato típico de Antioquia. Tiene fríjoles, arroz, chicharrón, huevo frito, carne y arepa. Es uno de los más famosos de Colombia.</span>"
    },
    {
        desc_pregunta: "¿De quién aprendemos las recetas de las comidas típicas de nuestra familia?",
        respuestas: [
            { desc_respuesta: "De los libros de otros países.", esCorrecta: 0 },
            { desc_respuesta: "De la televisión extranjera.", esCorrecta: 0 },
            { desc_respuesta: "De nuestros abuelos, papás y personas mayores de la comunidad.", esCorrecta: 1 },
            { desc_respuesta: "Las inventamos solos sin ayuda de nadie.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Las recetas de la comida típica las aprendemos de nuestros abuelos y papás, quienes las aprendieron de sus propios abuelos. Así se guardan nuestras tradiciones.</span>",
        retro_incorrecta: "<span>Las recetas típicas las aprendemos de nuestros abuelos y personas mayores, quienes las heredaron de sus antepasados. Así pasamos las tradiciones de generación en generación.</span>"
    },
    {
        desc_pregunta: "¿Qué ingredientes se usan mucho en la comida de la región Pacífica de Colombia?",
        respuestas: [
            { desc_respuesta: "El coco y el pescado.", esCorrecta: 1 },
            { desc_respuesta: "La papa y el trigo.", esCorrecta: 0 },
            { desc_respuesta: "El maíz seco y el queso.", esCorrecta: 0 },
            { desc_respuesta: "La cebada y la avena.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! En la región Pacífica usan mucho el coco y el pescado porque están cerca del mar. ¡Por eso su comida tiene un sabor especial y delicioso!</span>",
        retro_incorrecta: "<span>En la región Pacífica de Colombia usan mucho el coco y el pescado porque viven cerca del mar. Esto le da a su comida un sabor muy especial.</span>"
    },
    {
        desc_pregunta: "¿Por qué es importante que aprendamos a preparar las comidas típicas de nuestra región?",
        respuestas: [
            { desc_respuesta: "Para que solo los cocineros profesionales las hagan.", esCorrecta: 0 },
            { desc_respuesta: "Para no olvidar nuestras tradiciones y cuidar nuestra cultura.", esCorrecta: 1 },
            { desc_respuesta: "Para venderlas a otros países y ganar dinero.", esCorrecta: 0 },
            { desc_respuesta: "Porque son más baratas que la comida de otros países.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Muy bien! Aprender a cocinar las comidas típicas nos ayuda a no olvidar nuestras tradiciones y a cuidar nuestra cultura. ¡Las recetas son parte de quiénes somos!</span>",
        retro_incorrecta: "<span>Es importante aprender las recetas típicas para no olvidar nuestras tradiciones y cuidar nuestra cultura. La comida nos une y nos recuerda de dónde venimos.</span>"
    },
    {
        desc_pregunta: "¿Cuál bebida tradicional colombiana se hace con maíz y era muy importante para los indígenas?",
        respuestas: [
            { desc_respuesta: "El aguardiente.", esCorrecta: 0 },
            { desc_respuesta: "La chicha.", esCorrecta: 1 },
            { desc_respuesta: "El ron.", esCorrecta: 0 },
            { desc_respuesta: "La malteada.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Correcto! La chicha es una bebida muy antigua hecha con maíz. Los indígenas la preparaban y la tomaban en sus fiestas y celebraciones especiales.</span>",
        retro_incorrecta: "<span>La chicha es una bebida tradicional hecha con maíz que los indígenas colombianos preparaban desde hace mucho tiempo. Es parte importante de nuestra historia.</span>"
    },
    {
        desc_pregunta: "¿Cómo puede la comida típica de un lugar atraer a los visitantes?",
        respuestas: [
            { desc_respuesta: "Haciendo que los visitantes no quieran ir.", esCorrecta: 0 },
            { desc_respuesta: "La comida no tiene nada que ver con los visitantes.", esCorrecta: 0 },
            { desc_respuesta: "Invitando a las personas a probar los sabores y conocer las tradiciones del lugar.", esCorrecta: 1 },
            { desc_respuesta: "Vendiendo comida de otros países en el mercado.", esCorrecta: 0 }
        ],
        retro_correcta: "<span>¡Excelente! La comida típica atrae visitantes porque quieren probar los sabores únicos y conocer las tradiciones de cada lugar. ¡La comida también es cultura!</span>",
        retro_incorrecta: "<span>La comida típica de un lugar invita a los visitantes a probar sabores nuevos y conocer las tradiciones locales. ¡La comida es una parte muy importante de la cultura!</span>"
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
    $(".opcion"+clase).attr("style","color: #FFF; background: #29B6F6;");
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
