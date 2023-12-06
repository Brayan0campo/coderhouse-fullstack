document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const response = await fetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token);
    if (data.token && data.user.role === "admin") {
      window.location.href = "/admin";
    } else if (data.token && data.user.role === "user") {
      window.location.href = "/current";
    }
  } else {
    console.error("Error in login");
  }
});
