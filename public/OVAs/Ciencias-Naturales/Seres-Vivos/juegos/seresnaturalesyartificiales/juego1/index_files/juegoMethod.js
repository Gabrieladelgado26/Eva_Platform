var naturales=0;
var artificiales=0;

$(document).ready(function() {
	reiniciar();	
	crear();
	$('.arrastra').attr('draggable','true');
 });

function crear(){
	$('#objetos').append('<img id="vivos-1" class="arbol arrastra" src="img/1.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/1.mp3\')">');
	$('#objetos').append('<img id="inertes-2" class="saco arrastra" src="img/2.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/2.mp3\')">');
	$('#objetos').append('<img id="inertes-4" class="celular arrastra" src="img/3.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/3.mp3\')">');
	$('#objetos').append('<img id="inertes-6" class="llanta arrastra" src="img/4.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/4.mp3\')">');
	$('#objetos').append('<img id="inertes-8" class="piedra arrastra" src="img/5.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/5.mp3\')">');
	$('#objetos').append('<img id="vivos-3" class="flor arrastra" src="img/6.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/6.mp3\')">');
	$('#objetos').append('<img id="vivos-5" class="mariposa arrastra" src="img/7.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/7.mp3\')">');
	$('#objetos').append('<img id="vivos-7" class="gota arrastra" src="img/8.png" draggable="true" ondragstart="start(event)" ondragend="end(event)" onmouseover="reproducionSonido(\'sonidos/8.mp3\')">');
}
/**
* Función que se ejecuta al arrastrar el elemento. class="animar camello" data-tiempo="2000" data-tipo="show"
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
    if ((e.target.className == "arrastrainertes")||(e.target.className == "arrastravivos")||(e.target.className == "objetos"))
        return false;
    else
    return true;
}
var arrastradas=0;
function drop(e)
{
	e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
	var ea = e.dataTransfer.getData("Text");
	var id=ea.split('-');
	var id2=e.target.id;
	if (id[0]==id2) {
		e.target.appendChild(document.getElementById(ea));
		arrastradas++;
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){ 
			finalizarGano(arrastradas,8);
		},1500);
	}	
	else{
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');	
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();	
	}
}
