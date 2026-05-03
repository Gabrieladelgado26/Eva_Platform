$(document).ready(function() {
	cargar();	
	reiniciar();	
 });

function cargar(){
	var ordenimg=[1,2,3,4,5];
	var botones=[1,2,3,4,5];
	var orden = shuffle(ordenimg);
	var btns = shuffle(botones);
	$('#escenas').html('');
	$('#botones').html('');

	for (var i = 1; i <= 5; i++) {			
		$('#escenas').append('<div id="img-'+i+'" class="escena'+orden[i-1]+'" style="background-image:url(img/'+i+'.png)" ondragenter="return enter(event)" ondragover="return over(event)" ondrop="return drop(event)"></div>');		
		$('#botones').append('<img id="btn-'+i+'" class="boton'+btns[i-1]+'" src="img/'+i+'b.png" draggable="true" ondragstart="start(event)" ondragend="end(event)"> ');	
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
    if ((e.target.className == "escena1")||(e.target.className == "escena2")||(e.target.className == "escena3")||(e.target.className == "escena4")||(e.target.className == "escena5")||(e.target.className == "botones"))
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

	if ($('#'+idPadre+' img').length==0) {
		e.target.appendChild(document.getElementById(ea));
	}
	else if(idPadre=='botones')
	{
		e.target.appendChild(document.getElementById(ea));
	}

	var id2=idPadre.split('-');
	

	if (id[1]==id2[1]) {
		correctas++;
	}

	if ($('#botones img').length==0) {
		$('#verificar').attr('style','display:table');
	}else{
		$('#verificar').attr('style','display:none');		
	}
}

function verifica(){
	if (correctas==5) {
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){ 	
			finalizarGano(correctas,5);
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
	cargar();
}
