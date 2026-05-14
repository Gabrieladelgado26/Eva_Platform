$(document).ready(function() {
	reiniciar();	
	$('#mensajeText').hide();
});

var directorio = "img/"; //directorio o ruta a donde se guardan las imágenes
var numImagenes = 6; //cantidad de imágenes que existan en el directorio
//var perder =100;//Numero de intentos a los que se pierde

var nums=new Array();
var cant = 6;//Seis parejas
var aciertos = 0;

cont = 0;
var gi1,gi2;
function gira(cual,carta)
{
	reproducionSonido('sonidos/sip.wav');
var msjs  = ["Cuida el agua",
			 "Lapingachos es el plato típico del municipio de Ipiales.", 
			 "El cuy es un plato representativo del municipio de Pasto.",
			 "En San Pablo se toma un delicioso café.",
			 "El plato típico del municipio de Tumaco es el Tapao.",
			 "En barbacoas el plato típico es el Pusandao.",
			 "En La Union es muy tipico los batidos a base de mani o melcochas."];	
			 
document.getElementById('mensajillo').innerHTML=msjs[carta]+" <img src="+directorio + "/" + carta + ".png";
$('#carta').attr('src','img/'+carta+'.png');
if(cual != gi1){cont++}
if(cont < 3)
	{
		cual.src = directorio + carta + ".png";
	if(cont==1){		
		gi1 = cual;}
	else{
		gi2 = cual;  
		comp()}
	}
	
}
var micontador=0;

function comp()
{
	if(gi1.src == gi2.src)
	{
		gi1.onclick=null;gi2.onclick=null;
		
		aciertos++;
		micontador=0;
		setTimeout("limpiarBarra()",1500);
		if(aciertos<=cant)
		{
			mostrarAlertas('img/correcto.png', 1500);
			reproducionSonido('sonidos/pasanivel.wav');
			$('#mensajeText').show();
		}
		
		if(aciertos == cant) 
		{
			setTimeout(function(){ finalizarGano(cant,aciertos);},1500);
		}
		
		cont = 0
	}
	else
	{
		micontador++;
		actualizarBarra();
		if(micontador==3)
		{
			mostrarAlertas('img/incorrecto.png', 1500);
			reproducionSonido('sonidos/nop.wav');	
			var vidas = $('#vidas').val();
			$('#vidas').val(vidas-1);
			validarVidas();
			micontador=0;	
			setTimeout("limpiarBarra()",1500);
		};
		setTimeout("restaura()",1500); 
	
	}

}
function actualizarBarra(){
	var wi=document.getElementById("progress").style.width;
	var valor=parseInt(wi.substring(0, wi.length-1));
		$("#progress").attr('style','width:'+(valor + 34)+'%; background:#E53935; text-align: center; font-family: Nunito; font-weight: bold;color: white;');
		document.getElementById("progress").innerHTML = "¡Ups!";
}
function limpiarBarra(){
		document.getElementById("progress").style.width = "0%";
		document.getElementById("progress").innerHTML = "";
}
function restaura()
	{
	gi1.src = directorio + "/" + "tapa.png" ; gi1 ="";
	setTimeout('gi2.src = directorio + "/tapa.png";gi2=""',200)
	cont = 0;
	//intentos ++;
	}
	
function ocultarmsj(){
	$('#mensajeText').hide();
}
