const socket = io();

document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const idInput = document.getElementById("productId");
  const id = idInput.value;
  idInput.value = "";

  const descInput = document.getElementById("description");
  const description = descInput.value;
  descInput.value = "";

  const priceInput = document.getElementById("price");
  const price = priceInput.value;
  priceInput.value = "";

  const stockInput = document.getElementById("stock");
  const stock = stockInput.value;
  stockInput.value = "";

  const catInput = document.getElementById("category");
  const category = catInput.value;
  catInput.value = "";

  const availableInput = document.getElementById("available");
  const available = availableInput.value;

  const eliminarProductoCheckbox = document.getElementById("delete-product");
  const eliminarProducto = eliminarProductoCheckbox.checked;

  if (eliminarProducto) {
    socket.emit("delProd", { id: id });
  } else {
    const newProduct = {
      description: description,
      image: image,
      price: price,
      stock: stock,
      category: category,
      availability: available,
    };

    if (id === "") {
      socket.emit("newProd", newProduct);
    } else {
      socket.emit("updProd", { id: id, newProduct });
    }
  }
});

socket.on("success", (data) => {
  Swal.fire({
    icon: "success",
    title: data,
    text: `Product added successfully!`,
    confirmButtonText: "Ok",
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    }
  });
});
