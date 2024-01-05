const socket = io();
const chatBox = document.getElementById("chatBox");
const btnSend = document.getElementById("btnSendMessage");
//const messageLogs = document.getElementById("messageLogs");
let user = "";

const emailInput = async()=> {
  const {value: e} = await Swal.fire({
      title: "Welcome to Ecommerce-Chat!",
      text: "Please enter your User. Example: JohnDoe@email.com",
      input: "email",
      inputLabel: "Your email address",
      inputPlaceholder: "user@email.com"
  });
  user = e;
  socket.emit("newChatUser", user)
}
emailInput()

sendMessageToSocket = () => {
  if (chatBox.value.trim().length > 0) {
    socket.emit("newMessage", { user: user, message: chatBox.value.trim() });
    chatBox.value = "";
  }
};

chatBox.addEventListener("keyup", (e) => {
  e.key === "Enter" && sendMessageToSocket();
});

btnSend.addEventListener("click", () => {
  sendMessageToSocket();
});

//eventos socket escuchados
socket.on("newChatUser", (data) => {
  Swal.fire({
    position: "top-end",
    title: data,
    showConfirmButton: false,
    timer: 1000,
  });
});

socket.on("messages", (data) => {
  let html = ``;

  data.forEach((item) => {
    html += `<div class="row mb-3">
        <div class="col-md-11"><b>${item.user}:</b><span class="fw-light"> ${item.message}</span></div>
        </div>`;
  });

  messageLogs.innerHTML = html;
});
