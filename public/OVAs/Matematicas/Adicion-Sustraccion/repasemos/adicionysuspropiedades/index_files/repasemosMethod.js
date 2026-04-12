var respuestas = [1,3,2], validar=0;

function comprueba(id)
{
  if(id==respuestas[validar]){
    $('#mensaje').attr('src','img/felicitaciones.png');
    $('#mensaje').attr('style','display:block');
    reproducionSonido('audio/felicitaciones.mp3'); 
    setTimeout(function(){cambioMensaje()},1500);
    validar++;
    setTimeout(function(){$('.operacion').attr('src','img/operacion'+(validar+1)+'.png')},1500);

    if(validar==3){
      $('#mensaje').attr('style','display:none');
      $('#final').attr('style','display:block');
      reproducionSonido('audio/logro.mp3');
      $('#complementos').attr('style','display:none');
    }
  }
  else{
    $('#mensaje').attr('src','img/intenta.png');
    $('#mensaje').attr('style','display:block'); 
    reproducionSonido('audio/intentalo.wav'); 
    setTimeout(function(){cambioMensaje()},1500);          
  }
}

function regresar(){
  $('#complementos').attr('style','display:table');
  validar=0;
  $('.operacion').attr('src','img/operacion'+(validar+1)+'.png');
  $('#final').attr('style','display:none');
}

function cambioMensaje(){
  $('#mensaje').attr('style','display:none');
}


$(".repro_audio4").mouseover(function( ) {pausar();
      var audio = $("#audio4");
      audio.get(0).play();
});

$(".repro_audio5").mouseover(function( ) {pausar();
      var audio = $("#audio5");
      audio.get(0).play();
});

$(".repro_audio6").mouseover(function( ) {pausar();
      var audio = $("#audio6");
      audio.get(0).play();
});

$(".repro_audio7").mouseover(function( ) {pausar();
      var audio = $("#audio7");
      audio.get(0).play();
});

function pausar(){

         $("audio").trigger('pause'); // Stop playing
         $("audio").prop('currentTime', 0) ; // Reset time
        
    }

function reproducionSonido(src){
		pausar();		
		$('#audio_men').html('');
		$('#audio_men').append('<audio id="audio0" name="audio0" preload="" src=\"'+src+'\"\/>');
		$('#audio0').trigger('play');
		
}

$(document).ready(function() {

    var mouses=0;
    $('#inicio').mouseover(function( ){
       
        if(mouses==0)
        {
            iniciar();
        }
        mouses++;       
            
       });
}); 
