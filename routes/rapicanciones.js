module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ) {
                res.status(500);
                res.json({
                    error : "se ha producido un error al recuperar la canción"
                });
                return;
            } else {
                if (res.usuario!==canciones[0].autor) {
                    res.status(401);
                    res.json({
                        error : "se debe ser el autor para eliminar una canción"
                    });
                    return;
                }
            }
        });

        gestorBD.eliminarCancion(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.post("/api/cancion", function(req, res) {
        // Validar nombre, género, precio
        if (req.body.nombre===null || req.body.genero.length===null || req.body.precio===null) {
            res.status(400);
            res.json({
                error : "se deben rellenar todos los campos"
            });
            return;
        }
        if (req.body.nombre.length<3 || req.body.nombre.length>20) {
            res.status(400);
            res.json({
                error : "el nombre debe tener entre 3 y 20 caracteres"
            });
            return;
        }
        if (req.body.genero.length<3 || req.body.genero.length>10) {
            res.status(400);
            res.json({
                error : "el género debe tener entre 3 y 10 caracteres"
            });
            return;
        }
        if (req.body.precio<0) {
            res.status(400);
            res.json({
                error : "el precio debe ser un número positivo"
            });
            return;
        }
        else {
            let cancion = {
                nombre : req.body.nombre,
                genero : req.body.genero,
                precio : req.body.precio,
                autor : res.usuario
            }
            gestorBD.insertarCancion(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "canción insertada",
                        _id: id
                    })
                }
            });
        }
    });

    app.put("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };
        gestorBD.obtenerCanciones(criterio,function(canciones) {
            if ( canciones == null ) {
                res.status(500);
                res.json({
                    error : "se ha producido un error al recuperar la canción"
                });
                return;
            } else {
                if (res.usuario!==canciones[0].autor) {
                    res.status(401);
                    res.json({
                        error : "se debe ser el autor para modificar una canción"
                    });
                    return;
                }
            }
        });


        let cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null) {
            if (req.body.nombre.length<3 || req.body.nombre.length>20) {
                res.status(400);
                res.json({
                    error : "el nombre debe tener entre 3 y 20 caracteres"
                });
                return;
            } else {
                cancion.nombre = req.body.nombre;
            }
        }
        if ( req.body.genero != null) {
            if (req.body.genero.length < 3 || req.body.genero.length > 10) {
                res.status(400);
                res.json({
                    error: "el género debe tener entre 3 y 10 caracteres"
                });
                return;
            } else {
                cancion.genero = req.body.genero;
            }
        }
        if ( req.body.precio != null) {
            if (req.body.precio<0) {
                res.status(400);
                res.json({
                    error : "el precio debe ser un número positivo"
                });
                return;
            } else {
                cancion.precio = req.body.precio;
            }
        }

        gestorBD.modificarCancion(criterio, cancion, function(result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    mensaje : "canción modificada",
                    _id : req.params.id
                })
            }
        });
    });

    app.post("/api/autenticar/", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado : false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado : true,
                    token : token
                })
            }
        })
    });
}