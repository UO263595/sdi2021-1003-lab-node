module.exports = function(app, swig, gestorBD) {
    app.get('/comentario/borrar/:id', function (req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        gestorBD.eliminarComentario(criterio, function(result) {
            if (result == null) {
                res.send("Error al eliminar el comentario");
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
                res.send("Error al insertar comentario");
            } else {
                res.redirect("/cancion/"+result.cancion_id);
            }
        });
    });
};