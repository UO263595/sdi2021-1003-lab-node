function agregar( ) {
    $.ajax({
        url: URLbase + "/cancion",
        type: "POST",
        data: {
            nombre : $("#agregar-nombre").val(),
            genero : $("#agregar-genero").val(),
            precio : $("#agregar-precio").val()
        },
        dataType: 'json',
        headers: { "token": token },
        success: function(respuesta) {
            console.log(respuesta); // <-- Prueba
            $( "#contenedor-principal" ).load( "widget-canciones.html");

        },
        error : function (error) {
            $( "#contenedor-principal" ).load("widget-login.html");
        }
    });
}