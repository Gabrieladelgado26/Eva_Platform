$(document).ready(function(e) {
	$('body').append('<div id="todosonido"></div>');
    var audio=$('.sonar').data('sonido');
	$('.sonar').mouseover(reproducirsonido(audio));
});
var miclic=0;
function reproducirsonido(audio)
{
	if(miclic==0)
	{
	$('#todosonido').append('<audio id="sonido'+audio+'" src="audios/'+audio+'.mp3"/>');
	$('#sonido'+audio).get(0).play();
	miclic=1;
	}
	else
	{
		$('#todosonido').html("");
		miclic=0;
	}
}
$(document).ready(function() {
	if ($('#tab1').is(':visible')){
		
	};
});

function efectos(elemento,efecto)
{
	$('#'+elemento).addClass(efecto);
}