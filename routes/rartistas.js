module.exports = function(app, swig) {
    app.get('/artista', function(req, res) {
        if( req.query.busqueda != null ) {
            url="http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+req.query.busqueda+"&api_key=143e289cb73c4f2a20ebf585672e201a&format=json";
            let rest = app.get("rest");
            rest(url, function (error, response, body) {
                console.log("cod: " + response.statusCode + " Cuerpo :" + body);
                let objetoRespuesta = JSON.parse(body);
                let respuesta = swig.renderFile('views/artista.html',
                    {
                        nombre: objetoRespuesta.artist.name,
                        informacion: objetoRespuesta.artist.bio.summary,
                        musica: objetoRespuesta.artist.url
                    });
                res.send(respuesta);
            })
        } else {
            let respuesta = swig.renderFile('views/artista.html',{});
            res.send(respuesta);
        }
    });
};