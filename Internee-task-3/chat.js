const socket = io();

function joinRoom() {
  const username = document.getElementById('username').value;
  const room = document.getElementById('room').value;
  
  if (username && room) {
    socket.emit('joinRoom', { username, room });
  }
}

function sendMessage() {
  const message = document.getElementById('message-input').value;
  const room = document.getElementById('room').value;
  const username = document.getElementById('username').value;

  if (message && room && username) {
    socket.emit('chatMessage', { room, message, username });
    document.getElementById('message-input').value = '';
  }
}

socket.on('message', (message) => {
  const messageContainer = document.getElementById('message-container');
  const msgElement = document.createElement('div');
  msgElement.textContent = message;
  messageContainer.appendChild(msgElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('roomUsers', (users) => {
  const userList = document.getElementById('room-users');
  userList.innerHTML = '';
  users.forEach(user => {
    const userElement = document.createElement('li');
    userElement.textContent = user.username;
    userList.appendChild(userElement);
  });
});
