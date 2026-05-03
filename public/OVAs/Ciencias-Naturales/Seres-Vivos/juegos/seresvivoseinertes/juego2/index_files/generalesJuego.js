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
  setTimeout(function(){$("#modalslider").modal({show:true})},1000);

/*FIN -- Pantalla Ajustable*/

//funcion de 1,2,3 para el inicio




function inicioJuego()
{
  reproducionSonido('sonidos/321.wav');
  $('#3').attr('style','display:block');
  setTimeout(function(){$('#3').attr('style','display:none')},1000);
  setTimeout(function(){$('#2').attr('style','display:table')},1000);
  setTimeout(function(){$('#2').attr('style','display:none')},2000);
  setTimeout(function(){$('#1').attr('style','display:table')},2000);
  setTimeout(function(){$('#1').attr('style','display:none')},3000);
  setTimeout(function(){$('#juega').attr('style','display:table')},3000);
  setTimeout(function(){$('#juega').attr('style','display:none')},4000);
  setTimeout(function(){$('#general').removeAttr('style')},4000);
}
//-------------------------------------------------------------------//

/*INICIO -- Cambio de imagenes */

/*Toda imagen que se desee reemplazar mediante el evento mouseover
  debera tener el mismo nombre de la primera imagen agregando al final un 2*/
$(document).ready(function(){ 

   $("#numeros").append('<img id="3" class="numeros animacion" src="img/tres.png" style="display:none">'+
                      '<img id="2" class="numeros animacion" src="img/dos.png" style="display:none">'+
                      '<img id="1" class="numeros animacion" src="img/uno.png" style="display:none">'+
                      '<img id="juega" class="juega animacion" src="img/juega.png" style="display:none">');

    $(".cambiarImagen").mouseover(function() { 

           var src = $(this).attr('src');
           var reemplazada=src.replace(/.png/, '');
            $(this).attr("src", reemplazada+'2.png');
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
            var src2 = $(this).attr('src');
            var reemplazada2=src2.replace(/2.png/, '');
            $(this).attr("src", reemplazada2+'.png');
            $("#todosonido").html("");
     });

    $('img').attr('draggable','false');
    $('a').attr('draggable','false');
    $('.arras').attr('draggable','true');

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

});

//Función que reproduce cualquier sonido
function reproducionSonido(src){
    
    $('#todosonido2').html('');
    $('#todosonido2').append('<audio id="sonido" src=\"'+src+'\"\/>');
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

/* INICIO -- Funciones generales para los juegos */

// Función que permite Validar la vidas del juego */
function validarVidas(){

  if($('#vidas').val()==3){

      $('#vida').attr('src','img/vidas3.png');

  }else if($('#vidas').val()==2){

      $('#vida').attr('src','img/vidas2.png');

  }else if($('#vidas').val()==1){

      $('#vida').attr('src','img/vidas1.png');

  }else if($('#vidas').val()==0){

      $('#vida').attr('src','img/sinvidas.png');          
       setTimeout(function(){ finalizarPerdio();},1500);
  }

}
//Fin

//Funcion que reinica las vidas del juego
function reiniciar(){
    
    $('#vidas').val('3');
    $('#vida').attr('src','img/vidas3.png');

}
//Fin

//Función array aleatorio
function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
//Fin

//Función para indicar que el juego finalizó con éxito
function finalizarGano(pregun,totales){

    if(pregun  == totales){
        $('#mensaje2').attr('style','display:block');
        $('#mensaje2').attr('src','img/ganaste.png');               
        $('#complementos').attr('style','display:none');
        reproducionSonido('sonidos/ganaste.mp3');
        $('#redir').attr('href','../menu.html');
    }

 }
 //Fin

//Función para indicar que el juego no finalizó con éxito
 function finalizarPerdio(){

        $('#mensaje2').attr('style','display:block');
        $('#mensaje2').attr('src','img/intentalo.png');              
        $('#complementos').attr('style','display:none');                
        reproducionSonido('sonidos/intentalo.mp3');
        $('#redir').attr('href','../menu.html');

 }
 //Fin

 /*FIN -- Funciones generales para los juegos*/

//-------------------------------------------------------------------//

 /*INICIO -- alertas */

function mostrarAlertas(rutaImagen, tiempo){
  $('#mensaje').attr('src',rutaImagen);
  $('#mensaje').attr('style','display:block');            
  setTimeout(function(){$('#mensaje').attr('style','display:none');},tiempo);
}
     
/*FIN -- alertas*/