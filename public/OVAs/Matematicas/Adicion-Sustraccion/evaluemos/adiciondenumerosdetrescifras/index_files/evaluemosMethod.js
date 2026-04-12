var prueba1=0, prueba2=0, prueba3=0, prueba4=0, prueba5=0, totalBuenas=0,totalMalas=0, marco=0, pre=0, primera=0, retro=0,inicial=0;
var anterior='', desordenadas='';
var preguntas=['1','2','3','4','5'];

function desordenar()
{
	desordenadas=shuffle(preguntas);
	asignarTabs();
}

function shuffle(array){ // v2005-06-01
    var i=array.length;
    while(i--){
        var j=Math.floor( Math.random() * (i+1) );
        var tmp=array[i];
        array[i]=array[j];
        array[j]=tmp;
    }
    return array;
}

function asignarTabs()
{
	$("#tab0").attr('style','display:table');
}

/*INICIO CAPTURA PANTALLA*/
	$(document).ready(resizeContent);
	$(window).resize(resizeContent);
	function resizeContent() {
	  var res = $(window).width()/(750 * 1);
	  if($(window).width()<=750)
	  {
	  $("body").css({'zoom': res});
	  }
	}
/*FIN CAPTURA PANTALLA*/

function validar(clase,id)
{
	$(".opcion"+anterior).removeAttr("style");
	anterior=clase;
	if(id==1){prueba1=1;}
	else{prueba1=0;}	
	$(".opcion"+clase).attr("style","color: #FFF; background: #9C2AB3;");
	marco=1;
}
function validar2(clase,id)
{
	$(".opcion"+anterior).removeAttr("style");
	anterior=clase;
	if(id==1){prueba2=1;}
	else{prueba2=0;}	
	$(".opcion"+clase).attr("style","color: #FFF; background: #9C2AB3;");
	marco=1;
}
function validar3(clase,id)
{
	$(".respuestaimagen"+anterior).removeAttr("style");
	anterior=clase;
	if(id==1){prueba3=1;}
	else{prueba3=0;}
	$(".respuestaimagen"+clase).attr("style","color: #FFF; border-radius: 8px; border: 9px solid #9C2AB0;");
	marco=1;
}
function validar4(clase,id)
{
	$(".opcion"+anterior).removeAttr("style");
	anterior=clase;
	if(id==1){prueba4=1;}
	else{prueba4=0;}
	$(".opcion"+clase).attr("style","color: #FFF; background: #9C2AB3;");
	marco=1;
}
function validar5(clase,id)
{
	$(".opcion"+anterior).removeAttr("style");
	anterior=clase;
	if(id==1){prueba5=1;}
	else{prueba5=0;}
	$(".opcion"+clase).attr("style","color: #FFF; background: #9C2AB3;");
	marco=1;
}

function siguiente()
{
	if (primera==0){
		$("#tab0").attr('style','display:none');
		$("#tab"+desordenadas[pre]).attr('style','display:table');
		primera++;
	}
	else{
		if(marco==1){
			$(".opcion"+anterior).removeAttr("style");
			anterior='';
			if (pre==4){
				$("#tab"+desordenadas[pre]).attr('style','display:none');
				$("#tab6").attr('style','display:table');
			}
			if(pre<=3){
				$("#tab"+desordenadas[pre]).attr('style','display:none');	
				pre++;
				$("#tab"+desordenadas[pre]).attr('style','display:table');
			}	
			marco=0;
		}
		else
		{
			$(".divmarca").attr("style",'display:table');
			setTimeout(function(){$(".divmarca").attr("style",'display:none')},1600);
		}
	}
}

function termino()
{
	resultado();
	if(totalBuenas>3){
		$("#ganaste").attr("style",'position: absolute; top: 1%; left: 15%; display: table; width: 12%; display:table;');	
	}
	else{
		$("#perdiste").attr("style",'position: absolute; top: 1%; left: 15%; display: table; width: 12%; display:table;');	
	}
	totalBuenas=0;
	totalMalas=0;
}

