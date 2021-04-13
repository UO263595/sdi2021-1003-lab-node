const req = require("express");
module.exports = function(app, swig, gestorBD) {
    app.get('/favoritos/add/:cancion_id', function (req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.cancion_id) };
        gestorBD.obtenerCanciones(criterio,function(canciones) {
            if (canciones == null) {
                req.session.errores = {
                    mensaje : "Error al recuperar la canción",
                    tipoMensaje : "alert-danger"
                }
                res.redirect("/favoritos");
            } else {
                req.session.cancionesFavoritas.push(canciones[0]);
                res.redirect("/favoritos");
            }
        });
    });

    app.get('/favoritos', function (req, res) {
        let precioTotal = 0;
        if (req.session.cancionesFavoritas) {
            req.session.cancionesFavoritas.forEach(function (cancionFavorita) {
                precioTotal += parseFloat(cancionFavorita.precio);
            });
        }

        let respuesta = swig.renderFile('views/canciones-favoritas.html',
            {
                cancionesFavoritas : req.session.cancionesFavoritas,
                precioTotal : precioTotal,
                errores : req.session.errores
            });
        res.send(respuesta);
    });

    app.get('/favoritos/eliminar/:cancion_id', function (req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.cancion_id) };
        gestorBD.obtenerCanciones(criterio,function(canciones) {
            if (canciones == null) {
                req.session.errores = {
                    mensaje : "Error al recuperar la canción",
                    tipoMensaje : "alert-danger"
                }
                res.redirect("/favoritos");
            } else {
                req.session.cancionesFavoritas = req.session.cancionesFavoritas.filter(cancion => cancion._id.toString() !== canciones[0]._id.toString());
                res.redirect("/favoritos");
            }
        });
    });
};