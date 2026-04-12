var pintadas=0;
var objeto='';
function pintar(id,obj)
{
	if($("#"+obj+id).hasClass('pintada')){		
		$("#"+obj+id).removeClass('pintada');
		$("#"+obj+id).attr("src","img/"+obj+".png");
		pintadas--;
	}
	else{
		$("#"+obj+id).attr("class",""+obj+id+" pintada");
		$("#"+obj+id).attr("src","img/"+obj+"gris.png");
		pintadas++;
	}
	objeto=obj;
}

function comprueba(id)
{	
	var respuesta=$("#respuesta"+id).val();
	var valor=$("#valor"+id).val();
	var totalImg=$("#total"+id).val();
	var img=totalImg-valor;

	if(pintadas==0 ){

		$('#alerta').attr('src','img/alerta1.png');
		$('#alerta').attr('style','display:block');
		reproducionSonido('sonidos/colorea.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);

	}
	else{
		if(respuesta==''||respuesta==0){
			$('#alerta').attr('src','img/alerta.png');
			$('#alerta').attr('style','display:block');
			reproducionSonido('sonidos/escribe.mp3');
			setTimeout(function(){cambioMensaje('#alerta')},1500);

		}	
		else{
			if(valor==respuesta && pintadas==img){
				limpiar();
				$('#mensaje').attr('src','img/correcto.png');
				$('#mensaje').attr('style','display:block');	
				setTimeout(function(){$("#sig"+id).click();},1500);
				reproducionSonido('sonidos/pasanivel.wav');	
				setTimeout(function(){cambioMensaje('#mensaje')},1500);
				setTimeout(function(){finalizarGano(id)},1500);
				
			}
			else{
				var vidas = $('#vidas').val();
				$('#vidas').val(vidas-1);
				validarVidas();
				$('#mensaje').attr('src','img/incorrecto.png');
				$('#mensaje').attr('style','display:block');	
				reproducionSonido('sonidos/nop.wav');
				limpiar(id);
				setTimeout(function(){cambioMensaje('#mensaje')},1500);
			}
		}	
	}
}
function limpiar(id)
{
	pintadas=0;
	$("#respuesta"+id).val('');
	var totalImg=$("#total"+id).val();
	for (var i = 1; i <= totalImg; i++) {
		$("#"+objeto+i).attr("src","img/"+objeto+".png");
		$("#"+objeto+i).removeClass('pintada');
	}
	objeto='';
}
function validarVidas(){

		if($('#vidas').val()==3){

			$('.vidas3').attr('src','img/juegovidas.png');

		}else if($('#vidas').val()==2){

			$('.vidas3').attr('src','img/vida2.png');

		}else if($('#vidas').val()==1){

			$('.vidas3').attr('src','img/vida1.png');

		}else if($('#vidas').val()==0){

			$('.vidas3').attr('src','img/sinvidas.png');			
			 setTimeout(function(){ finalizarPerdio();},1500);
		}

}


function cambioMensaje(nom){
	$(nom).attr('style','display:none');

}

 function cargarPregunta(preg){
 	var preguntaOcultar = parseInt(preg)-1;
 	$('#img'+preguntaOcultar).attr('style','display:none');
 	$('#img'+preg).attr('style','display:block');
 	$('#txt_valor').val('');
 }

 function finalizarGano(pregun){
 	if (pregun==5){
		$('#mensaje2').attr('style','display:block');
		$('#mensaje2').attr('src','img/Ganaste.png');		 		
 		$('.complementos').attr('style','display:none');
 		reproducionSonido('sonidos/ganaste.mp3');
 		$('#redir').attr('href','../menu.html');
 	}
}
 function finalizarPerdio(){

	$('#mensaje2').attr('style','display:block');
	$('#mensaje2').attr('src','img/Intentalootravez.png');		 		
	$('.complementos').attr('style','display:none');
	reproducionSonido('sonidos/intentalo.mp3');
	$('#redir').attr('href','../menu.html');
}



function reiniciar(){
      	
  	$('#vidas').val('3');
   	$('#vida').attr('src','img/juegovidas.png');
}

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

var script = '<script>';
		for (var j = 3 ; j <= 5; j++) {

			script+=
			'$(".repro_audio'+j+'").mouseover(function( ) {pausar();'+	
			   'var audio = $("#audio'+j+'");'+
			   'audio.get(0).play();'+
			'});';
				
		}
		script += '</script>';	
		$('body').append(script);

reiniciar();

$(document).ready(function() {
		
		$('img').attr('draggable','false');
		$('a').attr('draggable','false');


		 $(".repro_audio1").click(function( ) {
		    pausar();				 
		   var audio = $("#audio1");
		   audio.get(0).play();
		});			


		 $(".repro_audio2").click(function( ) {
		    pausar();				 
		   var audio = $("#audio2");
		   audio.get(0).play();
		});	

		$('.solo_numero').keyup(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');
          });		
	
});	
