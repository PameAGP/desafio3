const express = require('express');
const fs = require('fs').promises;
const uuid4 = require ('uuid4')


const productRouters = require('./router/products.route')
const cartRouters = require('./router/carts.route')

const app = express();
const PORT = 8080

let products = []

app.use (express.json())

app.use ('/api/products', productRouters)

app.use ('/api/cart', cartRouters)



app.get('/', (req, res) => {
  res.send('Inicio')
})

// app.get('/bienvenida', (req, res) => {
//   res.send('<h1 style="color:blue"> BIENVENIDA <h1>')
// })

// app.get('/products', async (req, res) => {
//   const productManager = new ProductManager('productos.json');
//   const limit = req.query.limit;
//   const products = await productManager.getProducts(limit);
//   res.send(products);
// });

// app.get('/product/:id', async (req, res) => {
//   const productManager = new ProductManager('productos.json');
//   const id = parseInt(req.params.id, 10);
//   const product = await productManager.getProductById(id);

//   console.log (req.params.id)

//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send('Producto no encontrado');
//   }
// });


app.listen(PORT, () => {
  console.log('Server run on port', PORT)
})