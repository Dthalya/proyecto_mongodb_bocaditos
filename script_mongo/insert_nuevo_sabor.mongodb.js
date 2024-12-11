use('bocaditos_tienda_galletas');

db.productos.insertOne({

    _id:"RED",
    sabor: "Redvelvet",
    toppings:["chispas de chocolate blanco","nueces","arequipe"],
    descripcion:"deliciosas galletas de 115gr con el distintivo color del pastel redvelvet",
    precio:2500,
    stock:30
});