const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');

// Append function
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position=='left') {
        audio.play();
    }
    
};

// Ask user for their name
const name = prompt("Enter your name to join.");
socket.emit('new-user-joined', name);

// Show notification when new user joins
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// When a message is received
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// When a user leaves
socket.on('user-left', name => {
    append(`${name} left the chat`, 'left');
});

// When you send a message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim() !== '') {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});
