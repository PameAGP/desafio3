const express = require('express');
const fs = require('fs').promises;
const uuid4 = require('uuid4')

const {Router} = express
const router = new Router()

let carts = []

class manageCart {


    constructor(path) {
        this.path = path;
        this.carts = []
        
        this.initFile();
    }

    async initFile() {
        try {
          await fs.access(this.path);
        } catch (error) {
          // Si hay un error, el archivo no existe, así que inicialízalo con un array vacío
          await fs.writeFile(this.path, '[]', 'utf8');
        }
      }

      async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            const allCarts = JSON.parse(data);
      

              return allCarts
          } catch (error) {
            console.error('Error al leer el archivo:', error);
            return [];
          }
      }

      async getCartsById (id) {
        const carts = await this.getCarts();
        const cart = carts.find(p => p.id === id);

        if (!cart) {
            console.error('No se encontró el carro')
        }

        return cart.products
      }

      async addCart () {
        const carritos = JSON.parse(await fs.readFile(this.path, 'utf-8'));

        const cart = {
            id: uuid4(),
            products: []
        };
        
        carritos.push(cart);
        await fs.writeFile(this.path, JSON.stringify(carritos));
      }

      async addProductCart(id, updatedCart) {
        try {
            const carritos = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            
            const carritoIndex = carritos.findIndex(carro => carro.id === id);
    
            if (carritoIndex !== -1) {
                const existingProducts = carritos[carritoIndex].products || [];
    
                const productId = updatedCart.product;
    
                const productIndex = existingProducts.findIndex(prod => prod.product === productId);
    
                if (productIndex !== -1) {
                    // Producto ya existe en el carrito, incrementa la cantidad
                    existingProducts[productIndex].quantity += updatedCart.quantity || 1;
                } else {
                    // Agrega el producto si no existe
                    existingProducts.push({
                        product: productId,
                        quantity: updatedCart.quantity || 1
                    });
                }
    
                // Actualiza el carrito con los productos modificados/agregados
                carritos[carritoIndex].products = existingProducts;
    
                // Guarda los carritos actualizados
                await fs.writeFile(this.path, JSON.stringify(carritos, null, 2), 'utf8');
    
                console.log(`Producto(s) agregado(s) al carrito ${id} correctamente.`);
    
                return true;
            } else {
                console.error('Carrito no encontrado.');
                return false;
            }
        } catch (error) {
            console.error('Error al leer o escribir en el archivo de carritos:', error);
            return false;
        }
    }
    

      async saveCarts() {
        try {
            // Leer productos existentes del archivo
            const existingCarts = await this.getCarts();
      
            // Combina los productos existentes con los productos actuales de la instancia
            const allCarts = [...existingCarts, ...this.carts];
      
            // Guardar la combinación en el archivo
            await fs.writeFile(this.path, JSON.stringify(allCarts, null, 2), 'utf8');
          } catch (error) {
            // Manejar errores de escritura de archivo
            console.error('Error al escribir en el archivo:', error);
          }
      }
}

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