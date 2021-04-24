$.ajax({
    url : URLbase + "/cancion/" + idCancionSeleccionada ,
    type : "GET",
    data : {},
    dataType : 'json',
    headers : {
        "token" : token
    },
    success : function(cancion) {
        $("#detalles-nombre").val(cancion.nombre);
        $("#detalles-genero").val(cancion.genero);
        $("#detalles-precio").val(cancion.precio);
    },
    error : function(error) {
        $( "#contenedor-principal" ).load("widget-login.html");
    }
});