// we have access to io() because of the script tag
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join Chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Catch from the server
// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Event listener for this form
// Message submit 
chatForm.addEventListener('submit', (e) => {
  // when you submit a form, it automatically submits to a file
  // to prevent the default behavior
  e.preventDefault();

  // get message value
  const msg = e.target.elements.msg.value;
  // const msg = document.getElementById('msg').value;

  // Emit message to the server
  socket.emit('chatMessage', msg);

  // clear input
  e.target.elements.msg.value = '';
  // I found it unuseful
  e.target.elements.msg.focus();
});

// Output Message to DOM
// we did here DOM manipulation to be able to add a new div when a user sends a message
function outputMessage(message) {
  const div = document.createElement('div');
  // it is used to manipulate the class list
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
  <p class ="text">
  ${message.text}
  </p>`;
  // selcet the class 
  // appending the child div to it
  document.querySelector('.chat-messages').appendChild(div);
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
};

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
};