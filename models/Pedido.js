const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    nombre_cliente: { type: String, required: true },
    telefono: { type: String, required: true },
    correo: { type: String, required: true },
    direccion: { type: String, required: true },
    detalles_pedido: [
        {
            galleta: { type: String, required: true }, // Nombre de la galleta
            // "chocolate" o "vainilla" o "mantequilla" o "redvelbet"
            topping: { type: String, required: true },
            // Toppings ("chispas de chocolate", "chispas de chocolate blanco","nueces","arequipe")
            cantidad: { type: Number, required: true }, // Cantidad solicitada
        },
    ],
    precio: { type: Number, default: 0 }, // Calculado en la funcion .pre siguiente
});

// espacio para calcular precio_total y verificar stock antes de guardar
PedidoSchema.pre('save', async function (next) {
    const Producto = mongoose.model('Producto'); //obtener los productos de la colection
    let precio_total = 0;

    for (const detalle of this.detalles_pedido) {
        // Busca el producto por el campo "sabor" (nombre)
        const producto = await Producto.findOne({ sabor: detalle.galleta });
        if (!producto) {
            throw new Error(`El producto con sabor "${detalle.galleta}" no existe.`);
        }

        // Verifica que haya suficiente stock
        if (producto.stock < detalle.cantidad) {
            throw new Error(`No hay suficiente stock para el producto "${detalle.galleta}". Disponible: ${producto.stock}. Vuelva a la pagina anterior e intentelo de nuevo`);
        }

        // Resta la cantidad del stock
        producto.stock -= detalle.cantidad;
        await producto.save();

        // Calcula el precio total
        precio_total += producto.precio * detalle.cantidad;
    }

    // Asigna el precio total calculado
    this.precio = precio_total;

    next();
});

module.exports = mongoose.model('Pedido', PedidoSchema);
