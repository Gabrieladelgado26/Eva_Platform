var res1=[24,10,11,20], res2=[22,6,15,44], res3=[64,80,12,23], opciones=[1,2,3,4];

function shuffle(array) {

	     var currentIndex = array.length, temporaryValue, randomIndex;

	     // While there remain elements to shuffle...
	     while (0 !== currentIndex) {

	       // Pick a remaining element...
	       randomIndex = Math.floor(Math.random() * currentIndex);
	       currentIndex -= 1;

	       // And swap it with the current element.
	       temporaryValue = array[currentIndex];
	       array[currentIndex] = array[randomIndex];
	       array[randomIndex] = temporaryValue;
	     }

	     return array;
	}

function asignar()
{
	var estilos=shuffle(opciones);
	if (correctos==0) {
		for (var i =0;  i <= 3; i++) {
			$('#'+(i+1)).attr('src','img/'+res1[i]+'.png');	
			$('#'+(i+1)).attr('class','opcion'+estilos[i]);	
		}	
	}
	else if (correctos==1) {
		for (var i =0;  i <= 3; i++) {
			$('#'+(i+1)).attr('src','img/'+res2[i]+'.png');	
			$('#'+(i+1)).attr('class','opcion'+estilos[i]);	
		}	
	}
	else if (correctos==2) {
		for (var i =0;  i <= 3; i++) {
			$('#'+(i+1)).attr('src','img/'+res3[i]+'.png');	
			$('#'+(i+1)).attr('class','opcion'+estilos[i]);	
		}	
	}
	else {
		$('#complementos').attr('style','display:none');
	}
}

function regresar()
{
	$('#imgGano').attr('style','display:none');
	$('#mensaje').attr('style','display:none');	
	$('#complementos').attr('style','display:block');
	limpiar();
}

var imagen=2, correctos=0, x='';
function comprueba(id)
{	
	if (id==1) {
		correctos++;		
		muestra(id);
		setTimeout(function(){mensajeBien();}, 1500);
		setTimeout(function(){cambiar();asignar();}, 3000);	
		if (correctos==3) {
			$('#mensaje').attr('src','img/logro.png');	
			$('#mensaje').attr('style','display:table');	
			reproducionSonido('audio/logro.mp3');
			clearTimeout(x);
		}
	}
	else{	
		muestra(id);
		setTimeout(function(){mensajeMal();}, 1500);	
	}
}

function mensajeBien()
{
	$('#mensaje').attr('src','img/felicitaciones.png');	
	$('#mensaje').attr('style','display:table');	
	reproducionSonido('audio/felicitaciones.mp3');
	x=setTimeout(function(){$('#mensaje').attr('style','display:none')}, 1500);	
}

function mensajeMal()
{
	$('#mensaje').attr('src','img/intenta.png');	
	$('#mensaje').attr('style','display:table');
	setTimeout(function(){$('#mensaje').attr('style','display:none')}, 1500);
}

function cambiar()
{
	$('.cuadrooperacion').attr('src','img/cuadro'+imagen+'.png');
	imagen++;
	$('.resultadoOperacion').attr('style','display:none');
}

function muestra(id)
{
	var src=$('#'+id).attr('src');
	$('.resultadoOperacion').attr('src',''+src)
	$('.resultadoOperacion').attr('style','display:table');
	setTimeout(function(){$('.resultadoOperacion').attr('style','display:none')}, 1500);	
}

function limpiar()
{
	$('.cuadrooperacion').attr('src','img/cuadro1.png');
	correctos=0;
	imagen=2;
	asignar();
}

$(".repro_audio3").mouseover(function( ) {pausar();
      var audio = $("#audio3");
      audio.get(0).play();
});

function pausar(){

         $("audio").trigger('pause'); // Stop playing
         $("audio").prop('currentTime', 0) ; // Reset time
        
    }

    function reproducionSonido(src){
		pausar();		
		$('#audio_men').html('');
		$('#audio_men').append('<audio id="audio0" name="audio0" preload="" src=\"'+src+'\"\/>');
		$('#audio0').trigger('play');
		
}