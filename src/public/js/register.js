const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(res.statusTest);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      //ejecuto y espero 2 segundos successAlert y cuando termina redirecciono a login
      userSuccessAlert();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    })
    .catch((err) => {
      console.log(err);
      userErrorAlert(err);
      document.getElementById("error").innerHTML =
        "User already exists! Please check your email and password";
    });
});

const userSuccessAlert = async () => {
  let timerInterval;
  Swal.fire({
    icon: "success",
    title: "User registered successfully",
    html: "Redirecting to login in <b></b> milliseconds.",
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("I was closed by the timer");
    }
  });
};

const userErrorAlert = async (data) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: data,
  });
};
