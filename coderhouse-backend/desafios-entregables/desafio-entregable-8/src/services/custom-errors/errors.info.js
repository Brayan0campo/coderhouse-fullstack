export const createProductError = (product) => {
  return `One or more properties are incomplete or invalid.
    List of required properties:
    *description : needs to be a String, received ${product.description}
    *price       : needs to be a String, received ${product.price}
    *stock       : needs to be a String, received ${product.stock}
    *category    : needs to be a String, received ${product.category}
    *available: needs to be a String, received ${product.available}`;
};

export const updateProductError = (id, product) => {
  return `Error updating the product.
  The product that could not be upgraded has the product id ${id}
  The information entered was as follows:
  *description : needs to be a String, received ${product.description}
  *price       : needs to be a String, received ${product.price}
  *stock       : needs to be a String, received ${product.stock}
  *category    : needs to be a String, received ${product.category}
  *available: needs to be a String, received ${product.available}`;
};

export const deleteProductError = (product) => {
  return `Error deleting product.
    *The product that could not be removed has the id${id}`;
};
