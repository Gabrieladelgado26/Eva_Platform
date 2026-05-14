var imagenes=[1,2,3,4,5,6];
var imgs=shuffle(imagenes);
var pos=0;

$(document).ready(function() {
	reiniciar();
	crear();
	crearImg();
 });

function crear(){
	for (var i = 1; i <= 6; i++) {
		$('#mapa').append('<div id="div-'+i+'" class="parte'+i+'" ondragenter="return enter(event)" ondragover="return over(event)" ondrop="return drop(event)"></div>');
	}	
}

function crearImg(){
	$('#boton').html('');

	$('#boton').append('<img id="img-'+imgs[pos]+'" class="opcion" src="img/'+imgs[pos]+'.png" draggable="true" ondragstart="start(event)" ondragend="end(event)">');
	
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
    reproducionSonido('sonidos/sip.wav');           
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
    if ((e.target.className == "boton")||(e.target.className == "parte1")||(e.target.className == "parte2")||(e.target.className == "parte3")||(e.target.className == "parte4")||(e.target.className == "parte5")||(e.target.className == "parte6"))
        return false;
    else
    return true;
}
var correctas=0;
var idPadre='';
function drop(e)
{
	e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
	var ea = e.dataTransfer.getData("Text");
	var id=ea.split('-');	
	idPadre=e.target.id;
	var id2=idPadre.split('-');

	if (id[1]==id2[1]) {
		correctas++;
		e.target.appendChild(document.getElementById(ea));
	}
	else{		
		e.target.appendChild(document.getElementById(ea));
		if (correctas>0) {
			correctas--;
		}
	}

	if ($('#boton img').length==0) {
		$('#verificar').attr('style','display:table');
	}else{
		$('#verificar').attr('style','display:none');		
	}
}

function validar(){
	if (correctas==1) {
		$('#'+idPadre).removeAttr('ondrop');
		correctas=0;
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){ 	
			idPadre='';
			pos++;
			crearImg();
			finalizarGano(pos,6);
		},1500);

	}
	else{
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');	
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();	
		setTimeout(function(){limpiar();},1500);
	}
}

function limpiar(){
	correctas=0;
	$('#verificar').attr('style','display:none');
	$('#'+idPadre).html('');
	crearImg();
}

