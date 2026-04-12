

var letras = ['c','d','j','l','m'];
var resultado2,opciones, num1,num2 = 0;
var tab=0;

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

  function aleatorio(){

  	opciones=Math.round(Math.random() * (2 - 1) + 1);
	num1=Math.round(Math.random() * (9 - 1) + 1);
	num2=Math.round(Math.random() * (9 - 1) + 1);
  }


var letrasalea = shuffle(letras);

$(document).ready(function() {
		

		$('img').attr('draggable','false');
		$('a').attr('draggable','false');
		$('.arrastra').attr('draggable','true');

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
		 
		 cargarInicio(0);
	
});	

function cargarInicio(tab){

	aleatorio();
	mostrarpregunta(tab);

	if(opciones==1){ var ruta=num1;	}
	else {var ruta=letrasalea[tab]+'-'+num1;}	

	var ruta2=letrasalea[tab]+'-'+num2;	


	$('.pos1').attr('src','img/'+ruta+'.png');
	$('.pos2').attr('src','img/'+ruta2+'.png');
	
	var resultado1=((num1+num2)-1);
		resultado2=(num1+num2);
	var resultado3=((num1+num2)+1);
	var miarray=[resultado1,resultado2,resultado3];
	var resultados = shuffle(miarray);

	$('.opcion1').attr('src','img/'+resultados[0]+'.png');
	$('.opcion2').attr('src','img/'+resultados[1]+'.png');
	$('.opcion3').attr('src','img/'+resultados[2]+'.png');
}

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
    if ((e.target.className == "resultado"))
        return false;
    else
    return true;
}

function drop(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
	$('.resultado').attr('src',ea);

	$('.botonevaluar').attr('style','display:block');

}

function comprueba()
{
	$('.botonevaluar').attr('style','display:none');
	var resultadoArrastrado = $('.resultado').attr('src');
	var res=resultadoArrastrado.substr(-6,2);
	var num=res.split('');
	var mirespuesta=0;
	if(num[0]=='/'){mirespuesta=num[1];}
	else{mirespuesta=res;}

	if(resultado2==mirespuesta)
	{
		
		$('#mensaje').attr('src','img/correcto.png');
		$('#mensaje').attr('style','display:block');
		reproducionSonido('sonidos/pasanivel.wav');			
		setTimeout(function(){
			cambioMensaje('#mensaje');
			tab++;
			cargarInicio(tab);
			$('.resultado').attr('src','img/preg.png');
		},1500);		
		setTimeout(function(){finalizarGano(tab)},1500);
		
	}
	else
	{
		
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();			
		$('#mensaje').attr('src','img/incorrecto.png');
		$('#mensaje').attr('style','display:block');
		reproducionSonido('sonidos/nop.wav');				 		
		setTimeout(function(){cambioMensaje('#mensaje')},1500);
		$('.resultado').attr('src','img/preg.png');
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

function mostrarpregunta(tab){

	var numero1='<span class="numeros">'+num1+'</span>';
	var numero2='<span class="numeros">'+num2+'</span>';

	if(letrasalea[tab]=='c'){

		$('.pregunta').html('Pipe tenía '+numero1+' canicas. Su amigo Juan le regaló '+numero2+' más. ¿Cuantas canicas tiene ahora Pipe?');

	}
	else if(letrasalea[tab]=='d'){

		$('.pregunta').html('En el cumpleaños de Ivy, Pipe se comió '+numero1+' colombinas y su mamá le regalo '+numero2+' más. ¿Cuantas colombinas se comió Pipe en total?');

	}
	else if(letrasalea[tab]=='j'){

		$('.pregunta').html('Ivy tenía '+numero1+' muñecas y en su cumpleaños le regalaron '+numero2+' más. ¿Cuantas muñecas tiene Ivy en total?');

	}
	else if(letrasalea[tab]=='l'){

		$('.pregunta').html('Ivy tiene '+numero1+' libros de matemáticas y '+numero2+' de ciencias naturales. ¿Cuántos libros tiene Ivy en total?');

	}
	else if(letrasalea[tab]=='m'){

		$('.pregunta').html('Doña María surtió '+numero1+' manzanas en la mañana y en la tarde surtió '+numero2+' más. ¿Cuantas manzanas se surtieron en total en la tienda?');

	}
}


