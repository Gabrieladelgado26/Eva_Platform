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

var respuestas=[1,3,
1], general='', x=0, nivel=0;
function drop(e)
{
	e.preventDefault();
    var ea = e.dataTransfer.getData("Text");
    var src= $("#"+ea).attr("src");

    if (x==0){
    	$("#d1").append('<img class="respuesta1" src="'+src+'" >');
    	x=1;
    }
    else{
    	$("#d1").html('');
    	$("#d1").append('<img class="respuesta1" src="'+src+'" >');
    }
    general=ea;
    comprueba();
}

function limpiar()
{
	seleccionadas=0;
	letra1='';
	id1=0;	
}

function reiniciar()
{
	nivel=0;
	$('#complementos').attr('style','display:table');
	$('#d1').html('');
	$('#d1').attr('style','background-image: url(img/operacion'+(nivel+1)+'.png');
	$('#1').attr('src','img/'+(nivel+1)+'1.png');
	$('#2').attr('src','img/'+(nivel+1)+'2.png');
	$('#3').attr('src','img/'+(nivel+1)+'3.png');
	$('#final').attr('style','display:none');
}
function comprueba()
{	
	if(general==respuestas[nivel]){
		$('#mensaje').attr('src','img/felicitaciones.png');
		$('#mensaje').attr('style','display:block');				
		reproducionSonido('audio/felicitaciones.mp3');
		setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
		setTimeout(function(){cambiar()},1500);
		nivel++;
		if (nivel==3){
			$('#complementos').attr('style','display:none');
			$('#mensaje').attr('style','display:none');
			$('#final').attr('style','display:block');
			reproducionSonido('audio/logro.mp3');
		}
  	}
  	else{

  		$('#mensaje').attr('src','img/intenta.png');
		$('#mensaje').attr('style','display:block');				
		reproducionSonido('audio/intentalo.mp3');
		setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
		setTimeout(function(){$('#d1').html('')},1500);
		
  	}
}

function cambiar(){
	$('#d1').html('');
	$('#d1').attr('style','background-image: url(img/operacion'+(nivel+1)+'.png');
	$('#1').attr('src','img/'+(nivel+1)+'1.png');
	$('#2').attr('src','img/'+(nivel+1)+'2.png');
	$('#3').attr('src','img/'+(nivel+1)+'3.png');
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

function animarTab2(){

        setTimeout(function(){$(".tabla1").attr('style','display:block')},12000);
        setTimeout(function(){$(".tabla2").attr('style','display:block')},15000);
        setTimeout(function(){$(".num2").attr('style','display:block')},19000);
        setTimeout(function(){$(".num1").attr('style','display:block')},25000);
        setTimeout(function(){$(".res").attr('style','display:block')},28000);
}