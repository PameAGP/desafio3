const express = require('express');
const handlebars = require('express-handlebars')
const http = require('http')
const {Server} = require('socket.io')

const productRouters = require('./router/products.route')
const cartRouters = require('./router/carts.route')
const homeRouters = require('./router/home.route')

const app = express();
const PORT = 8080
const server = http.createServer(app);

let produ = []
//Public
app.use(express.static(__dirname+'/public'))

//handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

app.use (express.json())
app.use(express.urlencoded({extended:true}))

//rutas
app.use ('/api/', homeRouters)

app.use ('/api/products', productRouters)

app.use ('/api/carts', cartRouters)

//socket
const io = new Server(server)


io.on('connection', (socket)=> {
    // socket.emit('mensaje1', 'Bienvenido, usuario')

  // socket.on('mensaje2', (data) => {
  //   console.log(data)
  // })

  socket.on('newProd', (data) => {
    // console.log(data)
    socket.emit("newProd2", data)
  })
})

server.listen(PORT, () => {
  console.log('Server run on port', PORT)
})