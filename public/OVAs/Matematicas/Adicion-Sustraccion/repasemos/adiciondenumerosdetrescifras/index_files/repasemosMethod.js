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
    if ((e.target.className == "cajavalor")||(e.target.className == "cajavalor2")||(e.target.className == "cajavalor3")||(e.target.className == "cajavalor4")||(e.target.className == "cajavalor5")||(e.target.className == "cajavalor6"))
        return false;
    else
    return true;
}

var id=0, id2=0, id3=0, id4=0, id5=0, id6=0;
var bottom=0, bottom2=0, bottom3=0, bottom4=0, bottom5=0, bottom6=0;
var eliminar=0,eliminar2=10,eliminar3=20;
function drop(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
	$("#d"+ea+"1").prepend('<img id="'+ea+id+'" style="width: 80%; bottom: '+bottom+'%; left: 10%; position: absolute;" src="img/anillo.png"/>');		
	id++;
	bottom+=5;

	if ($("#"+ea).hasClass("3")) {
		$("#"+ea).attr("id","elimina"+eliminar+'1');
		$("#elimina"+eliminar+'1').attr("style","display:none");
		eliminar++;
		var valor1=$("#v6").val();
		valor1--;
		$("#v6").val(valor1);
	}
	var valor=$("#v1").val();
	valor++;
	$("#v1").val(valor);
}
function drop2(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
	$("#d"+ea+"2").prepend('<img id="'+ea+id2+'" style="width: 80%; bottom: '+bottom2+'%; left: 10%; position: absolute;" src="img/anillo.png"/>');		
	id2++;
	bottom2+=5;

	if ($("#"+ea).hasClass("2")) {
		$("#"+ea).attr("id","elimina"+eliminar2+'2');
		$("#elimina"+eliminar2+'2').attr("style","display:none");
		eliminar2++;

		var valor1=$("#v5").val();
		valor1--;
		$("#v5").val(valor1);
	}
	var valor=$("#v2").val();
	valor++;
	$("#v2").val(valor);
}
function drop3(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
	$("#d"+ea+"3").prepend('<img id="'+ea+id3+'" style="width: 80%; bottom: '+bottom3+'%; left: 10%; position: absolute;" src="img/anillo.png"/>');		
	id3++;
	bottom3+=5;

	if ($("#"+ea).hasClass("1")) {
		$("#"+ea).attr("id","elimina"+eliminar3+'3');
		$("#elimina"+eliminar3+'3').attr("style","display:none");
		eliminar3++;

		var valor1=$("#v4").val();
		valor1--;
		$("#v4").val(valor1);
	}
	var valor=$("#v3").val();
	valor++;
	$("#v3").val(valor);
}

function drop4(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
	$("#d"+ea+"4").prepend('<img id="'+ea+'" class="id '+id4+' 1" style="width: 80%; bottom: '+bottom4+'%; left: 10%; position: absolute;" src="img/anillo.png" draggable="true" ondragstart="start(event)" ondragend="end(event)"/>');		
	id4++;
	bottom4+=5;

	var valor=$("#v4").val();
	valor++;
	$("#v4").val(valor);
}
function drop5(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
	$("#d"+ea+"5").prepend('<img id="'+ea+'" class="id '+id5+' 2" style="width: 80%; bottom: '+bottom5+'%; left: 10%; position: absolute;" src="img/anillo.png" draggable="true" ondragstart="start(event)" ondragend="end(event)"/>');		
	id5++;
	bottom5+=5;

	var valor=$("#v5").val();
	valor++;
	$("#v5").val(valor);
}
function drop6(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
	$("#d"+ea+"6").prepend('<img id="'+ea+'" class="id' +id6+' 3" style="width: 80%; bottom: '+bottom6+'%; left: 10%; position: absolute;" src="img/anillo.png" draggable="true" ondragstart="start(event)" ondragend="end(event)"/>');		
	id6++;
	bottom6+=5;

	var valor=$("#v6").val();
	valor++;
	$("#v6").val(valor);
}

