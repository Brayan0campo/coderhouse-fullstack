document
  .getElementById("reset-password-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match.");
      return;
    }

    const token = window.location.pathname.split("/").pop();

    try {
      const response = await fetch(`/users/password/reset/${token}`, {
        method: "POST",
        body: JSON.stringify({ newPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        Swal.fire({
          title: "Password reset successfully!",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      } else {
        const errorData = await response.json();
        console.error("Error resetting password:", errorData.message);

        Swal.fire({
          title: "Error resetting password",
          text: errorData.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  });
