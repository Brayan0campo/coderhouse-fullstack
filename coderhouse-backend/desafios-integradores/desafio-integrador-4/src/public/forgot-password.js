document
  .getElementById("forgot-password-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    try {
      const response = await fetch("/users/password/reset-request", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        Swal.fire({
          title: "Password reset email sent",
          text: "Please check your email inbox to continue",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        const errorData = await response.json();
        console.error("Error initiating password reset:", errorData.message);

        Swal.fire({
          title: "Error initiating password reset",
          text: errorData.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error initiating password reset:", error);
    }
  });
