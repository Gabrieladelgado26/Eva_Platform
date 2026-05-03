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

/*INICIO -- Cambio de imagenes */

/*Toda imagen que se desee reemplazar mediante el evento mouseover
  deberá tener el mismo nombre de la primera imagen agregando al final un 2*/
$(document).ready(function(){ 

    $(".cambiarImagen").mouseover(function() { 
           var src = $(this).attr('src');
           var reemplazada=src.replace(/.png/, '');
               $(this).attr("src", reemplazada+'_hover.png');

    })
    .mouseout(function() {
            var src2 = $(this).attr('src');
            var reemplazada2=src2.replace(/_hover.png/, '');
               $(this).attr("src", reemplazada2+'.png');
     });

      $(".cambiarImagengif").mouseover(function() { 

           var src = $(this).attr('src');
           var reemplazada=src.replace(/.gif/, '');
          $(this).attr("src", reemplazada+'_hover.png');

          var vid = document.getElementById("sonido");
          vid.volume = 0.1;
          var sonido = $(this).data('sonido');
          var rutasonido = sonido.split("/");
          var sonidor = "";

          if (rutasonido.length==2){sonidor = rutasonido[1].slice(0,-4);}
          else{sonidor = rutasonido[0].slice(0,-4);}
          
          $("#todosonido2").append('<audio id="'+sonidor+'_sonido" src="'+sonido+'"></audio>');
            var audio = $("#"+sonidor+"_sonido");
            audio.get(0).play();
         

    })
    .mouseout(function() {
            var src2 = $(this).attr('src');
            var reemplazada2=src2.replace(/_hover.png/, '');
            $(this).attr("src", reemplazada2+'.gif');
            $("#todosonido2").html("");
            var vid = document.getElementById("sonido");
            vid.volume = 1.0;
     });

});
     
/*FIN -- Cambio de imagenes*/

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
        reproducionSonido('OVAs/Shared/sounds/system/close.mp3',2);
        //setTimeout(function(){reproducionSonido('OVAs/Ciencias-Naturales/Seres-Vivos/sounds/inicio.mp3',1)},600); 
        if($("#btnpausaplay").attr("title")=='Silenciar') setTimeout(function(){reproducionSonido('OVAs/Ciencias-Naturales/Seres-Vivos/sounds/system/background_music.mp3',1)},600); 
      });

});

//Función que reproduce cualquier sonido
//si el parametro repeat es 1 es porque se quiere que se repita de lo cntrario solo se eproduce una vez
function reproducionSonido(src,repeat){
    
    $('#todosonido').html('');

    if(repeat==1){
        $('#todosonido').append('<audio loop autoplay id="sonido" src=\"'+src+'\"\/>');
    }else{
       $('#todosonido').append('<audio id="sonido" src=\"'+src+'\"\/>');
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

//sonidos para las vistas y bajar el volumen del INICIO
/*pausar o reproducir sonido*/
function pausaplay(opcion)
{
  ruta=getRuta($("#btnpausaplay").attr("src"));
  if(opcion==0)
  {
    $("#btnpausaplay").attr("src", ruta+"menu_sound_mute.png");
    $("#btnpausaplay").attr("onclick", "pausaplay(1);");
    $("#btnpausaplay").attr("title", "Reproducir");
    pausar();
  }else if(opcion==1)
  {
    $("#btnpausaplay").attr("src", ruta+"menu_sound_play.png");
    $("#btnpausaplay").attr("onclick", "pausaplay(0);");
    $("#btnpausaplay").attr("title", "Silenciar");
    reproducionSonido('OVAs/Ciencias-Naturales/Seres-Vivos/sounds/system/background_music.mp3',1);
  }
}

function getRuta(str)
{
  sp=str.split("/");
  sp.pop();
  cadena="";
  if(sp.length==1)
  {
    cadena=sp[0]+"/";
  }else
  { 
    for (i = 0; i<sp.length; i++) 
    {
      cadena+=sp[i]+"/";
    }
  }
  return cadena;
}


