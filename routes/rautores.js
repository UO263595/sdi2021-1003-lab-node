module.exports = function(app, swig, mongo) {
    let autores = [{
        "nombre": "Freddy Mercury",
        "grupo": "Queen",
        "rol": "cantante"
    }, {
        "nombre": "Jimi Hendrix",
        "grupo": "Band of Gypsys",
        "rol": "guitarrista"
    } , {
        "nombre": "Jon Lord",
        "grupo": "Deep Purple",
        "rol": "teclista"
    }];

    app.get("/autores", function(req, res) {
        let respuesta = swig.renderFile('views/autores.html', {
            autores : autores
        });
        res.send(respuesta);
    });

    app.get('/autores/agregar', function (req, res) {
        let roles = ["cantante", "batería", "guitarrista", "bajista", "teclista"];
        let respuesta = swig.renderFile('views/autores-agregar.html', {
            roles : roles
        });
        res.send(respuesta);
    });

    app.get('/autores/filtrar/:rol', function(req, res) {
        let respuesta = swig.renderFile('views/autores.html', {
            autores : autores.filter(autor => autor.rol === req.params.rol)
        });
        res.send(respuesta);
    });

    app.get('/autores/*', function (req, res) {
        res.redirect('/autores');
    });

    app.post("/autor", function(req, res) {
        /**
        let respuesta = "";

        if (req.body.nombre != null && req.body.nombre !== "")
            respuesta += 'Nombre: ' + req.body.nombre + '<br>';
        else
            respuesta += 'Nombre no enviado en la petición' + '<br>';
        if (req.body.grupo != null && req.body.grupo !== "")
            respuesta += 'Grupo: ' + req.body.grupo + '<br>';
        else
            respuesta += 'Grupo no enviado en la petición' + '<br>';
        if (req.body.rol != null && req.body.rol !== "")
            respuesta += 'Rol: ' + req.body.rol + '<br>';
        else
            respuesta += 'Rol no enviado en la petición' + '<br>';

        res.send(respuesta);
        **/
        let autor = {
            nombre : req.body.nombre,
            grupo : req.body.grupo,
            rol : req.body.rol
        }
        // Conectarse
        mongo.MongoClient.connect(app.get('db'), function(err, db) {
            if (err) {
                res.send("Error de conexión: " + err);
            } else {
                let collection = db.collection('autores');
                collection.insertOne(autor, function(err, result) {
                    if (err) {
                        res.send("Error al insertar " + err);
                    } else {
                        res.send("Agregado id: "+ result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    });
};