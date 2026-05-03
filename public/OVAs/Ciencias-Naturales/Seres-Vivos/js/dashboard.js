$(document).ready(function() {
        $('.verificar').css("display", "none");
        $('#principal').css("display", "none");

        var titulo = $("#titulo");
        var descripcion = $("#descripcion");
        var motivacion = $("#motivacion");

        var acordeon = $("#accordion");

        var selTema = $("#selTema");
        var optionTema = '';
        var route_tema = "http://localhost:8000/cargartema";
        var route_tema_id = "http://localhost:8000/cargartema/";
        var route_contenido = "http://localhost:8000/cargarcontenido/";



        
        $.get(route_tema, function(res) {
            $(res).each(function(key, value) {
                optionTema += '<option value=\"' + value.id + '\">' + value.titulo + '<\/option>';
            });
            $("#selTema").empty();
            selTema.append('<select class="form-control" id="tema" name="tema"><option value="" selected="selected">Seleccione un Tema...</option>' + optionTema + '</select>');


            $("#tema").change(function() {
                ///LIMPIAR
                $("#datos").empty();
                $("#titulo").empty();
                $("#descripcion").empty();
                $("#motivacion").empty();
                $("#accordion").empty();

                if($('#tema option:selected').val() == '') {
                    $('.verificar').css("display", "none");
                    $('#principal').css("display", "none");
                    return;
                } else {
                    $('#principal').css("display", "block");
                    $('.verificar').css("display", "block");
                }

                ///RESUMEN
                $.get(route_tema_id + $('#tema option:selected').val(), function(res) {
                    $(res).each(function(key, value) {
                        titulo.append(value.titulo);
                        descripcion.append(value.descripcion);
                        motivacion.append(value.msj_motivacion);
                    });
                });

                ///CONTENIDO
                var count = 0;
                $.get(route_contenido + $('#tema option:selected').val(), function(res) {
                    $(res).each(function(key, value) {
                        var rutas = '';
                        rutas = '<div class="row">' +
                            '<div class="col-sm-12">' +
                            '<dl class="dl-horizontal">' +
                            '  <dt style="text-align: left;">Url actividad 1</dt>' +
                            '  <dd>' + value.url_actividad_uno + '</dd>' +
                            '  <dt style="text-align: left;">Url actividad 2</dt>' +
                            '  <dd>' + value.url_actividad_dos + '</dd>' +
                            '  <dt style="text-align: left;">Url actividad 3</dt>' +
                            '  <dd>' + value.url_actividad_tres + '</dd>' +
                            '  <dt style="text-align: left;">Url actividad 4</dt>' +
                            '  <dd>' + value.url_actividad_cuatro + '</dd>' +
                            '</dl>' +
                            '</div>' +
                            '</div>';

                        acordeon.append('<div class=\"panel panel-default\"><div class=\"panel-heading\" role=\"tab\" id=\"heading' + count + '\"><h4 class=\"panel-title\"><a role=\"button" data-toggle="collapse\" data-parent=\"#accordion\" href=\"#collapse' + count + '\" aria-expanded=\"false\" aria-controls=\"collapse' + count + '\">' + value.orden + '. ' + value.titulo + '<\/a><\/h4><\/div>          <div id=\"collapse' + count + '\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"heading' + count + '\"><div class=\"panel-body\">' + value.descripcion + '<br><br>' + rutas + '<\/div><\/div><\/div>');
                        count = +1;

                    });
                });

                //FIN RESUMEN

            });
        });

    });