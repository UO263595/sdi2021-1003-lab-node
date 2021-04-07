module.exports = function(app, swig, gestorBD) {
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
        let autor = {
            nombre : req.body.nombre,
            grupo : req.body.grupo,
            rol : req.body.rol
        }
        // Conectarse
        gestorBD.insertarAutor(autor, function(id) {
            if (id == null) {
                res.send("Error al insertar autor");
            } else {
                res.redirect('/autores');
            }
        });
    });
};