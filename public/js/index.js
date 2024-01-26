
const socket = io()

socket.on('mensaje1', (data) => {
console.log(data)
socket.emit('mansaje2', 'Entrando al servidor')
})

const addProductVisual = () => {
    const prod = {
      title: document.getElementById('title-product').value,
      description: document.getElementById('description-product').value,
      price: document.getElementById('price-product').value,
      thumbnail: document.getElementById('thum-product').value,
      code: document.getElementById('code-product').value,
      stock: document.getElementById('stock-product').value,
    }
    console.table(prod)

    return false
  }