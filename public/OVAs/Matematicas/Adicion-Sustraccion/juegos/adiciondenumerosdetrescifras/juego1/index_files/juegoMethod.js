

var respuestasn=[245,324,135,224,534,142,226,261,432,167];
var numtabla = 1;
var pos1 =0;
var pos2 =1;

$(document).ready(function() {
		
		$('img').attr('draggable','false');
		$('a').attr('draggable','false');


		 $(".repro_audio4").click(function( ) {
		    pausar();				 
		   var audio = $("#audio4");
		   audio.get(0).play();
		});			


		 $(".repro_audio5").click(function( ) {
		    pausar();				 
		   var audio = $("#audio5");
		   audio.get(0).play();
		});	

		$('.solo_numero').keyup(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');
          });	

	
		$('.tabla').attr('src','img/tabla'+numtabla+'.png');
});	

		



var arreglo1=new Array();
var arreglo2=new Array();
var num1,num2,num3,nums1 =0;
var num4,num5,num6,nums2 =0;

function verificar(id){
	
	arreglo1[id]=$('#'+id).val();
	var contador =0;

	num1=$('#c1').val();
	num2=$('#d1').val();
	num3=$('#u1').val();
	nums1 = num1+''+num2+''+num3;

	num4=$('#c2').val();
	num5=$('#d2').val();
	num6=$('#u2').val();
	nums2 = num4+''+num5+''+num6;	

	for(var item in arreglo1){
		if(arreglo1[item]!=""){
			contador++;
		}
	}
	if(contador==6){

		if(nums1 == respuestasn[pos1] && nums2 == respuestasn[pos2]){

			
			$('#alerta').attr('src','img/alerta2.png');
			$('#alerta').attr('style','display:block');
			reproducionSonido('sonidos/alerta2.mp3');
			setTimeout(function(){},2500);
			setTimeout(function(){
				cambioMensaje('#alerta');
				cambiarestilo();
			},1500);
			$('.resul').removeAttr('disabled');			
			$('.sum').attr('disabled','true');
			$('.sum').attr('style','color:green !important');
		}
		else{
				
			$('.sum').attr('style','color:red !important');		
			$('#alerta').attr('src','img/alerta1.png');
			$('#alerta').attr('style','display:block');
			reproducionSonido('sonidos/alerta1.mp3');
			setTimeout(function(){
				$('.sum').val('');
				$('.sum').attr('style','color:black !important');
				cambioMensaje('#alerta');
			},1500);				
			arreglo1=new Array();
		}

	}
}

function verificardos(id){
	arreglo2[id]=$('#'+id).val();
			var contador1 =0;

			for(var item1 in arreglo2){
				if(arreglo2[item1]!=""){
					contador1++;
				}
			}

		 if(contador1==3){
		 	$('.botonevaluar').attr('style','display:block');		 		
		 }
}


function comprueba(){

		
	var num7=$('#c3').val();
	var num8=$('#d3').val();
	var num9=$('#u3').val();
	var numres = num7+''+num8+''+num9;


	if (num7==''|| num8==''|| num9=='') {

			$('#alerta').attr('src','img/alerta3.png');
			$('#alerta').attr('style','display:block');
			reproducionSonido('sonidos/alerta2.mp3');
			setTimeout(function(){
				cambioMensaje('#alerta');
				cambiarestilo();
			},1500);

	}else{

			var resulta = parseInt(nums1) + parseInt(nums2);

				if(numres == resulta){

				$('.resul').attr('style','color:green !important');	
				$('#mensaje').attr('src','img/correcto.png');
				$('#mensaje').attr('style','display:block');	
				setTimeout(function(){
					cambioMensaje('#mensaje');
					numtabla++;
					pos1=parseInt(pos1)+2;
					pos2=parseInt(pos2)+2;
					$('.tabla').attr('src','img/tabla'+numtabla+'.png');
					reiniciarvar(1);
					finalizarGano(numtabla);
				},1500);
				reproducionSonido('sonidos/pasanivel.wav');	
			}
			else{
				
				var vidas = $('#vidas').val();
				$('#vidas').val(vidas-1);
				validarVidas();	
				$('.resul').attr('style','color:red !important');							
				$('#mensaje').attr('src','img/incorrecto.png');
				$('#mensaje').attr('style','display:block');				 		
				setTimeout(function(){					
					cambioMensaje('#mensaje');
					reiniciarvar(0);
					cambiarestilo();
				},1500);
				reproducionSonido('sonidos/nop.wav');
				
			}
		}
}

function reiniciarvar(n){
	$('.botonevaluar').attr('style','display:none');		
	arreglo1=new Array();
	arreglo2=new Array();

	if(n==1){
		$('.solo_numero').val('');
		$('.solo_numero').attr('style','color:black !important');
		$('.sum').removeAttr('disabled');			
		$('.resul').attr('disabled','true');
	}else{
		$('.resul').val('');
		$('.resul').attr('style','color:black !important');
	}
	
}

function cambiarestilo(){

		$('.resul').attr('style','animation: 1.5s pulse infinite !important; border: 3px solid #FF5722 !important; bottom: 8.0%;');
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
		for (var j = 1 ; j <= 3; j++) {

			script+=
			'$(".repro_audio'+j+'").mouseover(function( ) {pausar();'+	
			   'var audio = $("#audio'+j+'");'+
			   'audio.get(0).play();'+
			'});';
				
		}
		script += '</script>';	
		$('body').append(script);

reiniciar();


