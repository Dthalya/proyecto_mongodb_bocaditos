const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Producto = require('./models/Producto');
const Pedido = require('./models/Pedido');

const app = express();

///Alojamiento de URI mongodbatlas
require('dotenv').config();

// Uso de MONGO_URI para conectar con el cluster en MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conexion exitosa al cluster MongoDB Atlas'))
.catch((err) => console.error('Error al conectar a MongoDB:', err.message));


/////////////////:CONEXION LOCAL CON BASE LOCAL///////////////////////////////////
////////MONGO_URI='mongodb://127.0.0.1:27017/bocaditos_tienda_galletas' //////////
//////////////////////////////////////////////////////////////////////////////////

// config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');


// Formulario de agregar un nuevo producto
app.get('/productos/new', (req, res) => {
    res.render('add_product');
});

// Formulario para crear un nuevo pedido
app.get('/new', (req, res) => {
    res.render('add');
});

// obtencion de sabores
app.get('/sabores', async (req, res) => {
    const productos = await Producto.find();
    const sabores = productos.map(producto => producto.sabor);
    
    res.json(sabores);
});

// Obtener los toppings de las galletas
app.get('/sabores-toppings', async (req, res) => {

    const productos = await Producto.find(); 
    const toppings = {};

    productos.forEach(producto => {
        toppings[producto.sabor] = producto.toppings;
    });

    res.json({ toppings });
});

// pagina principal, una lista de todos los pedidos
app.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find(); // obtener todos los pedidos de la coleccion
        console.log('Pedidos en mongoDB:', pedidos); //verificar en consola
        
        res.render('index', { pedidos }); // render de la vista index
    } catch (err) {
        console.error('Error en la lista de pedidos:', err.message);
        res.status(500).send('Error al cargar la pagina de pedidos.');
    }
});

// Mostrar lista de productos para la vista de gestion
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find(); //obtener todos los productos de la collection
        res.render('productos', { productos }); // aqui se hace render de la vista
    } catch (err) {
        console.error('Error al obtener los productos:', err.message);
        res.status(500).send('Error al cargar la pagina de productos.');
    }
});

//formulario donde se encuentran y se editan todos los toppings
app.get('/toppings/edit', async (req, res) => {
    try {
        // obtener los toppings desde un solo producto (todos comparten los mismos toppings para simplificar la validacion)
        const producto = await Producto.findOne(); // Solo necesitamos un producto para este caso
        if (!producto) {
            return res.status(404).send('No hay productos en la base de datos.'); //validacion de no existencia de productos
        }

        res.render('edit_toppings', { toppings: producto.toppings }); //render da la vista para editar toppings
    } catch (err) {
        console.error('Error al cargar los toppings:', err.message);
        res.status(500).send('Error al cargar la pagina de toppings.');
    }
});

// Editar un pedido por su id
app.get('/:id/edit', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).send('Pedido no encontrado.');
        }
        const productos = await Producto.find();
        const unico_producto = await Producto.findOne();

        const sabores = productos.map(producto => producto.sabor); // Sabores únicos
        const toppings = unico_producto.toppings; // Toppings únicos        

        res.render('edit', { pedido , sabores, toppings}); // render de la vista para editar pedidos
    } catch (err) {
        console.error('Error al cargar el formulario de edición:', err.message);
        res.status(500).send('Error al cargar el formulario de edición.');
    }
});

// Editar un producto por su id
app.get('/productos/:id/edit', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado.');
        }
        res.render('edit_product', { producto }); //render de la vista para editar productos
    } catch (err) {
        console.error('Error al obtener el producto:', err.message);
        res.status(500).send('Error al cargar el producto.');
    }
});



