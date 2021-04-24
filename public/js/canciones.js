window.history.pushState("", "", "/cliente.html?w=canciones");
var canciones;
function cargarCanciones() {
    $.ajax({
        url: URLbase + "/cancion",
        type: "GET",
        data: { },
        dataType: 'json',
        headers: { "token": token },
        success: function(respuesta) {
            canciones = respuesta;
            actualizarTabla(canciones);
        },
        error : function (error) {
            $( "#contenedor-principal" ).load("widget-login.html");
        }
    });
}
cargarCanciones();
function actualizarTabla(cancionesMostrar) {
    $( "#tablaCuerpo" ).empty(); // Vaciar la tabla
    for (i = 0; i < cancionesMostrar.length; i++) {
        $( "#tablaCuerpo" ).append(
            "<tr id="+cancionesMostrar[i]._id+">"+
            "<td>"+cancionesMostrar[i].nombre+"</td>" +
            "<td>"+cancionesMostrar[i].genero+"</td>" +
            "<td>"+cancionesMostrar[i].precio+"</td>" +
            "<td>"+
            "<a onclick=detalles('"+cancionesMostrar[i]._id+"')>Detalles</a><br>"+
            "<a onclick=eliminar('"+cancionesMostrar[i]._id+"')>Eliminar</a>"+
            "</td>"+
            "</tr>" );
        // Mucho cuidado con las comillas del eliminarCancion
        //la id tiene que ir entre comillas ' '
    }
}
function eliminar( _id ) {
    $.ajax({
        url: URLbase + "/cancion/"+_id,
        type: "DELETE",
        data: { },
        dataType: 'json',
        headers: { "token": token },
        success: function(respuesta) {
            console.log("Eliminada: "+_id);
            $( "#"+_id ).remove(); // eliminar el <tr> de la canción
        },
        error : function (error){
            $( "#contenedor-principal" ).load("widget-login.html");
        }
    });
}
function detalles(_id) {
    idCancionSeleccionada = _id;
    $( "#contenedor-principal" ).load( "widget-detalles.html");
}
function widgetAgregar() {
    $( "#contenedor-principal" ).load( "widget-agregar.html");
}
var precioDsc = true;
function ordenarPorPrecio() {
    if (precioDsc) {
        canciones.sort(function(a, b) {
            return parseFloat(a.precio) - parseFloat(b.precio);
        });
    } else {
        canciones.sort(function(a, b) {
            return parseFloat(b.precio) - parseFloat(a.precio);
        });
    }
    actualizarTabla(canciones);
    precioDsc = !precioDsc; //invertir
}
var nombreAsc = true;
function ordenarPorNombre() {
    if (nombreAsc) {
        canciones.sort(function(a, b) {
            if(a.nombre > b.nombre ) return 1;
            if(a.nombre < b.nombre ) return -1;
            return 0;
        });
    } else {
        canciones.sort(function(a, b) {
            if(a.nombre > b.nombre ) return -1;
            if(a.nombre < b.nombre ) return 1;
            return 0;
        });
    }
    actualizarTabla(canciones);
    nombreAsc = !nombreAsc; //invertir
}
var generoAsc = true;
function ordenarPorGenero() {
    if (generoAsc) {
        canciones.sort(function (a, b) {
            if (a.genero > b.genero) return 1;
            if (a.genero < b.genero) return -1;
            return 0;
        });
    } else {
        canciones.sort(function (a, b) {
            if (a.genero > b.genero) return -1;
            if (a.genero < b.genero) return 1;
            return 0;
        });
    }
    actualizarTabla(canciones);
    generoAsc = !generoAsc; //invertir
}
setInterval(function() {
    cargarCanciones();
}, 5000);
$('#filtro-nombre').on('input',function(e){
    var cancionesFiltradas = [];
    var nombreFiltro = $("#filtro-nombre").val();

    for (i = 0; i < canciones.length; i++) {
        if (canciones[i].nombre.indexOf(nombreFiltro) != -1 ){
            cancionesFiltradas.push(canciones[i]);
        }
    }
    actualizarTabla(cancionesFiltradas);
});