const express = require ('express')

const fs = require('fs').promises;

const {Router} = express

const router = new Router()


router.get('/home', async (req, res) => {
  
  const data = await fs.readFile('productos.json', 'utf8');
  const productos = JSON.parse(data);

    res.render('home', {productos:productos})
  })

  router.get('/realtimeproducts', async (req, res) => {
  
    const data = await fs.readFile('productos.json', 'utf8');
    const productos = JSON.parse(data);
  
      res.render("realtimeproducts", {productos:productos})
    })
  



  module.exports = router