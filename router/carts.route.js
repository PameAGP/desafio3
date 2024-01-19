const express = require('express');
const fs = require('fs').promises;
const uuid4 = require('uuid4')

const {Router} = express
const router = new Router()

let carts = []


router.get('/carts', async (req, res) => {
    res.send({ data: carts, message: 'Todos los carritos han sido enviados.' });
});

router.post('/', async (req, res) => {
    const id = uuid4();
    const cart = { id, products: [] };
    carts.push(cart);
    await saveCarts(); // Guardar carritos después de la creación
    res.status(201).json({ data: cart, message: 'Carrito creado correctamente.' });
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedCart = req.body;

    const index = carts.findIndex((cart) => cart.id === id);

    if (index !== -1) {
        carts[index] = { ...carts[index], ...updatedCart };
        await saveCarts(); // Guardar carritos después de la actualización
        res.json({ data: carts[index], message: 'Carrito actualizado correctamente.' });
    } else {
        res.status(404).send('Carrito no encontrado.');
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    
    try {
        // Lee el contenido de carrito.json
        const data = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(data);

        // Busca el carrito con el id que se le diol
        const cart = carts.find(cart => cart.id === cid);

        if (cart) {
            res.json({ data: cart.products, message: 'Productos del carrito obtenidos correctamente.' });
        } else {
            res.status(404).send('Carrito no encontrado.');
        }
    } catch (error) {
        console.error('Error al leer el archivo de carritos:', error);
        res.status(500).send('Error interno del servidor al obtener carritos.');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        // Leer el contenido de carrito.json
        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);

        // Encontrar el carrito con el ID proporcionado
        const cart = carts.find(cart => cart.id === cid);

        if (cart) {
            // Leer el contenido de productos.json
            const productsData = await fs.readFile('productos.json', 'utf-8');
            const products = JSON.parse(productsData);

            // Verificar si el producto con el ID proporcionado existe
            const existingProduct = products.find(product => product.id === pid);

            if (existingProduct) {
                const productToAdd = { product: pid, quantity: Number(quantity) || 1 };

                cart.products.push(productToAdd);
                await saveCarts(); // Guardar carritos después de la actualización

                res.status(201).json({ data: productToAdd, message: 'Producto agregado al carrito correctamente.' });
            } else {
                res.status(404).send('Producto no encontrado.');
            }
        } else {
            res.status(404).send('Carrito no encontrado.');
        }
    } catch (error) {
        console.error('Error al leer el archivo de carritos o productos:', error);
        res.status(500).send('Error interno del servidor al obtener carritos o productos.');
    }
});

async function saveCarts() {
    try {
        await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf-8');
        console.log('Carritos guardados en carrito.json');
    } catch (error) {
        console.error('Error al guardar carritos:', error);
    }
}

module.exports = router