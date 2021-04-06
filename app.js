// Módulos
let express = require('express');
let app = express();

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload());
let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app, mongo);

// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {
    // dejamos correr la petición
        next();
    } else {
        res.redirect("/identificarse");
    }
});

// routerUsuarioSessionError
var routerUsuarioSessionError = express.Router();
routerUsuarioSessionError.use(function(req, res, next) {
    console.log("routerUsuarioSessionError");
    if ( req.session.usuario ) {
        // dejamos correr la petición
        next();
    } else {
        res.send("ERROR: el usuario debe estar autenticado");
    }
});

//Aplicar routerUsuarioSession
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);
app.use("/comentarios/:cancion_id",routerUsuarioSessionError);

//routerAudios
let routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
    console.log("routerAudios");
    let path = require('path');
    let idCancion = path.basename(req.originalUrl, '.mp3');
    gestorBD.obtenerCanciones(
        {"_id": mongo.ObjectID(idCancion) }, function (canciones) {
            if(req.session.usuario && canciones[0].autor === req.session.usuario) {
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
//Aplicar routerAudios
app.use("/audios/",routerAudios);

//routerComentarios
let routerComentarios = express.Router();
routerComentarios.use(function(req, res, next) {
    console.log("routerComentarios");
    let path = require('path');
    let idComentario = path.basename(req.originalUrl);
    gestorBD.obtenerComentarios(
        {"_id": mongo.ObjectID(idComentario) }, function (comentarios) {
            if(req.session.usuario && comentarios[0].autor === req.session.usuario) {
                next();
            } else {
                res.send("ERROR: el usuario debe ser el autor del comentario");
            }
        })
});
//Aplicar routerComentarios
app.use("/comentario/borrar/:id",routerComentarios);

app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@tiendamusica-shard-00-00.oi3lx.mongodb.net:27017,tiendamusica-shard-00-01.oi3lx.mongodb.net:27017,tiendamusica-shard-00-02.oi3lx.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-f8onfs-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcomentarios.js")(app, swig, gestorBD);

// Lanzar el servidor
app.listen(app.get('port'), function() {
    console.log('Servidor activo');
});