<!DOCTYPE html>
<!-- saved from url=(0086)http://vadimg.com/twitter-bootstrap-wizard-example/examples/basic-formvalidation.html# -->
	<html>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Language" content="es" />
	<head>
    <title>Juego de tablas de frecuencia</title>
 	<meta name="title" content="Juego de tabla de frecuencia" />
	<meta name="description" content="Juego sobre el tema de tabla de frecuencia"/>
    <!-- Bootstrap -->
    <link href="./index_files/bootstrap.min.css" rel="stylesheet">
	<link href="./index_files/prettify.css" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="animate.css" media="screen" />
	<link rel="stylesheet" type="text/css" href="stylejuego1.css" media="screen" />

	
	
	<!--indexa en la bd del buscador-->
	<meta name="robots" content="index,follow" />
	<!--ajusta a las dimensiones donde se vea-->
	<meta name="viewport" content="width=device-width,initial-scale=1"/>

  </head>
				<div id="todosonido"></div>
				<div id="todosonido2"></div>
				<div class="tab-content" style="width: 97%">
					
					    <img id="mensaje" class="respuesta" src="img/correcto.png" style="display:none"/>					     				     
					     <a id="redir" href=""><img id="mensaje2" class="respuestafin" src="img/intentalo.png" style="display:none"/></a>		   
					     
					      <div class="tab-pane active" id="tab1">
					      <div class="Skin2">					      			      	
					      <img class="Skin2" src="img/Fondo1.png">
					       <img class="sonidointro sonido_click" src="img/sonido.png" data-sonido="sonidos/intro.mp3">
					      <img class="titulo sonido_hover" src="img/titulo.png" data-sonido="sonidos/titulo.mp3">
					      <div id="parrafointro" class="parrafointro I18N ">juego1gastronomia1</div>
					      <img class="intro" src="img/intro.png">   
							<a href="#tab2" data-toggle="tab" ><img class="divbotones cambiarImagen" src="img/continuar.png" onclick="inicioJuego()" data-sonido="sonidos/continuar.mp3"></a>	
 						  </div>
					    </div>

					      <div class="tab-pane" id="tab2">
					      <div class="Skin2">						      			      	
					      <img class="Skin2" src="img/Fondo1.png">
					      <div id="numeros">
					      </div>
					      <div id="general" style="display:none">
					      <input id="vidas" type="hidden">
					      <img  id="vida" class="vidas">
					      <img class="titulo sonido_hover" src="img/titulo.png" data-sonido="sonidos/titulo.mp3">
					      <img class="sonido sonido_click" src="img/sonido.png" data-sonido="sonidos/enunciado.mp3">
					      <div class="parrafo I18N">juego1gastronomia2</div>
					      <div id="complementos" >		
    
					    <div style="left: 10%; top: 36%; position: absolute; z-index: 5; width: 74%; ">
						    <div class="divbarra"> <div class="progress">
							  <div class="progress-bar progress-bar-danger progress-bar-striped" id="progress" role="progressbar"
							  aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:0%">
							  </div>
							</div> </div> 
					    </div>
					    
					    <!--MENSAJE DE CADA CARTA-->
					    <div id="mensajeText" class="animated zoomIn">
					    <h3 style="color: #8e24aa;">
					    RECUERDA
					    </h3>
					    <img id="carta">
					    <p id="mensajillo" style="text-align: left; margin-left: 43%; margin-top: 8%; margin-right: 6%;" class="infosjuego"></p>   
					    <br>
					    <a onclick="ocultarmsj()" id="Seguir" class="sonido_hover" data-sonido="sonidos/continuar.mp3">Continuar</a>
					    </div>
					    <!--FIN MENSAJE DE CADA CARTA-->
					    
					    <?php
					        
							$mi=array(1,2,3,4,5,6);
							   
							$micount=0;
							for($i=6;$i<12;$i++)
							{
								$mi[$i]=$mi[$micount];
								$micount++;
							}
							shuffle ($mi);

						for($p=0; $p<12;$p++)
						{?>
						<a href="#" onclick="this.blur();return false">
						<img id="<?php echo $mi[$p] ?>" class="imagen<?php echo $p+1 ?>" onclick="gira(this,this.id)" src="img/tapa.png" width="85" height="120" class="img-thumbnail aumentar">
						</a>
					    <?php
						}
						?>
    
    <!-- fin zona de trabajo -->		      
						 
					      </div>
					      
						 </div>
 						  </div>
					    </div>


					</div>
		</html>		


    <script src="./index_files/jquery-latest.js"></script>
    <script src="./index_files/bootstrap.min.js"></script>
	<script src="./index_files/jquery.bootstrap.wizard.js"></script>
	<script src="./index_files/prettify.js"></script>	
	<script src="./index_files/generalesJuegos.js"></script>
	<script src="./index_files/juegoMethod.js"></script>		


	<!--ARCHIVO PROPERTIES-->
	<script src="../../../js/I18N/es.js"></script>
	<script src="../../../js/funcion.js"></script>
  
