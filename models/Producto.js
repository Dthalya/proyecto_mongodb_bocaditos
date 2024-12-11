const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Identificador único como "CHOC", "VAN"
    sabor: { type: String, required: true },
    toppings: { type: [String], required: true }, // Lista de toppings disponibles
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true }, // Cantidad disponible en inventario
});

module.exports = mongoose.model('Producto', ProductoSchema);




