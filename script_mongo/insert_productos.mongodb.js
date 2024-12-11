use('bocaditos_tienda_galletas');


db.productos.insertMany([
    {
        _id:"CHOC",
        sabor:"chocolate",
        toppings: ["chispas de chocolate","nueces", "arequipe"],
        descripcion: "Deliciosas galletas de 115gr a base de chocolate",
        precio:2500,
        stock:25
    },
    {
        _id:"VAN",
        sabor:"vainilla",
        toppings: ["chispas de chocolate","nueces", "arequipe"],
        descripcion: "Deliciosas galletas de 115gr a base de vainilla",
        precio:2000,
        stock:45
    }
])