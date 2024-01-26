
const socket = io()

// socket.on('mensaje1', (data) => {
// console.log(data)
// socket.emit('mansaje2', 'Entrando al servidor')
// })

socket.on ('newProd2', (data) => {
  console.log (data)
  render(data)
})

const render = async (data) => {
  // Verificar si data es un array; si no lo es, convertirlo en un array
  // const dataArray = Array.isArray(data) ? data : Object.values(data);
  let html = `
        <div class="card">
          <img src="${data.thumbnail}" class="card-img-top" alt="${data.title}">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Código: ${data.code}</li>
            <li class="list-group-item">Disponibles: ${data.stock}</li>
            <li class="list-group-item">Precio: ${data.price}</li>
          </ul>
      </div>
  `

  document.getElementById('new-product').innerHTML = html;
};


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

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/api/products', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
          const message = xhr.responseText;
          console.log(message);
          socket.emit('newProd', prod);
      } else {
          console.error('Error al enviar el producto:', xhr.statusText);
      }
  };

  xhr.onerror = function() {
      console.error('Error al enviar el producto:', xhr.statusText);
  };

  xhr.send(JSON.stringify(prod));

  return false;
};


const form = document.querySelector('#form-post');
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