var validar=0;
function comprueba(tab)
{
	var respuestas1 = $('#res1'+tab).val();
	var respuestas2 = $('#res2'+tab).val();
	var respuestas3 = $('#res3'+tab).val();
	var res1 = respuestas1.split("-");
	var res2 = respuestas2.split("-");
	var res3 = respuestas3.split("-");
	if (validar==0) {
		if(id==0||id2==0||id3==0){		
			$('#alerta').attr('style','display:block');
			reproducionSonido('audio/alerta.mp3');
			setTimeout(function(){$('#alerta').attr('style','display:none')},1500);
			
	  	}
	  	else{	  	
		  	if(id==res1[0]&&id2==res1[1]&&id3==res1[2]){
		  		$('#mensaje').attr('src','img/felicitaciones.png');
				$('#mensaje').attr('style','display:block');
				reproducionSonido('audio/felicitaciones.wav');					
				setTimeout(function(){
					$('#mensaje').attr('style','display:none');
					$('.instruccion').attr('src','img/segundosumando.png');
				},1500);
				validar++;
				asignar();
			}
			else{
				$('#mensaje').attr('src','img/intenta.png');
				$('#mensaje').attr('style','display:block');
				reproducionSonido('audio/intentalo.wav');	
				limpiar();	
				setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
				
			}
		}
	}
	else if (validar==1) {
		if(id4==0||id5==0||id6==0){		
			$('#alerta').attr('style','display:block');
			reproducionSonido('audio/alerta.mp3');
			setTimeout(function(){$('#alerta').attr('style','display:none')},1500);
			
	  	}
	  	else{	  	
		  	if(id6==res2[0]&&id5==res2[1]&&id4==res2[2]){
		  		$('#mensaje').attr('src','img/felicitaciones.png');
				$('#mensaje').attr('style','display:block');
				reproducionSonido('audio/felicitaciones.wav');					
				setTimeout(function(){
					$('#mensaje').attr('style','display:none');
					$('.instruccion').attr('src','img/total.png');
				},1500);
				validar++;
				quitar();
			}
			else{
				$('#mensaje').attr('src','img/intenta.png');
				$('#mensaje').attr('style','display:block');
				reproducionSonido('audio/intentalo.wav');	
				limpiar2();	
				setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
				
			}
		}
	}
	else {
		if(id==0||id2==0||id3==0){		
			$('#alerta').attr('style','display:block');
			reproducionSonido('audio/alerta.mp3');
			setTimeout(function(){$('#alerta').attr('style','display:none')},1500);
			
	  	}
	  	else{	  	
		  	if(id==res3[0]&&id2==res3[1]&&id3==res3[2]){
				$('#mensaje').attr('style','display:none');
				$('#final').attr('style','display:block');
				reproducionSonido('audio/logro.mp3');
				limpiarGeneral();
			}
			else{
				$('#mensaje').attr('src','img/intenta.png');
				$('#mensaje').attr('style','display:block');
				reproducionSonido('audio/intentalo.wav');	
				limpiar();	
				setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
				
			}
		}
	}
}

function asignar()
{
	$('#da4').attr('ondrop','return drop4(event)');
	$('#da5').attr('ondrop','return drop5(event)');
	$('#da6').attr('ondrop','return drop6(event)');
}

function quitar()
{
	$('#da4').removeAttr('ondrop');
	$('#da5').removeAttr('ondrop');
	$('#da6').removeAttr('ondrop');
}

function limpiar()
{
	$("#da1, #da2 ,#da3").html('');
	id=0, id2=0, id3=0;
	bottom=0, bottom2=0, bottom3=0;
	$("#v1, #v2, #v3").val('0');
}

function limpiar2()
{
	$("#da4, #da5 ,#da6").html('');
	id4=0, id5=0, id6=0;
	bottom4=0, bottom5=0, bottom6=0;
	$("#v4, #v5, #v6").val('0');
}

function limpiarGeneral()
{
	$("#da1, #da2 ,#da3, #da4, #da5 ,#da6").html('');
	id=0, id2=0, id3=0,id4=0, id5=0, id6=0;
	bottom=0, bottom2=0, bottom3=0,bottom4=0, bottom5=0, bottom6=0;
	eliminar=0,eliminar2=10,eliminar3=20;
	$("#v1, #v2, #v3, #v4, #v5, #v6").val('0');
}

function regresar()
{
	$("#da1, #da2 ,#da3, #da4, #da5 ,#da6").html('');
	id=0, id2=0, id3=0,id4=0, id5=0, id6=0;
	bottom=0, bottom2=0, bottom3=0,bottom4=0, bottom5=0, bottom6=0;
	eliminar=0,eliminar2=10,eliminar3=20;
	$("#v1, #v2, #v3, #v4, #v5, #v6").val('0');
	$('#final').attr('style','display:none');
	$('.instruccion').attr('src','img/primersumando.png');
}

$(".repro_audio10").mouseover(function( ) {pausar();
      var audio = $("#audio10");
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