var numeroD='', numeroU='', numerosD='', numerosU='', productosn='';
numerosD=['1','2','3','4','5','6','7','8'];
numerosU=['1','2','3','4','5','6','7','8','9'];

var productos=[1,2,3,4,5];
var producto=0;

function cargar()
{
	numeroD=shuffle(numerosD);
	numeroU=shuffle(numerosU);
	asignarNumeros();
}

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

	var valorD=0,valorU=0,valorTotal=1;
	function asignarNumeros()
	{
		for (var i = 0; i <= 9; i++) {
			valorTotal=parseInt(numeroD[0])+parseInt(numeroU[i]);
			if (valorTotal<=9) {
				$('#num2f1').attr('src','img/'+numeroD[0]+'.png');
				$('#num2f2').attr('src','img/'+numeroU[i]+'.png');
				$('#numc2f1').attr('src','img/'+numeroD[0]+'.png');
				$('#numc2f2').attr('src','img/'+numeroU[i]+'.png');
				valorU=numerosU[i];
				valorD=numerosD[0];
				break;
			}
		}
	}


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

		cargar();
		asignarNumeros();
		productosn=shuffle(productos);
		$('#producto').attr('src','img/p'+productosn[producto]+'.png');

		
	
});	

var incremento=0;
function comprueba(id)
{

	var resultadoU=$('#valorUnidades').val();
	var resultadoD=$('#valorDecenas').val();
	if(resultadoU=='' || resultadoD==''){
		
		$('#alerta').attr('src','img/alerta.png');
		$('#alerta').attr('style','display:block');
		reproducionSonido('sonidos/alerta.mp3');
		setTimeout(function(){cambioMensaje('#alerta')},1500);
	}
	else{
		if(resultadoD==1&&resultadoU==valorTotal){
			$('.botonevaluar').attr('style','display:none');
			$('#mensaje').attr('src','img/correcto.png');
			$('#mensaje').attr('style','display:block');			
			setTimeout(function(){
				limpiar();
				cambioMensaje('#mensaje');
				producto++;
				$('#producto').attr('src','img/p'+productosn[producto]+'.png');
				cargar();
				$('.botonevaluar').attr('style','display:block');
			},1500);			
			reproducionSonido('sonidos/pasanivel.wav');	
			incremento++;
			setTimeout(function(){finalizarGano(incremento)},1500);
		}
		else{
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();
			limpiar();
			$('#mensaje').attr('src','img/incorrecto.png');
			$('#mensaje').attr('style','display:block');				 		
			setTimeout(function(){cambioMensaje('#mensaje')},1500);
			reproducionSonido('sonidos/nop.wav');
		}		
	}
}

function limpiar()
{
	$('#valorUnidades, #valorDecenas').val('');
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
	$('#preg').val('1');
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
			'$(".repro_audio'+j+'").mouseover(function() {pausar();'+	
			   'var audio = $("#audio'+j+'");'+
			   'audio.get(0).play();'+
			'});';
				
		}
		script += '</script>';	
		$('body').append(script);

reiniciar();


