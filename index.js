const fs = require('fs').promises;
const express = require('express');

const app = express();

const PORT = 8080

app.get('/', (req, res) => {
  res.send('Al fin algo gráfico')
})

app.get('/bienvenida', (req, res) => {
  res.send('<h1 style="color:blue"> BIENVENIDA <h1>')
})

app.get('/products', async (req, res) => {
  const productManager = new ProductManager('productos.json');
  const products = await productManager.getProducts();
  res.send(products);
});

app.get('/product/:id', async (req, res) => {
  const productManager = new ProductManager('productos.json');
  const product = await productManager.getProducts();
  console.log(req.params)
  let idProd = req.params.id
  let prodFind = product.find (product => {
    return product.id == idProd
  })

  res.send (prodFind)
});

app.listen(PORT, () => {
  console.log('Server run on port', PORT)
})

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.productId = 1;

    // Inicializar el archivo si no existe
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

  async addProduct(product) {
    if (!this.isProductValid(product)) {
      console.error('Operación inválida. Imposible agregar: ', product);
      return;
    }

    product.id = this.productId++;
    this.products.push(product);
    console.log('Se agregó el siguiente producto correctamente: ', product);

    // Guardar productos en el archivo después de agregar uno nuevo
    await this.saveProducts();
  }


  //Trae los productos del JSON
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return [];
    }
  }

  //Busca productos por ID
  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      console.error('No se encontró el producto cuyo ID es: ', id);
    }

    return product;
  }

  //Actualizar datos de un producto específico
  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index !== -1) {
      console.log('Producto encontrado para actualizar:', products[index]);
      products[index] = { ...products[index], ...updatedFields };
      this.products = products;
      await this.saveProducts();

      console.log(`Producto con ID ${id} actualizado correctamente.`);
    } else {
      console.error('No se encontró el producto cuyo ID es: ', id);
    }
  }

  //Eliminar producto
  async deleteProduct(id) {
    const products = await this.getProducts();
    const updatedProducts = products.filter(p => p.id !== id);

    if (updatedProducts.length < products.length) {
      this.products = updatedProducts;
      await this.saveProducts();
      console.log(`Producto con ID ${id} eliminado correctamente.`);
    } else {
      console.error('No se encontró el producto cuyo ID es: ', id);
    }
  }

  //Guarda en el json
  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    } catch (error) {
      // Manejar errores de escritura de archivo
      console.error('Error al escribir en el archivo:', error);
    }
  }

  //Comprueba si el producto es válido
  isProductValid(product) {
    const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];

    return (
      requiredFields.every(field => product[field]) &&
      !this.products.some(p => p.code === product.code)
    );
  }
}

const ejecutar = async () => {

  const productManager = new ProductManager('productos.json');

  const product1 = {
    title: 'Perrito',
    description: 'Muy tierno y peludo',
    price: 400,
    thumbnail: 'https://pxccdn.ciudadano.news/ciudadano/122022/1670538467013/f608x342-38173-67896-15-jpg..webp?cw=984&ch=553&extw=jpg',
    code: 'P001',
    stock: 5,
  };

  const product2 = {
    title: 'Gatito',
    description: 'Bolita de pelo para amar',
    price: 450,
    thumbnail: 'https://img.freepik.com/fotos-premium/lindo-gatito-gatito-bebe-animal_853115-5758.jpg',
    code: 'P002',
    stock: 3,
  };

  const product3 = {
    title: 'Iguana',
    description: 'No parece mascota, pero digamos que lo es',
    price: 600,
    thumbnail: 'https://www.tiendanimal.es/articulos/wp-content/uploads/2018/01/Las-iguanas-en-la-naturaleza-1-1200x900.jpg',
    code: 'P001',
    stock: 2,
  };

  const product4 = {
    title: 'Conejito',
    description: 'Bolita de pelo saltarina y energica',
    price: 100,
    thumbnail: 'https://www.tiendanimal.es/articulos/wp-content/uploads/2016/03/un-conejo-como-mascota-1200x900.jpg',
    code: 'P004',
    stock: 40
  };

  // productManager.addProduct(product1);
  // productManager.addProduct(product2);
  // productManager.addProduct(product3);
  // productManager.addProduct(product4);

  //Muestra en consola todos los productos del json
  const allProducts = await productManager.getProducts();
  console.log('Todos los productos:', allProducts);

  //Muestra un producto con un ID específico
  const productById = await productManager.getProductById(2);
  console.log(`Producto encontrado con id ${productById.id} `, productById);

  // //Actualiza algo un producto
  // await productManager.updateProduct(2, {price: 800});

  //Elimina uno
  await productManager.deleteProduct(6);

  const updatedProducts = await productManager.getProducts(1);
  console.log('Productos después de la actualización y eliminación:', updatedProducts);
}

ejecutar();