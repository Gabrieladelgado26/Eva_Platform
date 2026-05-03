

var numero= [1,2,3,4];
var numeros= shuffle(numero);

var tab = 0;

$(document).ready(function() {
	pasarnivel();
 });

function pasarnivel(){
	tab++;
	$('#div1').html('');
	$('#div2').html('');
	$('#div3').html('');
	$('#fondoopciones').html('');
	$('#verificar').attr('style', 'display:none');

	if(tab==5){
		$('#complementos').html('');
		finalizarGano(tab,5);
	}	
	else
	{    	
		dibujarobjetos(tab);
	}	
}

function dibujarobjetos(tab)
{		
	var objeto= [1,2,3];
	var objetos= shuffle(objeto);
	
		for(i=1;i<=3; i++){
		$('#fondoopciones').append('<img class="imgn'+i+' opcion" id="o-'+objetos[i-1]+'" draggable="true" ondragstart="start(event)" ondragend="end(event)" src="img/'+objetos[(i-1)]+'_'+numeros[(tab-1)]+'.png" onmouseover="reproducionSonido(\'sonidos/'+objetos[(i-1)]+'_'+numeros[(tab-1)]+'.mp3\')">');
	}
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
    if(($('#'+padre+' .opcion').length == 0) && $('#'+padre).attr('id') != 'fondoopciones')
    {
    	e.target.appendChild(document.getElementById(ea));
    }
    if($('#'+padre).attr('id') == 'fondoopciones')
    {
    	e.target.appendChild(document.getElementById(ea));
    }
	
    //Verificar
    if($('#div1 img').length == 1 && $('#div2 img').length == 1 && $('#div3 img').length == 1)
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
	var sr1= $('#div1').attr('src');
	var s1= sr1.split('.');
	var r1= s1[0].split('/');	
	var im1= r1[1];

	var sr2= $('#div2').attr('src');
	var s2= sr2.split('.');
	var r2= s2[0].split('/');
	var im2= r2[1];
	
	var sr3= $('#div3').attr('src');
	var s3= sr3.split('.');
	var r3= s3[0].split('/');
	var im3= r3[1];

	var sp1= $('#div1').children('img').attr('id');
	st1= sp1.split('-');
	var sp2= $('#div2').children('img').attr('id');
	st2= sp2.split('-');
	var sp3= $('#div3').children('img').attr('id');
	st3= sp3.split('-');

	if (im1 == st1[1] && im2 == st2[1] && im3 == st3[1]) 
	{
		mostrarAlertas('img/correcto.png', 1300);
		reproducionSonido('sonidos/pasanivel.wav');
		setTimeout(function(){pasarnivel();},1300);
			
	}	
	else
	{
		mostrarAlertas('img/incorrecto.png', 1500);
		reproducionSonido('sonidos/nop.wav');
		var vidas = $('#vidas').val();
		$('#vidas').val(vidas-1);
		validarVidas();
		$('#div1').html('');
		$('#div2').html('');
		$('#div3').html('');
		$('#fondoopciones').html('');
		dibujarobjetos(tab);
	}
}
