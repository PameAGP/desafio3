const express = require('express');
const fs = require('fs').promises;
const uuid4 = require ('uuid4')


const productRouters = require('./router/products.route')
const cartRouters = require('./router/carts.route')

const app = express();
const PORT = 8080



app.use (express.json())
app.use(express.urlencoded({extended:true}))

app.use ('/api/products', productRouters)

app.use ('/api/cart', cartRouters)



app.get('/', (req, res) => {
  res.send('Inicio')
})


app.listen(PORT, () => {
  console.log('Server run on port', PORT)
})