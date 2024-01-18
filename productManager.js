const fs = require('fs').promises;
const express = require('express');
const uuid4 = require('uuid4')

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

    // product.id = this.productId++;
    product.id = uuid4();
    this.products.push(product);
    console.log('Se agregó el siguiente producto correctamente: ', product);

    // Guardar productos en el archivo después de agregar uno nuevo
    await this.saveProducts();
  }


  //Trae los productos del JSON
  async getProducts(limit) {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      const allProducts = JSON.parse(data);

      if (limit) {
        return allProducts.slice(0, limit);
      } else {
        return allProducts;
      }
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
      console.error('No se encontró el producto buscado cuyo ID es: ', id);
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
      console.error('No se encontró el producto para actualizar cuyo ID es: ', id);
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
      console.error('No se encontró el producto para eliminar cuyo ID es: ', id);
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
    const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'status', 'category'];

    return (
      requiredFields.every(field => product[field]) &&
      !this.products.some(p => p.code === product.code)
      
    );
  }
}



const pruebaProductos = async () => {

  const productManager = new ProductManager('productos.json');

  const product1 = {
    title: 'Perrito',
    description: 'Muy tierno y peludo',
    price: 400,
    thumbnail: 'https://pxccdn.ciudadano.news/ciudadano/122022/1670538467013/f608x342-38173-67896-15-jpg..webp?cw=984&ch=553&extw=jpg',
    code: 'P001',
    stock: 5,
    status: true,
    category: "mascotas-comunes"
  };

  const product2 = {
    title: 'Gatito',
    description: 'Bolita de pelo para amar',
    price: 450,
    thumbnail: 'https://img.freepik.com/fotos-premium/lindo-gatito-gatito-bebe-animal_853115-5758.jpg',
    code: 'P002',
    stock: 3,
    status: true,
    category: "mascotas-comunes"
  };

  const product3 = {
    title: 'Iguana',
    description: 'No parece mascota, pero digamos que lo es',
    price: 600,
    thumbnail: 'https://www.tiendanimal.es/articulos/wp-content/uploads/2018/01/Las-iguanas-en-la-naturaleza-1-1200x900.jpg',
    code: 'P003',
    stock: 2,
    status: true,
    category: "mascotas-exoticas"
  };

  const product4 = {
    title: 'Conejito',
    description: 'Bolita de pelo saltarina y energica',
    price: 100,
    thumbnail: 'https://www.tiendanimal.es/articulos/wp-content/uploads/2016/03/un-conejo-como-mascota-1200x900.jpg',
    code: 'P001',
    stock: 40,
    status: true,
    category: "mascotas-comunes"
  };

  // await productManager.addProduct(product1);
  // await productManager.addProduct(product2);
  // await productManager.addProduct(product3);
  // await productManager.addProduct(product4);

  //Muestra en consola todos los productos del json
  const allProducts = await productManager.getProducts();
  console.log('Todos los productos:', allProducts);

  //Muestra un producto con un ID específico
  const productById = await productManager.getProductById("2942c09a-d351-4121-a426-cb371442c1df");
  console.log(`Producto encontrado con id ${productById.id} `, productById);

  // //Actualiza algo un producto
  // await productManager.updateProduct("2942c09a-d351-4121-a426-cb371442c1df", {price: 800});

  //Elimina uno
  await productManager.deleteProduct("f8c103a6-69db-461f-997d-645e2sss1931693");

  const updatedProducts = await productManager.getProducts();

  console.log('Productos después de la actualización y eliminación:', updatedProducts);

}

// pruebaProductos();

module.exports = ProductManager;