function retroalimentacion()
{	
	var respuestas=[prueba1,prueba2,prueba3,prueba4,prueba5];
	if(inicial==0){
		$("#tab6").attr('style','display:none');
		$("#tabretro"+desordenadas[retro]).attr('style','display:table');
		inicial=1;
	}else
	{
		if (retro==4){
			$("#tabretro"+desordenadas[retro]).attr('style','display:none');
			$("#tabresultados").attr('style','display:table');
			termino();
		}
		if (retro<=3){
			$("#tabretro"+desordenadas[retro]).attr('style','display:none');	
			retro++;
			$("#tabretro"+desordenadas[retro]).attr('style','display:table');
		}
	}
	if(respuestas[(desordenadas[retro]-1)]==1){
		$("#b"+desordenadas[retro]).attr("style","position: absolute; top: 16%; left: 36%; display:table;");
		$("#m"+desordenadas[retro]).attr("style","display:none");
		$("#bt"+desordenadas[retro]).attr("style","position: absolute; top: 9%; display:table; padding-right: 19%;");
		$("#mt"+desordenadas[retro]).attr("style","display:none");
	}
	else{
		$("#b"+desordenadas[retro]).attr("style","display:none");
		$("#m"+desordenadas[retro]).attr("style","position: absolute; top: 16%; left: 36%; display:table;");
		$("#mt"+desordenadas[retro]).attr("style","position: absolute; top: 9%; display:table; padding-right: 19%;");
		$("#bt"+desordenadas[retro]).attr("style","display:none");
	}
}

function resultado()
{
	if(prueba1==1){
		totalBuenas++;
		$("#rc1").attr("style","display:table;");
	}
	else{
		totalMalas++;
		$("#ri1").attr("style","display:table;");
	}
	if(prueba2==1){
		totalBuenas++;
		$("#rc2").attr("style","display:table;");
	}
	else{
		totalMalas++;
		$("#ri2").attr("style","display:table;");
	}
	if(prueba3==1){
		totalBuenas++;
		$("#rc3").attr("style","display:table;");
	}
	else{
		totalMalas++;
		$("#ri3").attr("style","display:table;");
	}
	if(prueba4==1){
		totalBuenas++;
		$("#rc4").attr("style","display:table;");
	}
	else{
		totalMalas++;
		$("#ri4").attr("style","display:table;");
	}
	if(prueba5==1){
		totalBuenas++;
		$("#rc5").attr("style","display:table;");
	}
	else{
		totalMalas++;
		$("#ri5").attr("style","display:table;");
	}
	$("#buenas").val(totalBuenas);
}

function limpiar()
{
	for (var i = 1; i <= 5; i++) {
		$("#rc"+i).attr("style","display:none;");
		$("#ri"+i).attr("style","display:none;");
	}
	$("#ganaste, #perdiste").attr("style","display:none;");
	$(".opcion1, .opcion2, .opcion3, .opcion4, .respuestaimagena, .respuestaimagenb, .respuestaimagenc, .respuestaimagend").removeAttr("style");
	prueba1=0, prueba2=0, prueba3=0, prueba4=0, prueba5=0, totalBuenas=0,totalMalas=0, marco=0, pre=0, primera=0, retro=0,inicial=0;
	anterior='', desordenadas='';
	volverIntentar();
}

function volverIntentar()
{
	$("#tab0").attr('style','display:table');
	$("#tabresultados").attr('style','display:none');
	desordenar();
}

function regresar()
{	
	if (retro==0){
		$("#tabretro"+desordenadas[retro]).attr('style','display:none');	
		$("#tab6").attr('style','display:table');
		inicial=0;
	}
	else{
		$("#tabretro"+desordenadas[retro]).attr('style','display:none');	
		retro--;
		$("#tabretro"+desordenadas[retro]).attr('style','display:table');
	}
}