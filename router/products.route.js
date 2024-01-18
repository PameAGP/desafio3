const express = require('express')

const { Router } = express

const router = new Router()
const ProductManager = require('../ProductManager')

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

// router.get('/products', async (req, res) => {
//     res.send({ data: products, menssage: "Todos los productos han sido envidados." })
// })

//crea producto
router.post('/', async (req, res) => {
    
    const confirm = await productManager.addProduct(req.body)

    if (confirm) {
        res.status(201).send('Producto creado correctamente')
    } else {
        res.status(400).send('Producto ya existente!')
    }

})


// router.post('/createProducts', async (req, res) => {
//     let id = uuid4()
//     let prod = req.body
//     prod.id = id
//     products.push(prod)
//     res.send({ data: prod, message: 'Producto guardado correctamente.' })
// })

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const confirm = await productManager.updateProduct(id, req.body)

    if (confirm) {
        res.status(201).send('Producto actualizado correctamente')
    } else {
        res.status(404).send('Producto no encontrado')
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const confirm = await productManager.deleteProduct(id)

    if (confirm) {
        res.status(201).send('Producto eliminado correctamente')
    } else {
        res.status(404).send('Producto no encontrado')
    }
})






module.exports = router