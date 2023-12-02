document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstNameInput = document.getElementById("firtsName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const ageInput = document.getElementById("age");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("role");

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const age = ageInput.value;
    const password = passwordInput.value;
    const role = roleInput.value;
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          age,
          password,
          role,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const successMessage = responseData.message;

        if (responseData.token) {
          window.location.href = "/";
        }
      } else {
        console.error(
          "Error at register. Status:",
          response.status,
          "Text:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
