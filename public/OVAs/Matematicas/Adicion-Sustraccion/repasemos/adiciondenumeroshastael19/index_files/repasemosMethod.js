

function comprueba(img,tab)
{	
	var respuesta = $('#respuesta'+tab).val();

	if(img==respuesta){

		$('#mensaje').attr('src','img/felicitaciones.png');
		$('#mensaje').attr('style','display:block');				
		reproducionSonido('audio/felicitaciones.mp3');
		setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
		setTimeout(function(){
             $('#sig'+tab).click()
             $('#sig'+tab).show();
        },1500);

		if (tab==3){
			$('#mensaje').attr('style','display:none');
			$('#final').attr('style','display:block');
			reproducionSonido('audio/logro.mp3');
			setTimeout(function(){$('#final').attr('style','display:none')},1500);
		}
		
  	}
  	else{	  	
		$('#mensaje').attr('src','img/intenta.png');
		$('#mensaje').attr('style','display:block');
		reproducionSonido('audio/intentalo.wav');		
		setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);	
	}
}

$(".repro_audio10").mouseover(function( ) {pausar();
      var audio = $("#audio10");
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

$(document).ready(function() {

    var mouses=0;
    $("#tb1").mouseover(function( ){
       
        if(mouses==0)
        {
            iniciar();
        }
        mouses++;
       
            
       });
});

function iniciar(){

    setTimeout(function(){$(".diadema").attr('style','display:block')},20000);

    setTimeout(function(){$(".num1").attr('style','display:block')},40000);
    setTimeout(function(){$(".num2").attr('style','display:block')},41000);
    setTimeout(function(){$(".num3").attr('style','display:block')},42000);
    setTimeout(function(){$(".num4").attr('style','display:block')},43000);
    setTimeout(function(){$(".num5").attr('style','display:block')},44000);
    setTimeout(function(){$(".num6").attr('style','display:block')},45000);
    setTimeout(function(){$(".num7").attr('style','display:block')},46000);
    setTimeout(function(){$(".num8").attr('style','display:block')},47000);
}

function animarTab2(){

    setTimeout(function(){$(".marcadores").attr('style','display:block')},14000);
    setTimeout(function(){$(".tabla").attr('style','display:block')},23000);

    setTimeout(function(){$(".num1_1").attr('style','display:block')},24000);
    setTimeout(function(){$(".num3_1").attr('style','display:block')},25000);
    setTimeout(function(){$(".sumando1").attr('style','display:block')},26000);

    setTimeout(function(){$(".num6_1").attr('style','display:block')},27000);
    setTimeout(function(){$(".sumando2").attr('style','display:block')},28000);

    setTimeout(function(){$(".suma").attr('style','display:block')},29000);
    setTimeout(function(){$(".igual").attr('style','display:block')},30000);
    setTimeout(function(){$(".interrogante").attr('style','display:block')},31000);    

    setTimeout(function(){$(".total").attr('style','display:block')},32000);
    setTimeout(function(){$(".interrogante").attr('style','display:none')},35000);

    setTimeout(function(){$(".num9").attr('style','display:block')},36000);
    setTimeout(function(){$(".num1_2").attr('style','display:block')},39000);    
    
    setTimeout(function(){$(".resultado").attr('style','display:block')},41000);
}