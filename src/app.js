import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { getProducts, postProductIo } from './controllers/products-controller.js';

dotenv.config({ path: '../config/config.env' });
const PORT = process.env.PORT || 8080;

const app = express();

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

io.on('connection', (socket) => {
    // console.log('Nuevo cliente conectado: ', socket.id);

    // socket.on('message', (data) => {
    //     console.log(data);
    // });

    // socket.emit('evento_para_socket_individual', 'Este mensaje sólo lo debe recibir el socket');

    // socket.broadcast.emit(
    //     'evento_para_todos_menos_el_socket_actual',
    //     'Este evento lo verán todos los sockets conectados, MENOS el socket actual desde qel que se envió el mensaje'
    // );

    // io.emit('evento_para_todos', 'Este mensaje lo reciben todos los sockets conectados');

    socket.on('new product', (data) => {
        postProductIo(data.title, data.desc, data.code, data.price, data.stat, data.stock, data.category, data.thumb);
        // console.log(data);

        const allProducts = getProducts();
        socket.emit('updated', { products: allProducts });
    });
});
