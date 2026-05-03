var nivel=[1,2,3,4,5];
var niv = shuffle(nivel);
var pos=0;
$(document).ready(function() {
	reiniciar();	
	crear();
 });

function crear()
{	
	$('#imagen').html('');
	$('#imagen').append('<img class="imagenpregunta" src="img/'+niv[pos]+'.png" onmouseover="reproducionSonido(\'sonidos/'+niv[pos]+'.mp3\')">');

	var estilos=[1,2,3,4,5];
	var est=shuffle(estilos);
	$('#opciones').html('');
	for (var i = 1; i <= 5; i++) {
		$('#opciones').append('<img id="img-'+i+'" class="opcion'+est[i-1]+'" src="img/'+i+'_1.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/'+i+'_1.mp3\')">');
	}	
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
    if ((e.target.className == "divarrastra")||(e.target.className == "opciones"))
        return false;
    else
    return true;
}
var correctas=0;
var id='';
function drop(e)
{
	reproducionSonido('sonidos/sip.wav');
	e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
	var ea = e.dataTransfer.getData("Text");
	id=ea.split('-');
	var id2=e.target.id;
	if (id2=='opciones') {
		e.target.appendChild(document.getElementById(ea));	
	}

	if ($('#divarrastra img').length==0) {
		$('#verificar').attr('style','display:table');		
		e.target.appendChild(document.getElementById(ea));	
	}

	if ($('#opciones img').length==5) {
		$('#verificar').attr('style','display:none');
	}
}

var correctas
function validar(){
	if (id[1]==niv[pos]) {
		pos++;
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){ 
			crear();
			limpiar();
			finalizarGano(pos,5);
		},1500);
	}
	else{
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');	
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();	
		setTimeout(function(){ 
			crear();
			limpiar();
		},1500);
	}
}

function limpiar(){
	correctas=0;
	id='';
	$('#verificar').attr('style','display:none');
	$('#divarrastra').html('');
}