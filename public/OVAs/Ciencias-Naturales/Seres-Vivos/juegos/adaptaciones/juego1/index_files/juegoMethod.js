var planta=[1,2,3,4];
var plantas= shuffle(planta);

var escenario=[1,2,3,4];
var escenarios= shuffle(escenario);
var cont=0;


$(document).ready(function() {
	pasarnivel();
 });


function pasarnivel(){
	$('#verificar').attr('style','display: none');
	cont++;
	$('#fondoplantas').html('');
	$('#escenario1').html('');
	$('#escenario2').html('');
	
	if(cont==3){
		$('#complementos').html('');		
		finalizarGano(cont,3);	
	}	
	else
	{    	
		dibujarescenario();
		dibujarimg();	
	}	
}


function dibujarimg()
{
	$('#fondoplantas').html('');
	for(var i=1; i <= 4; i++)
	{
		$('#fondoplantas').append('<img class="planta'+i+' planta" id="p'+i+'" data-respuesta="planta-'+plantas[i-1]+'" draggable="true" ondragstart="start(event)" ondragend="end(event)" src="img/'+plantas[i-1]+'-1.png" onmouseover="reproducionSonido(\'sonidos/'+plantas[i-1]+'-1.mp3\')">');
	}	
}

function dibujarescenario()
{		
		if(cont == 1)
		{
			var a= 0;
			var b= 1;
		}
		else
		{
			var a= 2;
			var b= 3;
		}
		$('#escenario1').attr('data-respuesta',escenarios[a]);
		$('#escenario1').attr('style','background-image:url("img/'+escenarios[a]+'.png");');
		$('#escenario1').attr('onmouseover','reproducionSonido("sonidos/'+escenarios[a]+'.mp3")');

		$('#escenario2').attr('data-respuesta',escenarios[b]);
		$('#escenario2').attr('style','background-image:url("img/'+escenarios[b]+'.png");');
		$('#escenario2').attr('onmouseover','reproducionSonido("sonidos/'+escenarios[b]+'.mp3")');
}

/**
* Función que se ejecuta al arrastrar el elemento. 
**/
function start(e) {
    e.dataTransfer.effecAllowed = 'move'; // Define el efecto como mover (Es el por defecto)
    e.dataTransfer.setData("Text", e.target.id); // Coje el elemento que se va a mover
    e.target.style.opacity = '0.4'; 
}

/**
* Función que se ejecuta se termina de arrastrar el elemento. 
**/
function end(e){
    e.target.style.opacity = ''; // Restaura la opacidad del elemento           
    e.dataTransfer.clearData("Data");           
}

/**
* Función que se ejecuta cuando un elemento arrastrable entra en el elemento desde del que se llama. 
**/
function enter(e) {
    return true;
}

/**
* Función que se ejecuta cuando un elemento arrastrable esta sobre el elemento desde del que se llama. 
* Devuelve false si el objeto se puede soltar en ese elemento y true en caso contrario.
**/
function over(e) {
    if ((e.target.className == "arrastrable"))
        return false;
    else
    return true;
}

function drop(e)
{
	e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
    var ea = e.dataTransfer.getData("Text");
  	var padre = e.target.id;

    if($('#'+padre+' .planta').length ==0)
    {
    	  e.target.appendChild(document.getElementById(ea));
    }

    if(	padre == 'fondoplantas')
    {
    	  e.target.appendChild(document.getElementById(ea));
    }


    //Verificar
    if($('#escenario1 img').length ==1 && $('#escenario2 img').length ==1 )
    {
    	$('#verificar').attr('style','display: block');
    }
    else
    {
    	$('#verificar').attr('style','display: none');
    }
}

function validar()
{
	var sr= $('#escenario1').attr('data-respuesta');
	var sr2= $('#escenario2').attr('data-respuesta');
	
	var sp= $('#escenario1').children('img').attr('data-respuesta');
	var sp2= $('#escenario2').children('img').attr('data-respuesta');
	var pl= sp.split('-');
	var pl2= sp2.split('-');
	var img= pl[1];
	var img2= pl2[1];
	
	if ((sr == img) && (sr2 == img2))
	{
		mostrarAlertas('img/correcto.png', 1000);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){pasarnivel();},1000);
		
	}
	else
	{
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();
		$('#verificar').attr('style','display: none');
		$('#escenario1').html('');
		$('#escenario2').html('');
		dibujarimg();
	}
}