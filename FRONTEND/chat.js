const socket = new WebSocket("wss://chat-app-html-y7vy.onrender.com");
// const socket = new WebSocket("ws://localhost:8000");

socket.onopen = () => {
  console.log("Connected to server");
};

socket.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  const li = document.createElement("li");
  li.textContent = `${msg.sender}: ${msg.text}`;
  document.getElementById("chat").appendChild(li);
};

function sendMessage() {
  const sender = document.getElementById("sender").value;
  const receiver = document.getElementById("receiver").value;
  const text = document.getElementById("message").value;

  const msg = {
    sender,
    receiver,
    text
  };

  socket.send(JSON.stringify(msg));
}
