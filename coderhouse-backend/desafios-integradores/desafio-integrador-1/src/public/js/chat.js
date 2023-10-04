const socket = io();

document.getElementById("prod-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const titleInput = document.getElementById("title");
  const title = titleInput.value;
  titleInput.value = "";

  const descInput = document.getElementById("description");
  const description = descInput.value;
  descInput.value = "";

  const codeInput = document.getElementById("code");
  const code = codeInput.value;
  codeInput.value = "";

  const priceInput = document.getElementById("price");
  const price = priceInput.value;
  priceInput.value = "";

  const statusInput = document.getElementById("status");
  const status = statusInput.value;
  statusInput.value = "";

  const stockInput = document.getElementById("stock");
  const stock = stockInput.value;
  stockInput.value = "";

  const catInput = document.getElementById("category");
  const category = catInput.value;
  catInput.value = "";

  const imgInput = document.getElementById("image");
  const thumbnails = imgInput.value;
  imgInput.value = "";

  const newProduct = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnails: thumbnails,
  };
  socket.emit("newProd", newProduct);
});

socket.on("success", (data) => {
  Swal.fire({
    icon: "success",
    title: data,
    text: `El producto ha sido agregado`,
    confirmButtonText: "Aceptar",
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    }
  });
});
