var seleccionado=0;
var tab='';
function seleccion(id,letra)
{
	$('#num'+letra+id).attr('style','display:block;');
	$('#numero'+letra+id).attr("class","numero"+id+" pintada");
	for (var i = 1; i <= 9; i++) {
		if(i!=id){
			$('#num'+letra+i).attr('style','display:none');
			$('#numero'+letra+i).removeClass("pintada");
		}
	}
	seleccionado=id;
	tab=letra;
	$('.botonevaluar').attr('style','display:block');
}

function comprueba(id)
{	
	$('.botonevaluar').attr('style','display:none');
	var valor=$('#valor'+id).val();
	
		if(valor==seleccionado){
			$('#mensaje').attr('src','img/correcto.png');
			$('#mensaje').attr('style','display:block');
			setTimeout(function(){$('#sig'+id).click()},1500);
			reproducionSonido('sonidos/pasanivel.wav');		
			setTimeout(function(){cambioMensaje('#mensaje')},1500);
			setTimeout(function(){finalizarGano(id)},1500);
			
		}
		else{
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();
			limpiar();
			$('#mensaje').attr('src','img/incorrecto.png');
			$('#mensaje').attr('style','display:block');
			reproducionSonido('sonidos/nop.wav');				 		
			setTimeout(function(){cambioMensaje('#mensaje')},1500);
			
		}		
	
}
function limpiar()
{
	for (var i = 1; i <= 9; i++) {
		$('#num'+tab+i).attr('style','display:none');
		$('#numero'+tab+i).removeClass("pintada");
	}
	seleccionado=0;
	tab='';
}
function desaparecer(id,obj)
{
	if ($('#'+id).hasClass("cambio")) {
		$('#'+id).attr('src','img/'+obj+'1.png');
		$('#'+id).removeClass('cambio');
	}
	else{
		$('#'+id).attr('src','img/'+obj+'2.png');
		$('#'+id).addClass('cambio');
	}
	
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
 	if (pregun==5) {
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
		

		 $(".repro_audio6").click(function( ) {
		    pausar();				 
		   var audio = $("#audio6");
		   audio.get(0).play();
		});			


		 $(".repro_audio7").click(function( ) {
		    pausar();				 
		   var audio = $("#audio7");
		   audio.get(0).play();
		});		

		 $(".repro_audio8").click(function( ) {
		    pausar();				 
		   var audio = $("#audio8");
		   audio.get(0).play();
		});	

		 $(".repro_audio9").click(function( ) {
		    pausar();				 
		   var audio = $("#audio9");
		   audio.get(0).play();
		});	

		 $(".repro_audio10").click(function( ) {
		    pausar();				 
		   var audio = $("#audio10");
		   audio.get(0).play();
		});	

		 $(".repro_audio11").click(function( ) {
		    pausar();				 
		   var audio = $("#audio11");
		   audio.get(0).play();
		});	
	
});	
