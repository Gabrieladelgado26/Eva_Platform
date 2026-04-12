//Ajustar Pantalla
$(document).ready(resizeContent);
$(window).resize(resizeContent);
function resizeContent() {
    var res = $(window).width()/(750 * 1);
    if($(window).width()<=750)
    {
    $("body").css({'zoom': res});
    }
}

//Juego
var respuestas=0;
function comprueba(pre,tab)
{
    var valor = $('#caja'+tab).val();
   
    if(valor==""){
        
        $('#alerta').attr('style','display:block');
        reproducionSonido('audio/alerta.mp3');
        setTimeout(function(){$('#alerta').attr('style','display:none')},1500);        
    }
    else
    {
        var respuesta=$('#pre'+tab).val();
        var valorValido=0;

        if(pre==respuesta){
            
            pintar(pre,tab);

            $('#resulOpcion'+tab).attr('style','background: rgba(220, 231, 117, 0.31); border-radius: 8px 8px 8px 8px; z-index: 3; width: 16%;');
            
            if(valor==8&&tab==1 || valor==3&&tab==2 || valor==3&&tab==3 || valor==5&&tab==4)
            {
                valorValido=1;
            }

            if(valorValido==1){
                $('#mensaje').attr('src','img/felicitaciones.png');
                $('#mensaje').attr('style','display:block');
                reproducionSonido('audio/felicitaciones.mp3'); 
                setTimeout(function(){cambioMensaje()},1500);

                setTimeout(function(){
                    $('#sig'+tab).click()
                    $('#sig'+tab).show();
                    $('#pre'+tab+'1').removeAttr('onclick');
                    $('#pre'+tab+'2').removeAttr('onclick');
                    $('#pre'+tab+'3').removeAttr('onclick');
                    $('#pre'+tab+'4').removeAttr('onclick');
                },1500);                 

                respuestas++;

                if(tab==4&&respuestas==4){

                    $('#mensaje').attr('src','img/logro.png');
                    $('#mensaje').attr('style','display:block');
                    reproducionSonido('audio/logro.mp3'); 
                    setTimeout(function(){
                        $('#volver').show();                        
                    },1500);  
                } 
            }
            else{
                $('#alerta2').attr('style','display:block');
                reproducionSonido('audio/alerta2.mp3');
                setTimeout(function(){$('#alerta2').attr('style','display:none')},1500);

                setTimeout(function(){$('#caja'+tab).val('')},2000);
                $('#caja'+tab).focus();
                $('#pre'+tab+'1, #pre'+tab+'2, #pre'+tab+'3, #pre'+tab+'4').removeAttr('style');
            }                        
        }
        else{

            pintar(pre,tab);
         
            $('#mensaje').attr('src','img/intenta.png');
            $('#mensaje').attr('style','display:block'); 
            reproducionSonido('audio/intentalo.wav'); 
            setTimeout(function(){cambioMensaje()},1500);          
        }
        
    }       
    
}

function pintar(id,tab)
{   
    var imagen = "";

    if(id==1){

        imagen = $('.resultado1').attr('src');
        $('#resul'+tab).attr('src',imagen);        

        $('#pre'+tab+id).attr('style','background: rgba(248, 148, 6, 0.28); border-radius: 8px 8px 8px 8px; width:14%');        
        $('#pre'+tab+'2, #pre'+tab+'3, #pre'+tab+'4').removeAttr('style'); 

    }
    else if(id==2){

        imagen = $('.resultado2').attr('src');
        $('#resul'+tab).attr('src',imagen);

        $('#pre'+tab+id).attr('style','background: rgba(248, 148, 6, 0.28); border-radius: 8px 8px 8px 8px; width:14%');
        $('#pre'+tab+'1, #pre'+tab+'3, #pre'+tab+'4').removeAttr('style');   
            
    }
    else if(id==3){

        imagen = $('.resultado3').attr('src');
        $('#resul'+tab).attr('src',imagen);

        $('#pre'+tab+id).attr('style','background: rgba(248, 148, 6, 0.28); border-radius: 8px 8px 8px 8px; width:14%');
        $('#pre'+tab+'1, #pre'+tab+'2, #pre'+tab+'4').removeAttr('style');

    }
    else if(id==4){

        imagen = $('.resultado4').attr('src');
        $('#resul'+tab).attr('src',imagen);

        $('#pre'+tab+id).attr('style','background: rgba(248, 148, 6, 0.28); border-radius: 8px 8px 8px 8px; width:14%');
        $('#pre'+tab+'1, #pre'+tab+'2, #pre'+tab+'3').removeAttr('style');
    }
}

function cambioMensaje(){
    $('#mensaje').attr('style','display:none');
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

function reiniciar(){
        respuesta = 0; 
        $('#caja1').val('');
        $('#caja2').val('');
        $('#caja3').val('');
        $('#caja4').val('');
        $('#pre11, #pre12, #pre13, #pre14').removeAttr('style'); 
        $('#pre21, #pre22, #pre23, #pre24').removeAttr('style'); 
        $('#pre31, #pre32, #pre33, #pre34').removeAttr('style'); 
        $('#pre41, #pre42, #pre43, #pre44').removeAttr('style'); 
        $('#resul1').attr('src','');
        $('#resul2').attr('src','');  
        $('#resul3').attr('src','');  
        $('#resul4').attr('src','');
        $('#sig1').hide();   
        $('#sig2').hide(); 
        $('#sig3').hide();  
        imagen = "";
        valorValido=0;   
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

    setTimeout(function(){$(".chocolates").attr('style','display:block')},15000);
    setTimeout(function(){$(".tabla").attr('style','display:block')},18000);

    setTimeout(function(){$(".num1").attr('style','display:block')},19000);
    setTimeout(function(){$(".num2").attr('style','display:block')},20000);
    setTimeout(function(){$(".num3").attr('style','display:block')},21000);

    setTimeout(function(){$(".num4").attr('style','display:block')},22000);
    setTimeout(function(){$(".num5").attr('style','display:block')},23000);
    setTimeout(function(){$(".num6").attr('style','display:block')},24000);

    setTimeout(function(){$(".menos").attr('style','display:block')},25000);
    setTimeout(function(){$(".igual").attr('style','display:block')},26000);
    setTimeout(function(){$(".interrogante").attr('style','display:block')},27000);

    setTimeout(function(){$(".interrogante").attr('style','display:none')},30000);

    setTimeout(function(){$(".num7").attr('style','display:block')},33000);
    setTimeout(function(){$(".num8").attr('style','display:block')},40000);
    setTimeout(function(){$(".num9").attr('style','display:block')},46000);

    setTimeout(function(){$(".resultado").attr('style','display:block')},48000);
}