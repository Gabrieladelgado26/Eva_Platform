var pos1 =0;
var pos2=1;
var tabla=1;
/**
* Función que se ejecuta al arrastrar el elemento. 
**/
function start(e,respuesta) {
    e.dataTransfer.effecAllowed = 'move'; // Define el efecto como mover (Es el por defecto)
    e.dataTransfer.setData("Text", e.target.id); // Coje el elemento que se va a mover
    e.target.style.opacity = '0.4'; 
}

/**
* Función que se ejecuta se termina de arrastrar el elemento. 
**/
function end(e){
    e.target.style.opacity = ''; // Restaura la opacidad del elemento           
    e.dataTransfer.clearData("Data");           
}

/**
* Función que se ejecuta cuando un elemento arrastrable entra en el elemento desde del que se llama. 
**/
function enter(e,respuesta) {
    return true;
}

/**
* Función que se ejecuta cuando un elemento arrastrable esta sobre el elemento desde del que se llama. 
* Devuelve false si el objeto se puede soltar en ese elemento y true en caso contrario.
**/
function over(e) {
    if (e.target.className == "cajavalor" || e.target.className == "cajavalora")
        return false;
    else
    return true;
}

var numero1 ="";
var numero2 ="";

function drop(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
    var src=document.getElementById(ea).src;
    var padre=e.target.id;
   	$('#'+padre).attr('style','background-image:url('+src+');');
   	var midata=$('#'+ea).data('numero');
   	$('#'+padre).attr('data-num',midata);
    

   	var contador=0;

   	$(".cajavalor").each(function(){

		var auxiliar=parseInt($(this).attr("data-num"));
		 if(!isNaN(auxiliar)){
	  		 contador++; 	  		 
		 } 
	});

   	var respuestas =[289,175,396,224,478,356,369,215,286,134];

   	if(contador==6){

   		var cuenta =1;

		$(".cajavalor").each(function() {
			if(cuenta<=3){
				numero1+=$(this).attr('data-num');
			}
			else{
				numero2+=$(this).attr('data-num');
			}
			cuenta++;
		});   	
		
   		if(numero1== respuestas[pos1] && numero2 == respuestas[pos2])
   		{	

   			alertas('alerta2','#alerta');	 				
   			alertas('res1b','.respuesta1');		 
   			reproducionSonido('sonidos/alerta.mp3');
			setTimeout(function(){
				cambioMensaje('#alerta');
				cambioMensaje('.respuesta1');
			},2000);	   			
			$('.cajavalor').removeAttr('ondrop');
			$(".cajavalora").attr('ondrop','return drop2(event)');
			$('.botonevaluar').attr('style','display:block');

   		}else{

   			alertas('alerta1','#alerta');
   			alertas('res1m','.respuesta1');	
   			reproducionSonido('sonidos/alerta1.mp3');
			setTimeout(function(){
				cambioMensaje('#alerta');
				cambioMensaje('.respuesta1');
				limpiar(0); 
			},2000);						
			numero2="";
   			numero1="";
   			contador=0;
   		}	
   	}


}

var contar=0;
function drop2(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
    var src=document.getElementById(ea).src;
    var padre=e.target.id;
   	$('#'+padre).attr('style','background-image:url('+src+'); z-index:5;');
   	var midata=$('#'+ea).data('numero');
   	$('#'+padre).attr('data-num',midata);   	

   	$(".cajavalora").each(function(){

		var auxiliar=parseInt($(this).attr("data-num"));
		 if(!isNaN(auxiliar)){
	  		 contar++; 
		 } 
	});

 }


function comprueba(id)
{		

		var numero3="";
		$(".cajavalora").each(function() {
			
			numero3+=$(this).attr('data-num');
		}); 

		var resulta = parseInt(numero1)-parseInt(numero2) 
	
	if(contar<=3){

		alertas('alerta3','#alerta');
		reproducionSonido('sonidos/alerta.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);

	}
	else{
		if(resulta==numero3){
			alertas('res2b','.respuesta2');	
			alertas('correcto','#mensaje');	
			setTimeout(function(){
				pos1 = parseInt(pos1)+2;
				pos2 = parseInt(pos2)+2;
				tabla++;
				$('.cajavalor').attr('ondrop','return drop(event)');
   				$(".cajavalora").removeAttr('ondrop');
				$('.resta').attr('src','img/resta'+tabla+'.png');
				$('.botonevaluar').attr('style','display:none');
				cambioMensaje('.respuesta1');
				cambioMensaje('.respuesta2');
				limpiar(0);
			},1500);
			setTimeout(function(){cambioMensaje('#mensaje')},1500);
			setTimeout(function(){finalizarGano(tabla)},1500);
			reproducionSonido('sonidos/pasanivel.wav');	
		}
		else{
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();
			alertas('res2m','.respuesta2');	
			
			alertas('incorrecto','#mensaje');				 		
			setTimeout(function(){
				cambioMensaje('#mensaje');
				cambioMensaje('.respuesta2');
				limpiar(1);
			},2000);
			reproducionSonido('sonidos/nop.wav');
		}			
	}
}

function alertas(img,objeto){
	$(objeto).attr('src','img/'+img+'.png');
	$(objeto).attr('style','display:block');	
}

function limpiar(num)
{		
	if(num!=1){
		$(".cajavalor").each(function() {
			$(this).attr('data-num','');
		   	$(this).removeAttr('style'); 
		   			
		});
		numero2="";
		numero1="";
		contador=0;

	}
		$(".cajavalora").each(function() {
   			$(this).attr('data-num','');
		   	$(this).removeAttr('style'); 		   			
		});
		numero3="";
   		contar=0;

		
	
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

 function finalizarGano(pregun){
 	if (pregun==6){

 		alertas('Ganaste','#mensaje2');		 		
 		$('.complementos').attr('style','display:none');
 		reproducionSonido('sonidos/ganaste.mp3');
 		$('#redir').attr('href','../menu.html');
 	}	
}
 function finalizarPerdio(){

 	alertas('Intentalootravez','#mensaje2');			 		
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

		$('.cajavalora').removeAttr('ondrop');
		$('.resta').attr('src','img/resta'+tabla+'.png');
	
});	
