use('bocaditos_tienda_galletas');

const precio_chocolate =db.productos.findOne({_id: "CHOC"}).precio;
const precio_vainilla =db.productos.findOne({_id: "VAN"}).precio;

const detalles_pedido = [
    {
        galleta: "chocolate",
        topping:"chispas de chocolate",
        cantidad: 10
    },
    {
        galleta: "vainilla",
        topping:"arequipe",
        cantidad: 5
    },
]
//modificar para cada pedido
const precio_total= (precio_chocolate*detalles_pedido[0].cantidad)+(precio_vainilla*detalles_pedido[1].cantidad)

db.pedidos.insertOne({
    _id:"pedidos1",
    nombre_cliente:"Pedro Perez",
    telefono: "3125106916",
    correo: "pedro@correo.com",
    direccion:"calle 1, barrio mundo nuevo",
    precio: precio_total, //se puede colocar manual o clacular con info de productos(precio)
    detalles_pedido: detalles_pedido 
})