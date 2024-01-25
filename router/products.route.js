const express = require('express')

const { Router } = express

const router = new Router()

const ProductManager = require('../managers/productManager')

const productManager = new ProductManager('productos.json');

//Muestra todos los productos
router.get('/', async (req, res) => {
    
    const limit = req.query.limit;
    const products = await productManager.getProducts(limit);
    res.send({ data: products, menssage: "Todos los productos han sido envidados." })
});

//Muestra el producto con el id especificado
router.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    const product = await productManager.getProductById(pid);

    console.log(req.params.pid)

    if (product) {
        // res.send(product);
        res.status(200).send(product)
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

//crea producto
router.post('/', async (req, res) => {
    
    const confirm = await productManager.addProduct(req.body)

    if (confirm) {
        res.status(200).send('Producto creado correctamente')
    } else {
        res.status(404).send('Producto ya existente!')
    }

})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const confirm = await productManager.updateProduct(id, req.body)

    if (confirm) {
        res.status(200).send('Producto actualizado correctamente')
    } else {
        res.status(404).send('Producto no encontrado')
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const confirm = await productManager.deleteProduct(id)

    if (confirm) {
        res.status(200).send('Producto eliminado correctamente')
    } else {
        res.status(404).send('Producto no encontrado')
    }
})


const addProductVisual = () => {
    const prod = {
      title: document.getElementById('title-product').value,
      description: document.getElementById('description-product').value,
      price: document.getElementById('price-product').value,
      thumbnail: document.getElementById('thum-product').value,
      code: document.getElementById('code-product').value,
      stock: document.getElementById('stock-product').value,
      category: document.getElementById('category-product'),value
    }
    
    console.log(prod)
  
    return false
  }



module.exports = router