
var img = [1,2,3];
var vecimg =shuffle(img);
var res = [1,2,3];
var vecres =[];

$(document).ready(function() {
	cargar();
	reiniciar();	
 });

var pos = 0;

function cargar (){

	vecres =shuffle(res);
	$('#opciones').html('');
	$('.preg').attr('src','img/'+vecimg[pos]+'.png');
	for (var i = 1; i <= 3; i++) {
		$('#opciones').append('<img id="in-'+vecres[i-1]+'" class="res'+i+'" src="img/'+vecimg[pos]+'-'+vecres[i-1]+'.png" onclick="seleccionar('+vecres[i-1]+')">');
	}

}

function seleccionar(id)
{
	$('#in-'+id).addClass('selec');
	reproducionSonido('sonidos/sip.wav');	
	$('.divbotones2').attr('style','display:block');	
	if(id==1){
		$('#in-2').removeClass('selec');
		$('#in-3').removeClass('selec');
	}
	else if(id==2){
		$('#in-1').removeClass('selec');
		$('#in-3').removeClass('selec');
	}else{
		$('#in-1').removeClass('selec');
		$('#in-2').removeClass('selec');
	}	
}

var correctas= 0;
function validar()
{
	$('.divbotones2').attr('style','display:none');	
	for (var i = 1; i <= 3; i++) {
		
		if($('#in-'+i).hasClass('selec')){
			if(i==2){
				correctas = 1;
			}			
		}
	}

	if(correctas==1)
	{
		mostrarAlertas('img/correcto.png', 1500);
		reproducionSonido('sonidos/pasanivel.wav');
		pos++;
		setTimeout(function(){
			limpiar();
			cargar();
		},1500);
		setTimeout(function(){ 
			finalizarGano(pos,3);
		},1500);
		correctas= 0;
	}
	else
	{
		
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');	
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();	
		setTimeout(function(){
			limpiar();
			cargar();
		},1500);
	}


}
function limpiar (){
	for (var i = 1; i <= 3; i++) {		
		$('#in-'+i).removeClass('selec');
	}
}