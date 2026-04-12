var seleccionada=0;
var tab='';
function pintar(id,letra)
{	
	if (id==1){
		$('#preg'+letra+'1').attr("class","propiedadasociativa pintada");
		$('#preg'+letra+'2').removeClass("pintada");
		$('#preg'+letra+'3').removeClass("pintada");
		$('.botonevaluar').attr('style','display:block');
	}
	else if(id==2){
		$('#preg'+letra+'1').removeClass("pintada");
		$('#preg'+letra+'2').attr("class","propiedadconmutativa pintada");
		$('#preg'+letra+'3').removeClass("pintada");
		$('.botonevaluar').attr('style','display:block');
	}
	else{
		$('#preg'+letra+'1').removeClass("pintada");
		$('#preg'+letra+'2').removeClass("pintada");
		$('#preg'+letra+'3').attr("class","propiedadmodulativa pintada");		
		$('.botonevaluar').attr('style','display:block');
	}
	tab=letra;
	seleccionada=id;
}

function comprueba(id)
{
	$('.botonevaluar').attr('style','display:none');
	var respuesta=$('#respuesta'+id).val();
	if(seleccionada==0){
		
		$('#alerta').attr('src','img/alerta.png');
		$('#alerta').attr('style','display:block');
		reproducionSonido('sonidos/alerta.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);

	}
	else{
		if(seleccionada==respuesta){
			$('#mensaje').attr('src','img/correcto.png');
			$('#mensaje').attr('style','display:block');
			seleccionada=0;
			setTimeout(function(){$('#sig'+id).click()},1500);	
			setTimeout(function(){cambioMensaje('#mensaje')},1500);
			setTimeout(function(){finalizarGano(id)},1500);
			reproducionSonido('sonidos/pasanivel.wav');	
		}
		else{
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();
			$('#mensaje').attr('src','img/incorrecto.png');
			$('#mensaje').attr('style','display:block');
			reproducionSonido('sonidos/nop.wav');				 		
			setTimeout(function(){cambioMensaje('#mensaje')},1500);			
			limpiar();
		}		
	}
}
function limpiar(){
	
	$('#preg'+tab+'1').removeClass("pintada");
	$('#preg'+tab+'2').removeClass("pintada");
	$('#preg'+tab+'3').removeClass("pintada");
	letra='';
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
 	if (pregun==4) {
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

function cambiar(num){

	if(num==1){
		$('#at1').attr('src','img/atun2.png');	
	}else{
		$('#at1').attr('src','img/atun3.png');
	}

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
		for (var j = 3 ; j <= 8; j++) {

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

		
	
});	
