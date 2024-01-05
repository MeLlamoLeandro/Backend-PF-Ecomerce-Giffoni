
const form = document.getElementById("pwforgetForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("api/mail/reset", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    console.log(result.status);
    if (result.status === 200) {
      window.location.replace("/login");
    } // si recibo un 401, mostrar error
    if (result.status === 401) {
      document.getElementById("error").innerHTML =
        "Please, check your email you have entered";
    }
  });
  form.reset();
});
