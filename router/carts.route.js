const express = require('express');
const fs = require('fs').promises;
const uuid4 = require('uuid4')

const {Router} = express
const router = new Router()

const manageCart = require('../managers/cartManager')

const manageCarts = new manageCart('carrito.json');

router.get('/list', async (req, res) => {
    const allCarts = await manageCarts.getCarts();
    res.send({ data: allCarts, message: 'Todos los carritos han sido enviados.' });
});

router.post('/', async (req, res) => {
    try {
       await manageCarts.addCart (req.body)

       res.status(200).send('Producto creado correctamente')
    } catch (error) {
        console.error('Error al leer el archivo de carritos:', error);
        res.status(500).send('Error interno del servidor al generar carrito.');
    }
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
    
    const cid = req.params.cid 
    const cart = await manageCarts.getCartsById(cid)

    console.log (req.params.cid)

    if (cart) {
        res.status(200).send(cart)
    } else {
        res.status(404).send('Carrito no encontrado');
    }

});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        // Llama a la función addProductCart para agregar el producto al carrito
        const success = await manageCarts.addProductCart(cid, { product: pid, quantity });

        if (success) {
            res.status(201).json({ message: 'Producto agregado al carrito correctamente.' });
        } else {
            res.status(404).send('No se pudo agregar el producto al carrito.');
        }
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error interno del servidor al agregar el producto al carrito.');
    }
});




module.exports = router