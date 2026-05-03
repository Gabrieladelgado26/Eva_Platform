var ordenimg=[1,2,3,4,5];
var orden = shuffle(ordenimg);
var pos = 0;

$(document).ready(function() {
	cargar();	
	reiniciar();	
 });
function enunciado1()
{
	setTimeout(function(){reproducionSonido('sonidos/enunciado1.mp3')},1000);
}
function cargar(){
	for (var i = 0; i <= 4; i++) {	
		$('#circulos').append('<img class="circulo'+(i+1)+'" style="z-index:1" src="img/circulo.png">');	
		$('#objetos').append('<img id="piezades-'+orden[i]+'" class="pieza'+(i+1)+'" src="img/'+orden[i]+'b.png" onclick="mostrar('+orden[i]+')">');			
		$('#imagenes').append('<img id="piezaarrastra-'+(i+1)+'" class="pieza'+(i+1)+'des" src="img/'+(i+1)+'.png" draggable="true" ondragstart="start(event)" ondragend="end(event)">');
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
    if ((e.target.className == "plataforma"))
        return false;
    else
    return true;
}
var pierna1=false, pierna2=false, tronco=true, cola=true, cabeza=true;
var arrastradas=0;
var correctas=0;
function drop(e)
{
	e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
	var ea = e.dataTransfer.getData("Text");
	var id=ea.split('-');
	
	if (!pierna1||!pierna2) {
		if (id[1]==4||id[1]==2) {
			$('#piezaarmada-'+id[1]).removeAttr('style');
			$('#'+ea).attr('style','display:none');
			correctas++;
			arrastradas++;
			if (id[1]==4) {
				pierna1=true;
			}
			else{
				pierna2=true;
			}
		}
		else{
			mostrarAlertas('img/incorrecto.png', 1500);
			reproducionSonido('sonidos/nop.wav');	
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();	
		}

		if (correctas==2) {
			tronco=false;
		}
	}else if (!tronco) {
		if (id[1]==3) {
			$('#piezaarmada-'+id[1]).removeAttr('style');
			$('#'+ea).attr('style','display:none');
			correctas++;
			arrastradas++;
			tronco=true;
		}
		else{
			mostrarAlertas('img/incorrecto.png', 1500);
			reproducionSonido('sonidos/nop.wav');	
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();	
		}

		if (correctas==3) {
			cola=false;
		}
	}else if (!cola) {
		if (id[1]==1) {
			$('#piezaarmada-'+id[1]).removeAttr('style');
			$('#'+ea).attr('style','display:none');
			correctas++;
			arrastradas++;
			cola=true;
		}
		else{
			mostrarAlertas('img/incorrecto.png', 1500);
			reproducionSonido('sonidos/nop.wav');	
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();	
		}

		if (correctas==4) {
			cabeza=false;
		}
	}else if (!cabeza) {
		if (id[1]==5) {
			$('#piezaarmada-'+id[1]).removeAttr('style');
			$('#'+ea).attr('style','display:none');
			correctas++;
			arrastradas++;
			cabeza=true;
		}
		else{
			mostrarAlertas('img/incorrecto.png', 1500);
			reproducionSonido('sonidos/nop.wav');	
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();	
		}
	}
	comprueba();	
}

var seleccionadas=0;
function mostrar(id){
	reproducionSonido('sonidos/sip.wav');
	$('#piezades-'+id).attr('style','display:none');
	$('#piezades-'+id).removeAttr('onclick');
	$('#pieza-'+id).removeAttr('style');
	seleccionadas++;

	if (seleccionadas==5) {
		$('#verificar').removeAttr('style');
	}
}

function comprueba(){
	if (correctas==5) {
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){ 	
				finalizarGano(correctas,5);
		},1500);
	}
}