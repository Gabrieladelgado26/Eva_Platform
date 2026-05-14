
var respuestas = ["TOLITAS", "IPIALES", "AZUFRAL", "GALERAS", "SANDONA"];
var preg = [1,2,3,4,5];
var preguntas= shuffle(preg);
var pos = 0;
var res = 0;

var alfabeto=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

$(document).ready(function() {
	cargar();
	reiniciarcaras();
 });




function cargar (){
	for (var i = 0; i < 27; i++) {
		$('.contenedor').append('<div id="'+alfabeto[i]+'" onclick="seleccionar(this.id)" >'+alfabeto[i]+'</div>');
	}

	$('.preg').attr('src','img/'+preguntas[pos]+'.png');

	res = respuestas[preguntas[pos]-1];
	for (var i = 0; i < res.length; i++) {
		$('.conten').append('<div id="d-'+i+'"></div>');
	}


}
 
var cara=1, correctas =0 , bien=0; 
function seleccionar(id){
	for (var i = 0; i <= res.length; i++) {
		if(res[i]==id){
			$('#d-'+i).append(id);
			correctas++;
			bien++;
		}
	}
	 if (correctas==0){
		$('#'+id).attr('style','background-color: #D50000');
		reproducionSonido('sonidos/nop.wav');			
		$('.parte'+cara).attr('src','img/parte'+cara+'.png');
		cara++;
					
		
		if(cara==5){

			setTimeout(function(){ 
			 finalizarPerdio();
			},500);	
		}
   
	}
	else{
		correctas=0;
		$('#'+id).attr('style','background-color: #1B5E20');
		reproducionSonido('sonidos/pasanivel.wav');
	}

	$('#'+id).removeAttr('onclick');	
	cambiarnivel(id);

}

function cambiarnivel(id){
	if(bien==res.length){

		reproducionSonido('sonidos/tada.mp3');
		mostrarAlertas('img/correcto.png', 1500);				
		setTimeout(function(){ 
				for (var i = 0; i <= res.length; i++) {
				if(res[i]==id){
					$('#'+id).removeAttr('style');
				}
			}
			bien=0;
			pos++;
			finalizarGano(pos,5);
			cara=1;
			reiniciarcaras();
			$('.contenedor').html('');
			$('.conten').html('');
			cargar();
			
		},2000);
	}
}

function reiniciarcaras(){

	$('.parte1').attr('src','img/parte1-1.png');
	$('.parte2').attr('src','img/parte2-2.png');
	$('.parte3').attr('src','img/parte3-3.png');
	$('.parte4').attr('src','img/parte4-4.png');
}