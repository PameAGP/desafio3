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
  console.log('User Connected')
  socket.emit('mensaje1', 'Hola usuario')
})

server.listen(PORT, () => {
  console.log('Server run on port', PORT)
})