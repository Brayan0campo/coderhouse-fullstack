document
  .getElementById("username-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userInputElement = document.getElementById("username");
    const messageInputElement = document.getElementById("message");
    const user = userInputElement.value;
    const message = messageInputElement.value;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, message }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const successMessage = responseData.message;

        Swal.fire({
          icon: "success",
          title: successMessage,
          text: `Mensaje del usuario ${user} enviado con exito`,
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
        userInputElement.value = "";
        messageInputElement.value = "";
      } else {
        console.error("Error en el envio del mensaje");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  });