//agregar info de los toppings en la direccion /toppings
app.post('/toppings', async (req, res) => {
    try {
        // Verificar que exista al menos 1 topping
        if (!req.body.toppings || req.body.toppings.length === 0) {
            return res.status(400).send('Debe incluir al menos un topping.');
        }

        // Filtrar y eliminar duplicados
        const nuevosToppings = [...new Set(req.body.toppings.filter(topping => topping.trim() !== ''))];

        // Actualizar los toppings en todos los productos, cada documento de la coleccion tiene los mismos
        const resultado = await Producto.updateMany({}, { $set: { toppings: nuevosToppings } });

        // validacion de la operacion exitosa
        if (resultado.modifiedCount === 0) {
            console.log('No se modificaron. Probablemente los toppings no cambiaron.'); //verificacion en consola sin cambios
        } else {
            console.log(`Toppings actualizados en ${resultado.modifiedCount} productos.`); // log para comprobar los cambios
        }

        // Redirigir a la misma pagina de edición luego de la operacion
        res.redirect('/');
    } catch (err) {
        console.error('Error al actualizar los toppings:', err.message);
        res.status(500).send('Error al actualizar los toppings.');
    }
});

//Post para crear un nuevo producto usando la funcion .create
app.post('/productos', async (req, res) => {
    await Producto.create(req.body);
    res.redirect('/');

});

// Crear un nuevo pedido
app.post('/', async (req, res) => {
    try {
        //crea un objeto de tipo pedido y agrega los datos necesarios para que sea aceptado por la coleccion
        const nuevoPedido = new Pedido({
            nombre_cliente: req.body.nombre_cliente,
            telefono: req.body.telefono,
            correo: req.body.correo,
            direccion: req.body.direccion,
            detalles_pedido: req.body.detalles_pedido, // Esta informacion proviene del formulario pero `precio` se calcula en el modelo
        });

        await nuevoPedido.save(); // guarda el nuevo pedido en la collection
        res.redirect('/');
    } catch (err) {
        console.error('Error al crear el pedido:', err.message);
        res.status(400).send(`Error al crear el pedido: ${err.message}`);
    }
});


// Actualizar un producto por su id
app.put('/productos/:id', async (req, res) => {
    try {
      
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            {
                sabor: req.body.sabor,
                descripcion: req.body.descripcion,
                stock: req.body.stock,
                precio: req.body.precio,
            },
            { new: true, runValidators: true } // Devuelve el documento actualizado
        );
        
        //verificar que el producto que se debe actualizar exista
        if (!productoActualizado) {
            return res.status(404).send('Producto no encontrado.');
        }
        
        res.redirect('/');
    } catch (err) {
        console.error('Error al actualizar el producto:', err.message);
        res.status(400).send(`Error al actualizar el producto: ${err.message}`);
    }
});

// Actualizar un pedido existente
app.put('/:id', async (req, res) => {
    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            req.params.id,
            {
                nombre_cliente: req.body.nombre_cliente,
                telefono: req.body.telefono,
                correo: req.body.correo,
                direccion: req.body.direccion,
                detalles_pedido: req.body.detalles_pedido,
            },
            { new: true, runValidators: true } // actualizar documento
        );

        if (!pedidoActualizado) {
            return res.status(404).send('Pedido no encontrado.');
        }

        res.redirect('/');
    } catch (err) {
        console.error('Error al actualizar el pedido:', err.message);
        res.status(400).send(`Error al actualizar el pedido: ${err.message}`);
    }
});


// Eliminar un pedido
app.delete('/:id', async (req, res) => {
    try {
        const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
        if (!pedidoEliminado) {
            return res.status(404).send('Pedido no encontrado.');
        }

        res.redirect('/');
    } catch (err) {
        console.error('Error al eliminar el pedido:', err.message);
        res.status(500).send('Error al eliminar el pedido.');
    }
});

// Eliminar un producto existente
app.delete('/productos/:id', async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).send('Producto no encontrado.');
        }
        res.redirect('/'); //redirigir a la vista principal
    } catch (err) {
        console.error('Error al eliminar el producto:', err.message);
        res.status(500).send('Error al eliminar el producto.');
    }
});


// Inicia el servidor con el puerto de Render o en el puerto 3000 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

