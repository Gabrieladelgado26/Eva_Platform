var tabs = [1,2,3,4,5];
var orden = shuffle(tabs);
var pos = 0;

$(document).ready(function() {
	reiniciar();	
	cargar();
 });

function cargar(){
	$('#niv'+orden[pos]).removeAttr('style');
}

var seleccionadas=0;
var correctas=0;
function seleccionar(id)
{
	if ($('#'+orden[pos]+'-'+id).hasClass('pintada')) {
		$('#'+orden[pos]+'-'+id).removeAttr('style');
		$('#'+orden[pos]+'-'+id).removeClass('pintada');
		seleccionadas--;
		if (id==1||id==2) {
			correctas--;
		}		
	}
	else{
		seleccionadas++;
		if (seleccionadas<=2) {
			$('#'+orden[pos]+'-'+id).attr('style','border: 3px solid rgb(255, 255, 255); background-color: rgba(255, 255, 255, 0.42); border-radius: 18px;');
			$('#'+orden[pos]+'-'+id).addClass('pintada');
			if (id==1||id==2) {
				correctas++;
			}		
		}
		else{
			$('.tituloseres').attr('style','animation: 0.5s pulse infinite;');
			setTimeout(function(){ $('.tituloseres').removeAttr('style');},1500);	
			seleccionadas--;		
		}
	}	

	if (seleccionadas==2) {
		$('.divbotones2').attr('style','display:table');				
	}
	else{
		$('.divbotones2').attr('style','display:none');
	}
}

function verificar(){

	$('.divbotones2').attr('style','display:none');	
	if (correctas==2) {
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){ 
			limpiar();
			avanzar();
			finalizarGano(pos,5);
		},1500);
	}
	else{
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');	
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();	
		setTimeout(function(){ limpiar();},1500);
	}
}

function limpiar(){
	for (var i = 0; i <= 3; i++) {
		$('#'+orden[pos]+'-'+i).removeAttr('style');
		$('#'+orden[pos]+'-'+i).removeClass('pintada');
	}
	correctas=0;
	seleccionadas=0;
}

function avanzar(){
	$('#niv'+orden[pos]).attr('style','display:none');
	pos++;
	cargar();
}