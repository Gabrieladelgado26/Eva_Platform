var respuestas=$('#resultados').val();
var res=respuestas.split("-");
function comprueba()
{	
	var valor1 = $('#1').val();
	var valor2 = $('#2').val();
	var valor3 = $('#3').val();
	var valor4 = $('#4').val();
	var valor5 = $('#5').val();
	var valor6 = $('#6').val();
	var valor7 = $('#7').val();
	var valor8 = $('#8').val();
	var valor9 = $('#9').val();
	var valor10 = $('#10').val();
	var valor11 = $('#11').val();
	var valor12 = $('#12').val();

	if(valor1==''||valor2==''||valor3==''||valor4==''||valor5==''||valor6==''||valor7==''||valor8==''||valor9==''||valor10==''||valor11==''||valor12==''||valor1==0||valor2==0||valor3==0||valor4==0||valor5==0||valor6==0||valor7==0||valor8==0||valor9==0||valor10==0||valor11==0||valor12==0){
		
		$('#alerta').attr('style','display:block');
		reproducionSonido('audio/alerta.wav');
		setTimeout(function(){$('#alerta').attr('style','display:none')},1500);
  	}
  	else{	  	
	  	if(valor1==res[0]&&valor2==res[1]&&valor3==res[2]&&valor4==res[3]&&valor5==res[4]&&valor6==res[5]&&valor7==res[6]&&valor8==res[7]&&valor9==res[8]&&valor10==res[9]&&valor11==res[10]&&valor12==res[11]){
			$('#mensaje').attr('src','img/logro.png');
			$('#mensaje').attr('style','display:block');				
			reproducionSonido('audio/logro.mp3');
            setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
		}
		else
		{	
			$('#mensaje').attr('src','img/intenta.png');
			$('#mensaje').attr('style','display:block');
			reproducionSonido('audio/intentalo.wav');		
			setTimeout(function(){$('#mensaje').attr('style','display:none')},1500);
			limpiar();
		}
  	}

}

function limpiar()
{
	$('#1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12').val('');
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

        setTimeout(function(){$(".ope1_sutr").attr('style','display:block')},17000);
        setTimeout(function(){$(".minuendo").attr('style','display:block')},19000);
        setTimeout(function(){$(".sustraendo").attr('style','display:block')},20000);
        setTimeout(function(){$(".diferencia").attr('style','display:block')},21000);
}  

function animarTab2(){

        setTimeout(function(){$(".alquipitos").attr('style','display:block')},14000);
        setTimeout(function(){$(".num1").attr('style','display:block')},14000);
        setTimeout(function(){$(".num2").attr('style','display:block')},14000);
        setTimeout(function(){$(".num3").attr('style','display:block')},14000);
        setTimeout(function(){$(".num4").attr('style','display:block')},14000);
        setTimeout(function(){$(".num5").attr('style','display:block')},14000);
        setTimeout(function(){$(".num6").attr('style','display:block')},14000);
        setTimeout(function(){$(".num7").attr('style','display:block')},14000);
        setTimeout(function(){$(".num8").attr('style','display:block')},14000);
        setTimeout(function(){$(".num9").attr('style','display:block')},14000);
        setTimeout(function(){$(".num10").attr('style','display:block')},14000);
        setTimeout(function(){$(".num11").attr('style','display:block')},14000);
        setTimeout(function(){$(".num12").attr('style','display:block')},14000);

        setTimeout(function(){$(".num1").attr('style','display:none')},25000);
        setTimeout(function(){$(".num2").attr('style','display:none')},25000);
        setTimeout(function(){$(".num3").attr('style','display:none')},25000);
        setTimeout(function(){$(".num4").attr('style','display:none')},25000);
        setTimeout(function(){$(".num5").attr('style','display:none')},25000);
        setTimeout(function(){$(".num6").attr('style','display:none')},25000);
        setTimeout(function(){$(".num7").attr('style','display:none')},25000);
        setTimeout(function(){$(".num8").attr('style','display:none')},25000);
        setTimeout(function(){$(".num9").attr('style','display:none')},25000);
        setTimeout(function(){$(".num10").attr('style','display:none')},25000);
        setTimeout(function(){$(".num11").attr('style','display:none')},25000);
        setTimeout(function(){$(".num12").attr('style','display:none')},25000);

        setTimeout(function(){$(".num1").attr('style','display:block')},26000);
        setTimeout(function(){$(".tachar1").attr('style','display:block')},26000);
        setTimeout(function(){$(".num2").attr('style','display:block')},27000);
        setTimeout(function(){$(".tachar2").attr('style','display:block')},27000);
        setTimeout(function(){$(".num3").attr('style','display:block')},28000);  
        setTimeout(function(){$(".tachar3").attr('style','display:block')},28000);

        setTimeout(function(){$(".num1").attr('style','display:none')},29000);
        setTimeout(function(){$(".num2").attr('style','display:none')},29000);
        setTimeout(function(){$(".num3").attr('style','display:none')},29000);

        setTimeout(function(){$(".num1_1").attr('style','display:block')},32000);
        setTimeout(function(){$(".num2_1").attr('style','display:block')},33000);
        setTimeout(function(){$(".num3_1").attr('style','display:block')},34000);
        setTimeout(function(){$(".num4_1").attr('style','display:block')},35000);
        setTimeout(function(){$(".num5_1").attr('style','display:block')},36000);
        setTimeout(function(){$(".num6_1").attr('style','display:block')},37000);
        setTimeout(function(){$(".num7_1").attr('style','display:block')},38000);
        setTimeout(function(){$(".num8_1").attr('style','display:block')},39000);
        setTimeout(function(){$(".num9_1").attr('style','display:block')},40000);

        setTimeout(function(){$(".ope2_sutr").attr('style','display:block')},41000);
        setTimeout(function(){$(".resultado").attr('style','display:block')},45000);
        
}  

function animarTab3(){

        setTimeout(function(){$(".tapas").attr('style','display:block')},12000);
        setTimeout(function(){$(".tachar4").attr('style','display:block')},14000);
        setTimeout(function(){$(".tachar5").attr('style','display:block')},14500);
        setTimeout(function(){$(".tachar6").attr('style','display:block')},15000);
        setTimeout(function(){$(".tachar7").attr('style','display:block')},15500);

        setTimeout(function(){$(".tabla").attr('style','display:block')},21000);

        setTimeout(function(){$(".num1_2").attr('style','display:block')},21000);
        setTimeout(function(){$(".num8_2").attr('style','display:block')},22000);
        setTimeout(function(){$(".minuendo2").attr('style','display:block')},23000);

        setTimeout(function(){$(".num4_2").attr('style','display:block')},24000);        
        setTimeout(function(){$(".sustraendo2").attr('style','display:block')},25000);
        
        setTimeout(function(){$(".menos").attr('style','display:block')},26000);
        setTimeout(function(){$(".igual").attr('style','display:block')},27000);        
        setTimeout(function(){$(".diferencia2").attr('style','display:block')},28000);
        setTimeout(function(){$(".interrogante").attr('style','display:block')},29000);
        
        setTimeout(function(){$(".interrogante").attr('style','display:none')},35000);        
        setTimeout(function(){$(".num4_3").attr('style','display:block')},37000);
        setTimeout(function(){$(".num1_3").attr('style','display:block')},40000);
} 

    

