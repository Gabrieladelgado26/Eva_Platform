var ordenimg=[1,2,3,4,5];
var orden = shuffle(ordenimg);
var pos=0;
$(document).ready(function() {
	reiniciar();	
	crear();
 });

function crear()
{	
	var estilos=[1,2,3,4];
	var est=shuffle(estilos);
	$('#imagenes').html('');
	$('#divs').html('');
	for (var i = 1; i <= 4; i++) {
		$('#imagenes').append('<img id="pos-'+i+'" class="imagen'+est[i-1]+'" src="img/'+orden[pos]+'_'+i+'.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/'+orden[pos]+'_'+i+'.mp3\')">');
		$('#divs').append('<div id="div-'+i+'" class="div'+i+'" ondragenter="return enter(event)" ondragover="return over(event)" ondrop="return drop(event)"></div>');
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
    if ((e.target.className == "div1")||(e.target.className == "div2")||(e.target.className == "div3")||(e.target.className == "div4")||(e.target.className == "imagenes"))
        return false;
    else
    return true;
}
var correctas=0;
function drop(e)
{
	e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
	var ea = e.dataTransfer.getData("Text");
	var id=ea.split('-');
	var idPadre=e.target.id;
	var id2=idPadre.split('-');
		
	if (id2[0]=='div') {
		if ($('#'+idPadre+' img').length<1) {
			e.target.appendChild(document.getElementById(ea));
			if (id[1]==id2[1]) {
				correctas++;
			}
		}
	}	
	else{
		e.target.appendChild(document.getElementById(ea));		
	}


	if ($('#imagenes img').length==0) {
		$('#verificar').removeAttr('style');
	}	
	else{
		$('#verificar').attr('style','display:none');
	}
}

function validar(){
	if (correctas>=4) {
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
	$('#verificar').attr('style','display:none');
}