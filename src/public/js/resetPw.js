const form = document.getElementById("resetForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  try {
    const response = await fetch("/api/users/updatePW", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      userSuccessAlert();
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      if (response.status == 400) {
        const result = await response.json();
        console.log(result);
        userErrorAlert(result.message);
      }
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
});

const userSuccessAlert = async () => {
  let timerInterval;
  Swal.fire({
    icon: "success",
    title: "Password reset!",
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
