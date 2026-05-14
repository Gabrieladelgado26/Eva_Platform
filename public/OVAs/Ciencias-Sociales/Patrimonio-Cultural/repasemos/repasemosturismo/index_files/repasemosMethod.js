var respuestas=0;
function comprueba(pre,tab)
{
       
    var respuesta=$('#pre'+tab).val();
    if(pre==respuesta){

        
        pintar(pre,tab);

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
        if(tab==3&&respuestas==3){

            $('#mensaje').attr('src','img/lograste.png');
            $('#mensaje').attr('style','display:block');
            reproducionSonido('audio/lograste.mp3'); 
            
        }
        
    }
    else{
        pintar(pre,tab);
        $('#mensaje').attr('src','img/intentalo.png');
        $('#mensaje').attr('style','display:block'); 
        reproducionSonido('audio/intentalo.mp3'); 
        setTimeout(function(){cambioMensaje()},1500);          
    }
}
function pintar(id,tab)
{

    if(id==1){
        $('#pre'+tab+id).attr('style','background:rgba(255,255,255,0.30); border-radius: 8px 8px 8px 8px; width:37%');
        $('#pre'+tab+'2, #pre'+tab+'3, #pre'+tab+'4').removeAttr('style'); 

    }
    else if(id==2){
        $('#pre'+tab+id).attr('style','background:rgba(255,255,255,0.30); border-radius: 8px 8px 8px 8px; width:37%');
        $('#pre'+tab+'1, #pre'+tab+'3, #pre'+tab+'4').removeAttr('style');   
            
    }
    else if(id==3){
        $('#pre'+tab+id).attr('style','background:rgba(255,255,255,0.30); border-radius: 8px 8px 8px 8px; width:37%');
        $('#pre'+tab+'1, #pre'+tab+'2, #pre'+tab+'4').removeAttr('style');

    }
    else if(id==4){
        $('#pre'+tab+id).attr('style','background:rgba(255,255,255,0.30); border-radius: 8px 8px 8px 8px; width:37%');
        $('#pre'+tab+'1, #pre'+tab+'2, #pre'+tab+'3').removeAttr('style');
    }
}

