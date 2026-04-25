/*INICIO -- Pantalla Ajustable*/

  $(document).ready(resizeContent);
  $(window).resize(resizeContent);
  function resizeContent() {
    var res = $(window).width()/(750 * 1);
    if($(window).width()<=750)
    {
    $("body").css({'zoom': res});
    }
  }

/*FIN -- Pantalla Ajustable*/

//-------------------------------------------------------------------//

/*INICIO -- Reproducir sonidos */

/*Los sonidos que se desee reproducir deben tener:
   1 - class="sonido_hover" o class="sonido_click"
   2 - data-sonido="sonidos/nom_audio.mp3" */

$(document).ready(function(){ 
    //Reproducir sonido en el evento mouseover
    $(".sonido_hover").mouseover(function() { 

      //Recibir data sonido
      pausar();
      var sonido = $(this).data('sonido');
      var rutasonido = sonido.split("/");
      var sonidor = "";

      if (rutasonido.length==2){sonidor = rutasonido[1].slice(0,-4);}
      else{sonidor = rutasonido[0].slice(0,-4);}
      
      $("#todosonido").append('<audio id="'+sonidor+'_sonido" src="'+sonido+'"></audio>');
        var audio = $("#"+sonidor+"_sonido");
        audio.get(0).play();

    })
    .mouseout(function() {

        $("#todosonido").html("");

    });

    //Reproducir sonido en el evento click
    $(".sonido_click").click(function() { 

      //Recibir data sonido
      pausar();
      var sonido = $(this).data('sonido');
      var rutasonido = sonido.split("/");
      var sonidor = "";

      if (rutasonido.length==2){sonidor = rutasonido[1].slice(0,-4);}
      else{sonidor = rutasonido[0].slice(0,-4);}

      $("body").append("<div id='todosonido'></div>");
      $("#todosonido").append('<audio id="'+sonidor+'_sonido" src="'+sonido+'"></audio>');
        var audio = $("#"+sonidor+"_sonido");
        audio.get(0).play();
      
    });

    $(".iconocerrar").click(function() {
        reproducionSonido('OVAs/Espanol/Cuento/sounds/system/close.mp3',2);
        setTimeout(function(){reproducionSonido('OVAs/Espanol/Cuento/sounds/system/background_music.mp3',1)},600); 
      });

});

//Función que reproduce cualquier sonido
//si el parametro repeat es 1 es porque se quiere que se repita de lo contrario solo se reproduce una vez
//Si el parametro es 0, es porque el audio se reporducirá automaticamente mediante un autoplay
function reproducionSonido(src,repeat){
    
    $('#todosonido').html('');

    if(repeat==1){
        $('#todosonido').append('<audio id="au1" src="'+src+'" preload="auto" autoplay></audio>');
    }
    else{
       $('#todosonido').append('<audio id="sonido" preload="auto" src=\"'+src+'\"\/>');
    }

    $('#sonido').get(0).play();
    
}
//Fin

//Función para detener el audio
function pausar(){

     $("audio").trigger('pause'); // Stop playing
     $("audio").prop('currentTime', 0) ; // Reset time
    
}
//Fin
     
/*FIN -- Reproducir sonido*/

//-------------------------------------------------------------------//

/*INICIO -- Mostrar imagenes */

/*Las imagenes que se vayan a visualizar en cada diapositiva deberan tener:
   1 - class="animar"
   2 - data-tiempo="5000" 
   3 - data-tipo="show" o data-tipo="hide" (show para visualizar y hide para ocultar)
   4 - id="nom_id"*/

var set=[];

var contador =0; 

function animar(tab)
{       
  $(tab+" .animar").removeAttr("style");
 
  
  $(tab+" .animar").each(function(){

    var miid = $(this).attr("id");
    var tiempo = $(this).attr("data-tiempo");
    var tipo = $(this).attr("data-tipo");

    var tiempo2 = $(this).attr("data-tiempo2");
    var tipo2 = $(this).attr("data-tipo2");

    if(tipo=='show')
    {
      set[contador]=setTimeout(function(){$('#'+miid).show();},tiempo);
      //set.push(setTimeout(function(){$('#'+miid).show();},tiempo)); 
    }
    if(tipo2=='hide')
    {
      set[contador]=setTimeout(function(){$('#'+miid).hide();},tiempo2);
      //set.push(setTimeout(function(){$('#'+miid).hide();},tiempo2));   
    } 
    contador++;        
  });
}

$(".siguiente").click(function() {
  var href=$(this).parent().attr("href");
  for (var i = 0; i <= contador; i++) {
    
     clearTimeout(set[i]);
  }
  //set.length=0;
  animar(href);
});

$(".antes").click(function() {
  var href=$(this).parent().attr("href");
  for (var i = 0; i <= contador; i++) {
    clearTimeout(set[i]);
  }
  //set.length=0;
    animar(href);
  });

animar("#tab1");
     
/*FIN -- Mostrar imagenes*/