// we have access to io() because of the script tag
// we added
const socket = io();

// catch from the server
socket.on('message', messsage => {
  console.log(messsage);
});