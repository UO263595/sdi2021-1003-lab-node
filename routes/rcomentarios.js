module.exports = function(app, swig, gestorBD) {
    app.get('/comentario/borrar/:id', function (req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        gestorBD.eliminarComentario(criterio, function(result) {
            if (result == null) {
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al eliminar el comentario"
                });
                res.send(respuesta);
            } else {
                res.redirect("/cancion/"+result.cancion_id);
            }
        });
    });
    app.post('/comentarios/:cancion_id', function (req, res) {
        let comentario = {
            autor : req.session.usuario,
            texto : req.body.texto,
            cancion_id : gestorBD.mongo.ObjectID(req.params.cancion_id)
        }

        gestorBD.insertarComentario(comentario, function(id) {
            if (id == null) {
                let respuesta = swig.renderFile('views/error.html', {
                    mensaje : "Error al insertar el comentario"
                });
                res.send(respuesta);
            } else {
                res.redirect("/cancion/"+result.cancion_id);
            }
        });
    });
};