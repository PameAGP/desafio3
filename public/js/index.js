
const socket = io()

socket.on('mensaje1', (data) => {
console.log(data)
socket.emit('mansaje2', 'Entrando al servidor')
})

const addProductVisual = async () => {

    event.preventDefault();

  const prod = {
    title: document.getElementById('title-product').value,
    description: document.getElementById('description-product').value,
    price: parseFloat(document.getElementById('price-product').value),
    thumbnail: document.getElementById('thum-product').value,
    code: document.getElementById('code-product').value,
    stock: parseFloat(document.getElementById('stock-product').value),
    category: document.getElementById('category-product').value,
  };

  try {
    const response = await fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prod)
    });

    if (response.ok) {
      const message = await response.text();
      console.log(message); // Mensaje de confirmación del servidor
    } else {
      console.error('Error al enviar el producto:', response.statusText);
    }
  } catch (error) {
    console.error('Error al enviar el producto:', error);
  }

  return false;
};

const form = document.querySelector('form');
form.addEventListener('submit', addProductVisual);

const deleteProductVisual = async () => {
    event.preventDefault();
  
    const productId = document.getElementById('id-product').value

    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        const message = await response.text();
        console.log(message); // Mensaje de confirmación del servidor
      } else {
        console.error('Error al eliminar el producto:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  
    return false;
  };
  
  const deleteForm = document.querySelector('#delete-form');
  deleteForm.addEventListener('submit', deleteProductVisual);
