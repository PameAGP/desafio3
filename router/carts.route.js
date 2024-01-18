const express = require('express')
const uuid4 = require ('uuid4')

const {Router} = express

const router = new Router()

router.get('/carts', async (req, res) => {
    res.send ({data:products, menssage: "Todos los productos han sido envidados."})
})

router.post ('/createCart', async (req, res) => {
    let id = uuid4()
    let prod = req.body
    prod.id = id
    products.push(prod)
    res.send ({data:prod, message:'Producto guardado correctamente.'})
})

router.put ('/updateCart', (req, res) => {
    let id = req.params.id
    let infoNew = req.body

    let arrayUpdated = products.map((elem) => {
        if (elem.id == id) {
            return {...elem, infoNew}
        } else {
            return elem
        }
    })
    console.log(arrayUpdated)
    products = arrayUpdated
    res.send ({data:products, message:'Productos actualizados con éxito.'})
})

// {
//     id: uuid4();

//     products: [
//         {
//             product: "dsdsdsdsd",
//             quantity: 2
//         }
//     ]

// }


module.exports = router