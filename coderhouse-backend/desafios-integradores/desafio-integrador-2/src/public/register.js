document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const email = document.querySelector("#email").value;
    const age = document.querySelector("#age").value;
    const password = document.querySelector("#password").value;
    const role = document.querySelector("#role").value;

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
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          window.location.href = "/";
        }
      } else {
        console.error(
          "Error registering user. Status:",
          response.status,
          "Text:",
          response.statusText
        );
      }
    } catch (error) {
      console.error(error);
    }
  });
