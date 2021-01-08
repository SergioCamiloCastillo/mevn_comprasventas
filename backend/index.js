//Configuracion de servidor express
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import router from './admin/routes';
import mongoose from 'mongoose';
//Objeto que instancie a express
const app = express();
//Cadena de conexion a bd
const DBConnection = require('./config/db')

DBConnection()

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/admin/public")));


app.use(express.urlencoded({ extended: true }));//Habilitamos a nuestro backend que pueda recibir peticiones json a traves de metodos post
//Sino hay un puerto asignado por el servidor, tome el puerto 4000
app.use('/admin', router);
app.set('port', process.env.PORT || 4000)
app.get('/hola', function (req, res) {
    res.send("Hola mundo");
});
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto ' + app.get('port'));
});