var preguntas=new Array("El girasol","Esta roca","La paloma","El balón","El perro");
var pos=1;
$(document).ready(function() {
	crear();
	reiniciar();
 });

function crear(){
	var respuestas=[1,2,3,4,5];
	var res=shuffle(respuestas);
	
	$('#imagenes').html('');

	for (var i = 0; i <= 4; i++) 
	{
		
		$('#interrogantes').append(' <img id="interrogante" class="in'+(i+1)+'" src="img/interrrogacion3.png" style="display:none">');

		if (res[i]==1||res[i]==3||res[i]==5) {
			$('#imagenes').append('<img id="'+res[i]+'" class="img'+(i+1)+'" data="1" data-img="'+res[i]+'" src="img/'+res[i]+'.png" onmouseover="reproducionSonido(\'sonidos/'+res[i]+'.mp3\');">');
		}
		else{
			$('#imagenes').append('<img id="'+res[i]+'" class="img'+(i+1)+'" data="0" data-img="'+res[i]+'" src="img/'+res[i]+'.png" onmouseover="reproducionSonido(\'sonidos/'+res[i]+'.mp3\');">');
		}
	}
	cargarImg();
}

var beto=2, int=1;
function validar(id){

	$('.botoninerte').removeAttr('onclick');
	$('.botonvivo').removeAttr('onclick');
	var data=$('.img'+pos).attr('data');
	if (id==data) {
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){ 
			cambiar();
			cargarImg();
			finalizarGano(beto,7);
		},1500);
	}
	else{
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');	
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();	
		//regresar();
		setTimeout(function(){ $('.divpregunta').attr('style','display:none');},1500);
	}
	setTimeout(function(){ 
	$('.botoninerte').attr('onclick','validar(0)');
	$('.botonvivo').attr('onclick','validar(1)');}, 1500);
}

function mostrar(){

	$('.divpregunta').removeAttr('style');
}

function iniciar(){
	reproducionSonido('sonidos/sip.wav');	
	$('#beto').attr('class','beto'+beto);
	$('.in'+int).attr('style','display:table');
	$('.in1, .in2, .in3, .in4, .in5').attr('onclick','mostrar()');
	$('#inicio').attr('style','display:none');
}

function cargarImg(){
	var src=$('.img'+pos).attr('src');
	var imagenamostar=$('.img'+pos).attr('data-img');
	$('#imgRespuesta').attr('src',src);
	$('#imgRespuesta').attr('onmouseover',"reproducionSonido('sonidos/"+imagenamostar+".mp3');");
	$('#preguntaimagen').text('¿'+preguntas[imagenamostar-1]+' es un ser vivo o inerte?');
}

function cambiar(){
	reproducionSonido('sonidos/sip.wav');	
	$('.in'+int).attr('style','display:none');
	beto++;
	pos++;
	int++;
	$('#beto').attr('class','beto'+beto);
	$('.divpregunta').attr('style','display:none');
	$('.in'+int).attr('style','display:table');
}

/*function regresar(){
	if (pos>1) {
		$('.in'+int).attr('style','display:none');
		beto--;
		pos--;
		int--;
		$('#beto').attr('class','beto'+beto);
		$('.divpregunta').attr('style','display:none');
		$('.in'+int).attr('style','display:table');
		cargarImg();
	}
	else{
		$('#beto').attr('class','beto1');
		$('#inicio').attr('style','display:table');
		$('.divpregunta').attr('style','display:none');
		crear();
	}
}*/

function cerrar(){
	$('.divpregunta').attr('style','display:none');	
}