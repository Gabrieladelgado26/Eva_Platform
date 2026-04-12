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
    if ((e.target.className == "cajavalor"))
        return false;
    else
    return true;
}
var idd=1;
var idu=1;
var contadord=0;
var contadoru=0;
var texto='';
function drop(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
    texto=ea.split("-");
    if (idd<=9&&ea=="arrastrar-"+texto[1]+"-1"){
    	$("#objd"+texto[1]+idd).attr('style','display:table');	
		idd++; 
		contadord++;   
    }
    else if (idu<=9&&ea=="arrastrar-"+texto[1]){
    	$("#obju"+texto[1]+idu).attr('style','display:table');	
		idu++;
		contadoru++;
    }
    else{
    	$('#alerta').attr('src','img/alerta1.png');
		$('#alerta').attr('style','display:block');
		reproducionSonido('sonidos/maximo.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);
    }
    
}
function comprueba(id)
{	
	$('.botonevaluar').attr('style','display:none');
	var resultadod=$('#valord'+id).val();
	var resultadou=$('#valoru'+id).val();
	var var1 = $('#vd'+id).val();
	var var2 = $('#vu'+id).val();
	
	
	if(contadord==0&&contadoru==0 && var1==''&&var2==''){

		$('#alerta').attr('src','img/alerta.png');
		$('#alerta').attr('style','display:block');
		reproducionSonido('sonidos/alerta.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);
		setTimeout(function(){$('.botonevaluar').attr('style','display:block')},1500);

	}
	else if(contadord==0 && contadoru==0 ){
		$('#alerta').attr('src','img/alerta2.png');
		$('#alerta').attr('style','display:block');
		reproducionSonido('sonidos/alerta2.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);
		setTimeout(function(){$('.botonevaluar').attr('style','display:block')},1500);
		
	}
	else if(var1==''&&var2=='' ){
		$('#alerta').attr('src','img/alerta3.png');
		$('#alerta').attr('style','display:block');
		reproducionSonido('sonidos/alerta3.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);
		setTimeout(function(){$('.botonevaluar').attr('style','display:block')},1500);
	}

	else{

		if (resultadod==contadord&&resultadou==contadoru&&var1==resultadod && var2==resultadou) {
			correcto(id);
			setTimeout(function(){$('#sig'+id).click()},1500);
			setTimeout(function(){$('.botonevaluar').attr('style','display:block')},1500);
		}
		else{
			if (resultadod==contadord && resultadou==contadoru && (var1!=resultadod || var2!=resultadou)) {
				
					
					$('#alerta').attr('src','img/alerta3.png');
					setTimeout(function(){
						$('#alerta').attr('style','display:block');
						reproducionSonido('sonidos/alerta3.mp3');
					},1500);					
					setTimeout(function(){cambioMensaje('#alerta')},3000);
					$('#vd'+id).val('');
					$('#vu'+id).val('');
					setTimeout(function(){$('.botonevaluar').attr('style','display:block')},2500);
					incorrecto(0);
							

			} else if (var1==resultadod && var2==resultadou && (resultadod!=contadord || resultadou!=contadoru)) {			
				
				
					$('#vd'+id).attr('disabled','disabled');
					$('#vu'+id).attr('disabled','disabled');
					
					$('#alerta').attr('src','img/alerta2.png');
					setTimeout(function(){
						$('#alerta').attr('style','display:block');
						reproducionSonido('sonidos/alerta2.mp3');
					},1500);					
					setTimeout(function(){cambioMensaje('#alerta')},3000);
					setTimeout(function(){$('.botonevaluar').attr('style','display:block')},2500);
					incorrecto(1);
				
				
			} else {
				
				$('#vd'+id).val('');
				$('#vu'+id).val('');
				setTimeout(function(){$('.botonevaluar').attr('style','display:block')},1500);
				incorrecto(1);
			}
		}
		total= 0;		
	}
}
var colores=["#8BC34A","#E34740","#FFAB00","#64DD17"]
function cambiar(id)
{
	$('#d'+(id+1)).attr('style','background-image: url(img/fondo'+(id+1)+'.png);');
	$('#vd'+(id+1)).attr('style','background-color: '+colores[id-1]+' !important');
	$('#vu'+(id+1)).attr('style','background-color: '+colores[id-1]+' !important');
}

function correcto(id){

	$('#mensaje').attr('src','img/correcto.png');
	$('#mensaje').attr('style','display:block');
	reproducionSonido('sonidos/pasanivel.wav');	
	reiniciarVariables();			
	setTimeout(function(){cambioMensaje('#mensaje')},1500);
	setTimeout(function(){finalizarGano(id)},1500);
	cambiar(id);
}

function incorrecto(img){

			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();			
			$('#mensaje').attr('src','img/incorrecto.png');
			$('#mensaje').attr('style','display:block');
			reproducionSonido('sonidos/nop.wav');				 		
			setTimeout(function(){cambioMensaje('#mensaje')},1500);
			if (img==1) {
				limpiar();
				reiniciarVariables();
			}
	
}

function limpiar()
{
	for (var i = 1; i <= 9; i++) {
		$("#objd"+texto[1]+i).attr('style','display:none');	
		$("#obju"+texto[1]+i).attr('style','display:none');	
	}
}

function reiniciarVariables()
{
	idd=1;
	idu=1;
	contadord=0;
	contadoru=0;
	texto='';
}

function ocultarImg(valor,id)
{
	if (valor=="d"){
		$("#objd"+texto[1]+id).attr('style','display:none');
		idd--; 
		contadord--;  
	}	
	else if(valor=="u")	{
		$("#obju"+texto[1]+id).attr('style','display:none');
		idu--; 
		contadoru--;  
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
		for (var j = 4 ; j <= 9; j++) {

			script+=
			'$(".repro_audio'+j+'").click(function( ) {pausar();'+	
			   'var audio = $("#audio'+j+'");'+
			   'audio.get(0).play();'+
			'});';
				
		}
		script += '</script>';	
		$('body').append(script);

reiniciar();

$(document).ready(function() {
		
		 $(".solo_numero").click(function( ) {
		    $(this).removeAttr('disabled');
		});	
		


		$('img').attr('draggable','false');
		$('a').attr('draggable','false');
		$('.arrastra').attr('draggable','true');

		 $(".repro_audio1").mouseover(function( ) {
		    pausar();				 
		   var audio = $("#audio1");
		   audio.get(0).play();
		});			


		 $(".repro_audio2").mouseover(function( ) {
		    pausar();				 
		   var audio = $("#audio2");
		   audio.get(0).play();
		});		
		
		 $(".repro_audio3").mouseover(function( ) {
		    pausar();				 
		   var audio = $("#audio3");
		   audio.get(0).play();
		});	

		 $('.solo_numero').keyup(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');
          });
});	
