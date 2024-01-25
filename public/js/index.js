
const socket = io()

socket.on('mensaje1', (data) => {
console.log(data)
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