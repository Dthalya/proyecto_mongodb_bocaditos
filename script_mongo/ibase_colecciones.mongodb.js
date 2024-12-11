const database ='bocaditos_tienda_galletas';

const collection1 ='productos';//tipos de galletas
const collection2 ='pedidos';

use(database);

db.createCollection(collection1);
db.createCollection(collection2);
